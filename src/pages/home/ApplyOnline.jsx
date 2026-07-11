import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
// Import shared bits from emrsShared.jsx (NOT from ./homepage). homepage.jsx
// imports this file (ApplyOnlineModal) at the top of its module, so if this
// file imported T/EMRS_PINS/BodoWeaveBackground back from homepage.jsx we'd
// have a circular import — homepage.jsx wouldn't have finished initializing
// `T` yet by the time this file's top-level code ran, causing
// "Cannot access 'T' before initialization". emrsShared.jsx has no
// dependency on either file, so importing from it avoids the cycle.
import { T, EMRS_PINS, BodoWeaveBackground } from "./emrsShared";

// ─────────────────────────────────────────────────────────────────────────────
// ★ OCR LOADER — Tesseract.js, loaded from CDN on first use
// Used to verify that the candidate's name, date of birth, Aadhaar number
// (entered on Page 1), and — for the ST Certificate — parent's name and
// reservation category (Page 2 / Page 4) actually appear on the uploaded
// document image. Loaded lazily/once, the same pattern used for Chart.js
// elsewhere in this app. Everything runs client-side in the browser
// (WASM) — no document image is uploaded to any server for this check.
// ─────────────────────────────────────────────────────────────────────────────
let tesseractLoaded = false;
let tesseractCallbacks = [];

function loadTesseract(cb) {
  if (tesseractLoaded) { cb(); return; }
  tesseractCallbacks.push(cb);
  if (tesseractCallbacks.length > 1) return;
  const s = document.createElement("script");
  s.src = "https://unpkg.com/tesseract.js@5.0.4/dist/tesseract.min.js";
  s.onload = () => { tesseractLoaded = true; tesseractCallbacks.forEach(fn => fn()); tesseractCallbacks = []; };
  document.head.appendChild(s);
}

// Uppercase + strip everything except letters/spaces, collapse whitespace.
// Used to compare OCR output against the name fields without punctuation,
// accents, or casing tripping up the match.
function normalizeNameText(s) {
  return (s || "").toUpperCase().replace(/[^A-Z\s]/g, " ").replace(/\s+/g, " ").trim();
}

// Returns true if every "real" word (length > 1) of `name` appears
// somewhere in the OCR'd certificate text.
function nameAppearsInText(name, ocrText) {
  const words = normalizeNameText(name).split(" ").filter(w => w.length > 1);
  if (words.length === 0) return true; // nothing to check against
  return words.every(w => ocrText.includes(w));
}

// Extract only the digits from raw OCR text — used for matching Aadhaar
// numbers and dates of birth regardless of spacing/formatting on the doc.
function extractDigitsOnly(s) {
  return (s || "").replace(/\D+/g, "");
}

// Build a handful of common date-format variants (as printed on Indian ID
// documents) for a given <input type="date"> value ("YYYY-MM-DD"), so we
// can look for a date-of-birth match in the OCR'd text regardless of which
// format the document actually prints it in (DD/MM/YYYY, DD-MM-YYYY, etc.).
function dobFormatVariants(dobStr) {
  if (!dobStr) return [];
  const parts = dobStr.split("-");
  if (parts.length !== 3) return [];
  const [y, m, d] = parts;
  const mNum = String(parseInt(m, 10));
  const dNum = String(parseInt(d, 10));
  return [
    `${d}/${m}/${y}`, `${d}-${m}-${y}`, `${d}.${m}.${y}`,
    `${dNum}/${mNum}/${y}`, `${dNum}-${mNum}-${y}`,
    `${y}/${m}/${d}`, `${y}-${m}-${d}`,
    `${d}${m}${y}`, `${y}${m}${d}`,
  ];
}

// Returns true if the candidate's date of birth appears anywhere in the
// OCR'd document text, tried against several common date formats.
function dobAppearsInText(dobStr, rawOcrText, digitsOnly) {
  if (!dobStr) return null; // nothing to check against
  const variants = dobFormatVariants(dobStr);
  const collapsed = (rawOcrText || "").replace(/\s+/g, " ");
  const collapsedNoSpace = collapsed.replace(/\s/g, "");
  for (const v of variants) {
    if (collapsed.includes(v)) return true;
    if (collapsedNoSpace.includes(v.replace(/\s/g, ""))) return true;
    const digitsOfVariant = v.replace(/\D/g, "");
    if (digitsOfVariant.length >= 6 && digitsOnly.includes(digitsOfVariant)) return true;
  }
  return false;
}

// Returns true if the candidate's Aadhaar number appears anywhere in the
// OCR'd text (ignoring any spacing used to print it in groups of four).
function aadhaarNumberAppearsInText(aadhaarStr, digitsOnly) {
  if (!aadhaarStr || aadhaarStr.length !== 12) return null;
  return digitsOnly.includes(aadhaarStr);
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ GIS DISTANCE HELPERS — used on the EMRS Preference page to auto-rank
// schools by straight-line ("as the crow flies") distance from the
// candidate's home address (Village / Block / District / PIN from Page 1).
// ─────────────────────────────────────────────────────────────────────────────

// Great-circle distance between two lat/lng points, in kilometres.
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Builds a human-readable address string out of whatever the candidate has
// filled in on Page 1 (Village / Block / District / PIN) — used for display
// purposes (e.g. "Nearest EMRS schools to ...").
function buildCandidateAddressQuery(formData) {
  const parts = [];
  if (formData.village) parts.push(formData.village);
  if (formData.block) parts.push(formData.block);
  if (formData.district && formData.district !== "Other") parts.push(formData.district);
  parts.push("Assam", "India");
  if (formData.pinCode && /^\d{6}$/.test(formData.pinCode)) parts.push(formData.pinCode);
  return parts.join(", ");
}

// Approximate district-headquarters coordinates for every Assam district in
// ASSAM_DISTRICTS. Used ONLY as a last-resort fallback when live geocoding
// of the candidate's actual village/block/PIN comes back with no match
// (common for small villages that aren't in OpenStreetMap's index, e.g.
// "Silonijan"). District-level is coarser than a real address match, but it
// still lets the nearest-school ranking work instead of failing outright.
const ASSAM_DISTRICT_CENTROIDS = {
  "Baksa": { lat: 26.6167, lon: 91.2167 },
  "Bajali": { lat: 26.6667, lon: 91.2333 },
  "Barpeta": { lat: 26.3225, lon: 91.0064 },
  "Biswanath": { lat: 26.7333, lon: 93.1500 },
  "Bongaigaon": { lat: 26.4769, lon: 90.5586 },
  "Cachar": { lat: 24.8333, lon: 92.7789 },
  "Charaideo": { lat: 27.0333, lon: 95.0333 },
  "Chirang": { lat: 26.5500, lon: 90.6500 },
  "Darrang": { lat: 26.4333, lon: 92.0333 },
  "Dhemaji": { lat: 27.4833, lon: 94.5667 },
  "Dhubri": { lat: 26.0197, lon: 89.9847 },
  "Dibrugarh": { lat: 27.4728, lon: 94.9120 },
  "Dima Hasao": { lat: 25.1667, lon: 93.0167 },
  "Goalpara": { lat: 26.1667, lon: 90.6167 },
  "Golaghat": { lat: 26.5167, lon: 93.9667 },
  "Hailakandi": { lat: 24.6833, lon: 92.5667 },
  "Hojai": { lat: 26.0000, lon: 92.8500 },
  "Jorhat": { lat: 26.7500, lon: 94.2167 },
  "Kamrup": { lat: 26.2000, lon: 91.5000 },
  "Kamrup Metropolitan": { lat: 26.1445, lon: 91.7362 },
  "Karbi Anglong": { lat: 25.8333, lon: 93.4333 },
  "West Karbi Anglong": { lat: 25.8500, lon: 92.7000 },
  "Karimganj": { lat: 24.8667, lon: 92.3500 },
  "Kokrajhar": { lat: 26.4000, lon: 90.2667 },
  "Lakhimpur": { lat: 27.2333, lon: 94.1000 },
  "Majuli": { lat: 26.9500, lon: 94.2000 },
  "Morigaon": { lat: 26.2500, lon: 92.3500 },
  "Nagaon": { lat: 26.3500, lon: 92.6833 },
  "Nalbari": { lat: 26.4333, lon: 91.4333 },
  "Sivasagar": { lat: 26.9833, lon: 94.6333 },
  "Sonitpur": { lat: 26.6338, lon: 92.7938 },
  "South Salmara-Mankachar": { lat: 25.9000, lon: 89.9000 },
  "Tinsukia": { lat: 27.4833, lon: 95.3500 },
  "Udalguri": { lat: 26.7500, lon: 92.1000 },
};

// Turns the candidate's Page 1 address into { lat, lon }, trying several
// queries from most to least specific against OpenStreetMap's free Nominatim
// geocoder (no API key required — only the typed address text is sent,
// nothing else about the candidate). If every live lookup comes back empty
// (e.g. a small village Nominatim doesn't index, like "Silonijan"), falls
// back to the candidate's district centroid so the ranking never simply
// fails outright.
// NOTE: Nominatim's public endpoint is rate-limited (~1 request/second) and
// meant for light/demo use — a production deployment handling real
// applicant volumes should switch to a licensed geocoding provider (e.g.
// Google Maps Geocoding API, MapmyIndia, or a self-hosted Nominatim
// instance) and add proper attribution.
async function geocodeCandidateAddress(formData) {
  const village = (formData.village || "").trim();
  const block = (formData.block || "").trim();
  const district = (formData.district || "").trim();
  const pinCode = (formData.pinCode || "").trim();
  const validPin = /^\d{6}$/.test(pinCode);

  const attempts = [];
  if (village) {
    attempts.push({ label: "the candidate's village", q: [village, block, district, "Assam", "India"].filter(Boolean).join(", ") });
  }
  if (validPin) {
    attempts.push({ label: "the candidate's PIN code", q: `${pinCode}, Assam, India` });
  }
  if (block) {
    attempts.push({ label: "the candidate's block", q: [block, district, "Assam", "India"].filter(Boolean).join(", ") });
  }
  if (district && district !== "Other") {
    attempts.push({ label: "the candidate's district", q: [district, "Assam", "India"].join(", ") });
  }

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    try {
      const qs = new URLSearchParams({ format: "json", limit: "1", countrycodes: "in", q: attempt.q }).toString();
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`, { headers: { Accept: "application/json" } });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), matchedOn: attempt.label, approximate: false };
        }
      }
    } catch (err) {
      // fall through and try the next, coarser query
    }
    // Be polite to Nominatim's shared public endpoint between attempts.
    if (i < attempts.length - 1) await new Promise(r => setTimeout(r, 300));
  }

  // Nothing matched live — fall back to the district centroid, if known.
  if (district && ASSAM_DISTRICT_CENTROIDS[district]) {
    const c = ASSAM_DISTRICT_CENTROIDS[district];
    return { lat: c.lat, lon: c.lon, matchedOn: `the ${district} district (approximate — exact village not found)`, approximate: true };
  }

  return null;
}

// Ranks every EMRS school in EMRS_PINS by distance (km) from a given
// { lat, lon } point, nearest first.
function rankSchoolsByDistance(origin) {
  return EMRS_PINS
    .map(school => ({ ...school, distanceKm: haversineKm(origin.lat, origin.lon, school.lat, school.lng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ DOCUMENT CHECKLIST — icons + which items get automatic identity checks
// ─────────────────────────────────────────────────────────────────────────────
const DOC_ICONS = {
  passportPhoto: "🪪",
  candidateSignature: "✍️",
  birthCertificate: "📄",
  aadhaarDoc: "🆔",
  stCertificate: "🏷️",
  residenceCertificate: "🏠",
  incomeCertificate: "💰",
  bonafideCertificate: "🎓",
  disabilityCertificate: "♿",
  sportsCertificate: "🏅",
};

// Which checklist keys are automatically cross-checked against form data,
// and a short description shown in the page intro / summary banner.
const AUTO_CHECKED_DOCS = ["aadhaarDoc", "stCertificate"];

// ─────────────────────────────────────────────────────────────────────────────
// ★ SIGNATURE PAD (shared by declaration steps)
// ─────────────────────────────────────────────────────────────────────────────
function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPtRef = useRef({ x: 0, y: 0 });
  const hasInkRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = T.brownDark;
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    lastPtRef.current = getPos(e);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pt = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPtRef.current = pt;
    hasInkRef.current = true;
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (hasInkRef.current) onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
    onChange(null);
  };

  return (
    <div>
      <div style={{ position: "relative", border: `1.5px dashed ${value ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 10, background: "#fdfaf3", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 130, display: "block", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        />
        {!value && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "#b89a78", fontSize: 12.5 }}>
            ✍️ Sign here using your mouse / finger
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: value ? T.green : T.faint, fontWeight: 600 }}>{value ? "✅ Signature captured" : "Signature required"}</span>
        <button type="button" onClick={clear} style={{ background: "none", border: `1px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 7, cursor: "pointer" }}>Clear</button>
      </div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#5a3e28", marginBottom: 6, letterSpacing: 0.2 }}>
      {children}{required && <span style={{ color: "#c0392b" }}> *</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
  fontSize: 13, color: T.brownDark, background: "#fff", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };
const textAreaStyle = { ...inputStyle, minHeight: 72, resize: "vertical" };

// ─────────────────────────────────────────────────────────────────────────────
// ★ APPLICATION FORM STEP DEFINITIONS — Page 1 → Page 6
// Field-driven config so every page is rendered by one generic component.
// Mirrors the "EMRS Entrance Test (EMRSST) Application Form": Page 1 covers
// Application Details + Section A (Applicant Details, incl. candidate photo
// and auto-generated application number); Pages 2–5 cover Sections B–E;
// Page 6 combines Section G (Document Checklist) with Section H (Medical
// Information). Declarations (Sections I & J of the source form) get their
// own upload+signature step immediately before the final preview.
// ─────────────────────────────────────────────────────────────────────────────
const ASSAM_DISTRICTS = [
  "Baksa","Bajali","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang",
  "Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat",
  "Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong",
  "West Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon",
  "Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia",
  "Udalguri","Other",
];

const YES_NO = ["Yes", "No"];

const APPLICATION_STEPS = [
  {
    key: "1",
    title: "Page 1: Applicant Details",
    icon: "🧑‍🎓",
    intro: "Basic information",
    hasAppNo: true,
    hasPhotoUpload: false,
    fields: [
      { name: "academicSession", label: "Academic Session", type: "text", placeholder: "e.g. 2026–27" },
      { name: "classApplied", label: "Class Applied", type: "select", options: ["VI", "VIII", "IX", "X","XI","XII"] },
      { name: "candidateName", label: "Candidate Name", type: "text", placeholder: "As per birth certificate" },
      { name: "aadhaar", label: "Aadhaar Number", type: "text", placeholder: "12-digit Aadhaar", pattern: /^\d{12}$/, patternMsg: "Enter a valid 12-digit Aadhaar number" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "age", label: "Age (as on 31 March)", type: "text", placeholder: "In years" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
      { name: "bloodGroup", label: "Blood Group", type: "select", options: ["A+","A-","B+","B-","AB+","AB-","O+","O-","Not known"] },
      { name: "reservationCategory", label: "Reservation Category", type: "select", options: ["ST(P)","ST(H)"] },
      { name: "tribeName", label: "Tribe Name", type: "select", options: ["Chakma","Dimasa Kachari","Garo","Hajong","Hmar","Khasi","Jaintia","Synteng","Pnar","War","Bhoi","Lyngngam","Kuki","Lakher","Man","Mizo","Karbi","Naga","Pawi","Syntheng","Lalung",
        "Barmans in Cachar ","Boro","Borokachari","Deori","Hojai","Kachari", "Sonowal","Mech" 

     ] },
      { name: "disabilityStatus", label: "Disability Status", type: "select", options: ["None","Yes — Locomotor","Yes — Visual","Yes — Hearing","Yes — Other"] },
      { name: "permanentResident", label: "Permanent Resident of Assam", type: "select", options: YES_NO },
      { name: "district", label: "District", type: "select", options: ASSAM_DISTRICTS },
      { name: "block", label: "Block", type: "text" },
      { name: "village", label: "Village", type: "text" },
      { name: "pinCode", label: "PIN Code", type: "text", placeholder: "6-digit PIN", pattern: /^\d{6}$/, patternMsg: "Enter a valid 6-digit PIN code" },
      { name: "mobile", label: "Mobile Number", type: "text", placeholder: "10-digit mobile number", pattern: /^\d{10}$/, patternMsg: "Enter a valid 10-digit mobile number" },
      { name: "email", label: "Email ID", type: "email", placeholder: "you@example.com" },
    ],
  },
  {
    key: "2",
    title: "Page 2: Parent/Guardian Details",
    icon: "👨‍👩‍👧",
    intro: "Details of the candidate's parents or legal guardian.",
    fields: [
      { name: "fatherName", label: "Father's Name", type: "text" },
      { name: "motherName", label: "Mother's Name", type: "text" },
      { name: "guardianName", label: "Guardian Name (if applicable)", type: "text" },
      { name: "occupation", label: "Occupation", type: "text" },
      { name: "annualIncome", label: "Annual Family Income", type: "select", options: ["Below ₹1 Lakh","₹1–2.5 Lakh","₹2.5–5 Lakh","₹5–8 Lakh","Above ₹8 Lakh"] },
      { name: "fatherMobile", label: "Father's Mobile", type: "text", placeholder: "10-digit mobile number", pattern: /^\d{10}$/, patternMsg: "Enter a valid 10-digit mobile number" },
      { name: "motherMobile", label: "Mother's Mobile", type: "text", placeholder: "10-digit mobile number", pattern: /^\d{10}$/, patternMsg: "Enter a valid 10-digit mobile number" },
    ],
  },
  {
    key: "3",
    title: "Page 3: Educational Details",
    icon: "🏫",
    intro: "Details of the school the candidate currently attends.",
    fields: [
      { name: "presentSchool", label: "Present School", type: "text" },
      { name: "udiseCode", label: "UDISE Code", type: "text" },
      { name: "schoolType", label: "School Type", type: "select", options: ["Government","Government-aided","Private","EMRS","Other"] },
      { name: "currentClass", label: "Current Class", type: "text", placeholder: "e.g. V or VII" },
      { name: "classPassed", label: "Class Passed", type: "text" },
      { name: "yearOfPassing", label: "Year of Passing", type: "text", placeholder: "e.g. 2025", pattern: /^(19|20)\d{2}$/, patternMsg: "Enter a valid 4-digit year" },
      { name: "rollNumber", label: "Roll Number", type: "text" },
      { name: "mediumOfInstruction", label: "Medium of Instruction", type: "select", options: ["Assamese","English","Bodo","Hindi","Bengali","Other"] },
    ],
  },
  {
    key: "4",
    title: "Page 4: Reservation / Special Category",
    icon: "📑",
    intro: "Tick any special quota or category that applies to the candidate.",
    fields: [
      { name: "blockQuota", label: "Block Quota", type: "checkbox" },
      { name: "districtQuota", label: "District Quota", type: "checkbox" },
      { name: "stateQuota", label: "State Quota", type: "checkbox" },
      { name: "pvtg", label: "PVTG", type: "checkbox" },
      { name: "dntSnt", label: "DNT/SNT", type: "checkbox" },
      { name: "orphan", label: "Orphan", type: "checkbox" },
      { name: "childOfWidow", label: "Child of Widow", type: "checkbox" },
      { name: "divyang", label: "Divyang", type: "checkbox" },
      { name: "sportsQuota", label: "Sports Quota", type: "checkbox" },
    ],
  },
  {
    key: "5",
    title: "Page 5: EMRS Preference",
    icon: "🎯",
    intro: "Rank up to five EMRS schools in order of preference. The schools nearest to the candidate's home address (from Page 1) are auto-filled first — you can change any of them.",
    isEmrsPreference: true,
    fields: [
      { name: "preference1", label: "Preference 1", type: "select", options: EMRS_PINS.map(s => s.name) },
      { name: "preference2", label: "Preference 2", type: "select", options: EMRS_PINS.map(s => s.name) },
      { name: "preference3", label: "Preference 3", type: "select", options: EMRS_PINS.map(s => s.name) },
      { name: "preference4", label: "Preference 4", type: "select", options: EMRS_PINS.map(s => s.name) },
      { name: "preference5", label: "Preference 5", type: "select", options: EMRS_PINS.map(s => s.name) },
      { name: "questionPaperLanguage", label: "Question Paper Language", type: "select", options: ["Assamese","English","Bodo","Hindi","Bengali"] },
    ],
  },
  {
    key: "6",
    title: "Page 6: Document Checklist & Medical Information",
    icon: "📎",
    intro: "Confirm each supporting document is ready, then share basic medical information kept on file for the candidate's safety at the hostel.",
    isChecklist: true,
    checklistItems: [
      { key: "passportPhoto", label: "Passport Photograph", required: false },
      { key: "candidateSignature", label: "Candidate Signature", required: false },
      { key: "birthCertificate", label: "Birth Certificate", required: false },
      { key: "aadhaarDoc", label: "Aadhaar", required: false },
      { key: "stCertificate", label: "ST Certificate", required: false },
      { key: "residenceCertificate", label: "Residence Certificate", required: false },
      { key: "incomeCertificate", label: "Income Certificate", required: false },
      { key: "bonafideCertificate", label: "Bonafide Certificate", required: false },
      { key: "disabilityCertificate", label: "Disability Certificate (if applicable)", required: false },
      { key: "sportsCertificate", label: "Sports Certificate (if applicable)", required: false },
    ],
    fields: [
      { name: "medicalBloodGroup", label: "Blood Group", type: "select", options: ["A+","A-","B+","B-","AB+","AB-","O+","O-","Not known"] },
      { name: "allergies", label: "Allergies", type: "text", placeholder: "e.g. none / peanuts / dust" },
      { name: "medicalCondition", label: "Medical Condition", type: "textarea", placeholder: "Any condition the school should be aware of" },
      { name: "emergencyContact", label: "Emergency Contact", type: "text", placeholder: "10-digit mobile number", pattern: /^\d{10}$/, patternMsg: "Enter a valid 10-digit mobile number" },
    ],
  },
];

const TOTAL_DATA_STEPS = APPLICATION_STEPS.length; // 6 pages
const STEP_DECLARATIONS = TOTAL_DATA_STEPS;         // index 6
const STEP_PREVIEW = TOTAL_DATA_STEPS + 1;           // index 7
const TOTAL_STEPS = TOTAL_DATA_STEPS + 2;            // 6 pages + declarations + preview
const EMRS_PREFERENCE_STEP_INDEX = APPLICATION_STEPS.findIndex(s => s.isEmrsPreference);

function StepProgress({ current }) {
  const allLabels = [...APPLICATION_STEPS.map(s => s.key), "Declare", "Preview"];
  const pct = Math.round((current / (allLabels.length - 1)) * 100);
  return (
    <div>
      {/* Overall completion bar — gives the wizard a sense of automated
          progress tracking beyond just the step dots below. */}
      <div style={{ height: 5, background: "rgba(139,69,19,0.1)", borderRadius: 20, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#8b4513,#c8781e)", borderRadius: 20, transition: "width 0.35s ease" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, overflowX: "auto", padding: "2px 2px 10px" }}>
        {allLabels.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10.5, fontWeight: 800, flexShrink: 0,
                background: active ? "linear-gradient(135deg,#8b4513,#c8781e)" : done ? "rgba(45,106,79,0.15)" : "rgba(139,69,19,0.08)",
                color: active ? "#fff" : done ? T.green : T.faint,
                border: active ? "none" : `1px solid ${done ? "rgba(45,106,79,0.3)" : "rgba(139,69,19,0.15)"}`,
                boxShadow: active ? "0 2px 8px rgba(139,69,19,0.35)" : "none",
                transition: "all 0.2s",
              }}>
                {done ? "✓" : label}
              </div>
              {i < allLabels.length - 1 && (
                <div style={{ width: 14, height: 2, background: done ? "rgba(45,106,79,0.4)" : "rgba(139,69,19,0.15)", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GenericField({ field, value, error, onChange }) {
  const { name, label, type, required, options, placeholder } = field;
  const [focused, setFocused] = useState(false);
  const focusStyle = focused ? { borderColor: T.brownLight, boxShadow: "0 0 0 3px rgba(200,120,30,0.12)" } : {};

  // Tick-only fields (e.g. reservation/special-category quotas): a single
  // checkbox that stores a boolean, instead of a Yes/No dropdown.
  if (type === "checkbox") {
    return (
      <div>
        <label style={{
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          padding: "10px 12px", borderRadius: 8,
          border: `1px solid ${value ? "rgba(45,106,79,0.4)" : T.border}`,
          background: value ? "#eaf6f1" : "#fff", transition: "all 0.15s",
        }}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(name, e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer", flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: T.brownDark }}>
            {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
          </span>
        </label>
        {error && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      {type === "select" ? (
        <select
          style={{ ...selectStyle, ...focusStyle }}
          value={value || ""}
          onChange={e => onChange(name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <option value="">Select</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea
          style={{ ...textAreaStyle, ...focusStyle }}
          value={value || ""}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type === "date" ? "date" : type === "email" ? "email" : "text"}
          style={{ ...inputStyle, ...focusStyle }}
          value={value || ""}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={field.pattern && field.name.match(/mobile|aadhaar|pin|contact/i) ? (field.name === "aadhaar" ? 12 : field.name === "pinCode" ? 6 : 10) : undefined}
        />
      )}
      {error && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{error}</div>}
    </div>
  );
}

// Visual styling per verification status — used by ChecklistRow's message
// banner and its little status dot.
const VERIFICATION_STYLES = {
  checking: { bg: "#fdf3e3", border: "rgba(139,69,19,0.25)", text: T.brown, dot: T.brownLight },
  match: { bg: "#eaf6f1", border: "rgba(45,106,79,0.3)", text: T.green, dot: T.green },
  mismatch: { bg: "#fdeaea", border: "rgba(192,57,43,0.3)", text: "#a83232", dot: "#c0392b" },
  error: { bg: "#fdeaea", border: "rgba(192,57,43,0.3)", text: "#a83232", dot: "#c0392b" },
  unsupported: { bg: "#fff6e8", border: "rgba(200,120,30,0.3)", text: "#8b6914", dot: T.brownLight },
};

function ChecklistRow({ item, checked, file, onToggle, onFile, verification }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const vStatus = verification?.status;
  const vStyle = VERIFICATION_STYLES[vStatus] || VERIFICATION_STYLES.unsupported;
  const isAutoChecked = AUTO_CHECKED_DOCS.includes(item.key);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(item.key, dropped);
  };

  const borderColor = vStatus === "mismatch" || vStatus === "error"
    ? "rgba(192,57,43,0.45)"
    : checked ? "rgba(45,106,79,0.35)" : dragOver ? "rgba(200,120,30,0.5)" : T.border;
  const bg = vStatus === "mismatch" || vStatus === "error"
    ? "#fdf2f1"
    : checked ? "#eaf6f1" : dragOver ? "#fff6e8" : "#fdfaf3";

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1.5px solid ${borderColor}`, borderRadius: 10, background: bg, transition: "all 0.15s" }}
      >
        <input type="checkbox" checked={!!checked} onChange={e => onToggle(item.key, e.target.checked)} style={{ width: 18, height: 18, flexShrink: 0, cursor: "pointer" }} />
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(139,69,19,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
          {DOC_ICONS[item.key] || "📄"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.brownDark, display: "flex", alignItems: "center", gap: 6 }}>
            {item.label}{item.required && <span style={{ color: "#c0392b" }}> *</span>}
            {isAutoChecked && (
              <span style={{ fontSize: 9, fontWeight: 700, color: T.brown, background: "rgba(139,69,19,0.08)", border: "1px solid rgba(139,69,19,0.18)", borderRadius: 20, padding: "1px 7px", letterSpacing: 0.3 }}>🤖 auto-checked</span>
            )}
          </div>
          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file ? file.name : "Drag & drop or click Attach — optional"}
          </div>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} style={{ background: file ? "none" : "linear-gradient(135deg,#8b4513,#c8781e)", color: file ? T.brown : "#fff", border: file ? `1px solid rgba(139,69,19,0.25)` : "none", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 7, cursor: "pointer", flexShrink: 0 }}>{file ? "Replace" : "Attach"}</button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => onFile(item.key, e.target.files?.[0] || null)} />
      </div>
      {verification && verification.message && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          fontSize: 11.5, lineHeight: 1.5, marginTop: 6, padding: "8px 12px",
          borderRadius: 8, background: vStyle.bg, border: `1px solid ${vStyle.border}`, color: vStyle.text,
        }}>
          {vStatus === "checking" ? (
            <span style={{ flexShrink: 0, width: 12, height: 12, marginTop: 2, borderRadius: "50%", border: `2px solid ${vStyle.text}`, borderTopColor: "transparent", animation: "stCertSpin 0.8s linear infinite" }} />
          ) : (
            <span style={{ flexShrink: 0, width: 8, height: 8, marginTop: 3, borderRadius: "50%", background: vStyle.dot }} />
          )}
          <span>{verification.message}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ APPLY ONLINE — Section-by-section wizard → Declarations upload → Preview
// ─────────────────────────────────────────────────────────────────────────────
function ApplyOnlineModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  // Auto-generated once when the application is opened, shown read-only on Page 1.
  const [appNo] = useState(() => "EMRS" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000));
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [checklistFiles, setChecklistFiles] = useState({});
  // Identity-verification results for documents that get an automatic
  // cross-check against form data. For Aadhaar: name, date of birth, and
  // Aadhaar number. For ST Certificate: name, parent's name, and category.
  // Shape: { [checklistKey]: { status: "checking"|"match"|"mismatch"|"error"|"unsupported", message } }
  const [docVerification, setDocVerification] = useState({});
  // GIS lookup state for the EMRS Preference page: geocodes the candidate's
  // Page 1 address (Village/Block/District/PIN) and ranks every EMRS school
  // by straight-line distance from it, nearest first.
  // Shape: { status: "idle"|"loading"|"success"|"error", message, results: [{...school, distanceKm}] }
  const [geoState, setGeoState] = useState({ status: "idle", message: "", approximate: false, results: [] });
  const [declarations, setDeclarations] = useState({
    candidateAgree: false,
    candidateSignature: null,
    candidateFile: null,
    parentAgree: false,
    parentSignature: null,
    parentFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  const photoInputRef = useRef(null);
  const candidateFileRef = useRef(null);
  const parentFileRef = useRef(null);
  const bodyRef = useRef(null);

  const update = (name, value) => setFormData(f => ({ ...f, [name]: value }));

  const scrollTop = () => { if (bodyRef.current) bodyRef.current.scrollTop = 0; };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrors(er => ({ ...er, photo: "Please upload a JPG or PNG photo." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(er => ({ ...er, photo: "Photo is too large — please keep it under 2 MB." }));
      return;
    }
    setErrors(er => ({ ...er, photo: undefined }));
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const toggleChecklist = (key, val) => setChecklist(c => ({ ...c, [key]: val }));

  // ── Automatic identity verification (Aadhaar / ST Certificate) ──
  // Runs OCR entirely in the browser via Tesseract.js and cross-checks the
  // extracted text against details typed into earlier pages of the form:
  //   • Aadhaar          → candidate's name, date of birth, Aadhaar number
  //   • ST Certificate   → candidate's name, parent's name, category
  const runVerification = async (key, file) => {
    if (!AUTO_CHECKED_DOCS.includes(key)) return;

    if (!file.type || !file.type.startsWith("image/")) {
      setDocVerification(v => ({
        ...v,
        [key]: { status: "unsupported", message: "Automatic verification only works on image uploads (JPG/PNG). This looks like a PDF — please double-check the details on it yourself." },
      }));
      return;
    }

    const candidateName = (formData.candidateName || "").trim();
    const fatherName = (formData.fatherName || "").trim();
    const motherName = (formData.motherName || "").trim();
    const category = formData.reservationCategory;
    const dob = (formData.dob || "").trim();
    const aadhaarNumber = (formData.aadhaar || "").trim();

    // Work out which fields need to already be filled in before we can run
    // an automatic check for this particular document type.
    const missingFields = [];
    if (!candidateName) missingFields.push("the candidate's name (Page 1)");
    if (key === "aadhaarDoc") {
      if (!dob) missingFields.push("the date of birth (Page 1)");
      if (!aadhaarNumber) missingFields.push("the Aadhaar number (Page 1)");
    }
    if (key === "stCertificate" && !fatherName && !motherName) {
      missingFields.push("the parent's name (Page 2)");
    }

    if (missingFields.length > 0) {
      setDocVerification(v => ({
        ...v,
        [key]: {
          status: "unsupported",
          message: `Please fill in ${missingFields.join(" and ")} first — then this document will be checked automatically.`,
        },
      }));
      return;
    }

    setDocVerification(v => ({ ...v, [key]: { status: "checking", message: "Reading the document and comparing details…" } }));

    try {
      await new Promise(resolve => loadTesseract(resolve));
      const imageUrl = URL.createObjectURL(file);
      const { data } = await window.Tesseract.recognize(imageUrl, "eng");
      URL.revokeObjectURL(imageUrl);
      const rawText = data.text || "";
      const normalizedText = normalizeNameText(rawText);
      const digitsOnly = extractDigitsOnly(rawText);

      const candidateOk = nameAppearsInText(candidateName, normalizedText);

      let parentChecked = false;
      let parentOk = true;
      if (key === "stCertificate") {
        parentChecked = true;
        parentOk = (fatherName && nameAppearsInText(fatherName, normalizedText)) || (motherName && nameAppearsInText(motherName, normalizedText));
      }

      let categoryChecked = false;
      let categoryOk = true;
      if (key === "stCertificate" && category) {
        categoryChecked = true;
        if (category === "ST(H)") categoryOk = normalizedText.includes("HILL") || normalizedText.includes(" H ") || normalizedText.includes("(H)");
        else if (category === "ST(P)") categoryOk = normalizedText.includes("PLAIN") || normalizedText.includes("(P)");
      }

      // Aadhaar-specific checks: date of birth and the Aadhaar number itself.
      let dobChecked = false;
      let dobOk = true;
      let aadhaarChecked = false;
      let aadhaarOk = true;
      if (key === "aadhaarDoc") {
        dobChecked = true;
        dobOk = !!dobAppearsInText(dob, rawText, digitsOnly);
        aadhaarChecked = true;
        aadhaarOk = !!aadhaarNumberAppearsInText(aadhaarNumber, digitsOnly);
      }

      const allOk = candidateOk && parentOk && categoryOk && dobOk && aadhaarOk;

      if (allOk) {
        setDocVerification(v => ({
          ...v,
          [key]: {
            status: "match",
            message: key === "aadhaarDoc"
              ? "✅ Name, date of birth, and Aadhaar number all match this document."
              : "✅ Candidate name, parent name, and category all look consistent with this certificate.",
          },
        }));
      } else {
        const problems = [];
        if (!candidateOk) problems.push("Name");
        if (parentChecked && !parentOk) problems.push("Parent's name");
        if (categoryChecked && !categoryOk) problems.push(`${category} category`);
        if (dobChecked && !dobOk) problems.push("Date of Birth");
        if (aadhaarChecked && !aadhaarOk) problems.push("Aadhaar Number");

        setDocVerification(v => ({
          ...v,
          [key]: {
            status: "mismatch",
            message: `⚠️ Mismatch: ${problems.join(", ")} on the uploaded document ${problems.length > 1 ? "don't" : "doesn't"} match what you entered in the form. Please double-check and re-upload a clearer scan if needed.`,
          },
        }));
      }
    } catch (err) {
      setDocVerification(v => ({
        ...v,
        [key]: { status: "error", message: "Couldn't read this document automatically (blurry scan or unsupported image). Please double-check the details yourself." },
      }));
    }
  };

  const setChecklistFile = (key, file) => {
    setChecklistFiles(c => ({ ...c, [key]: file }));
    if (file) {
      setChecklist(c => ({ ...c, [key]: true }));
      runVerification(key, file);
    } else {
      setDocVerification(v => ({ ...v, [key]: undefined }));
    }
  };

  // ── Nearest-EMRS-school lookup (GIS auto-fill for the Preference page) ──
  // Geocodes the candidate's Page 1 address (trying village -> PIN -> block
  // -> district, then falling back to the district centroid if nothing else
  // matched), ranks every EMRS school by distance from it, and fills
  // Preference 1 with the nearest school, Preference 2 with the
  // second-nearest, and so on. When `overwrite` is false (the automatic
  // first run when the page opens) it only fills preference slots the
  // candidate hasn't already chosen; the "Auto-fill" button always passes
  // `overwrite: true` to redo all five.
  const runNearestSchoolLookup = async (overwrite = false) => {
    if (!formData.district && !formData.village && !formData.pinCode) {
      setGeoState({
        status: "error",
        message: "Please fill in the District, Village, and/or PIN Code on Page 1 first — then the nearest EMRS schools can be found automatically.",
        results: [],
      });
      return;
    }

    setGeoState(g => ({ ...g, status: "loading", message: "Locating the candidate's address…" }));

    try {
      const origin = await geocodeCandidateAddress(formData);
      if (!origin) {
        setGeoState({
          status: "error",
          message: `Couldn't pinpoint "${buildCandidateAddressQuery(formData)}" automatically, even at the district level. Please choose EMRS preferences manually below.`,
          results: [],
        });
        return;
      }

      const ranked = rankSchoolsByDistance(origin);
      setGeoState({
        status: "success",
        message: origin.approximate
          ? `Couldn't find an exact match for the village entered, so schools were ranked from ${origin.matchedOn}.`
          : `Nearest EMRS schools to ${origin.matchedOn} (${buildCandidateAddressQuery(formData)}).`,
        approximate: !!origin.approximate,
        results: ranked,
      });

      setFormData(f => {
        const next = { ...f };
        ["preference1", "preference2", "preference3", "preference4", "preference5"].forEach((key, i) => {
          if (ranked[i] && (overwrite || !next[key])) next[key] = ranked[i].name;
        });
        return next;
      });
    } catch (err) {
      setGeoState({
        status: "error",
        message: "Couldn't reach the location lookup service. Please choose EMRS preferences manually below.",
        results: [],
      });
    }
  };

  // Auto-run the lookup once, the first time the candidate reaches the
  // EMRS Preference page — but only if it hasn't already been run/attempted.
  useEffect(() => {
    if (step === EMRS_PREFERENCE_STEP_INDEX && geoState.status === "idle") {
      runNearestSchoolLookup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleDeclarationFile = (who) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
      setErrors(er => ({ ...er, [`${who}File`]: "Please upload a JPG, PNG, or PDF file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(er => ({ ...er, [`${who}File`]: "File is too large — please keep it under 5 MB." }));
      return;
    }
    setErrors(er => ({ ...er, [`${who}File`]: undefined }));
    setDeclarations(d => ({ ...d, [`${who}File`]: file }));
  };

  // ── Validate everything present on a single page (fields, checklist,
  // and/or the photo upload can all coexist on the same page) ──
  const validateStep = (stepIndex) => {
    const section = APPLICATION_STEPS[stepIndex];
    const newErrors = {};

    if (section.hasPhotoUpload && !photo) {
      newErrors.photo = "Please upload a passport-size photograph";
    }
    if (section.isChecklist) {
      section.checklistItems.forEach(item => {
        if (item.required && !checklist[item.key]) newErrors[item.key] = "Please confirm this document is ready";
      });
    }
    if (section.fields) {
      section.fields.forEach(f => {
        if (f.type === "checkbox") {
          if (f.required && !formData[f.name]) newErrors[f.name] = "Required";
          return;
        }
        const v = (formData[f.name] || "").toString().trim();
        if (f.required && !v) { newErrors[f.name] = "Required"; return; }
        if (v && f.pattern && !f.pattern.test(v)) newErrors[f.name] = f.patternMsg || "Invalid value";
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDeclarations = () => {
    const newErrors = {};
    // Declarations are now optional to allow easy navigation through pages during testing
    // In production, you may want to uncomment these validations:
    // if (!declarations.candidateAgree) newErrors.candidateAgree = "Please confirm the candidate declaration";
    // if (!declarations.candidateSignature) newErrors.candidateSignature = "Candidate signature is required";
    // if (!declarations.parentAgree) newErrors.parentAgree = "Please confirm the parent/guardian declaration";
    // if (!declarations.parentSignature) newErrors.parentSignature = "Parent/Guardian signature is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step < TOTAL_DATA_STEPS) {
      if (!validateStep(step)) { scrollTop(); return; }
    } else if (step === STEP_DECLARATIONS) {
      if (!validateDeclarations()) { scrollTop(); return; }
    }
    setErrors({});
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
    scrollTop();
  };

  const goBack = () => {
    setErrors({});
    setStep(s => Math.max(s - 1, 0));
    scrollTop();
  };

  const jumpTo = (index) => { setErrors({}); setStep(index); scrollTop(); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // No backend is wired up in this demo — in production this would POST
      // the full formData object, the photo, checklist attachments, and
      // both signed declarations (base64 signature + optional uploaded
      // scanned copy) to the admissions API, e.g.:
      //
      // await fetch("http://localhost:5000/api/emrs/admission/apply", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ formData, declarations, checklist }),
      // });
      await new Promise(res => setTimeout(res, 900));
      const id = "EMRS" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
      setAppId(id);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const currentSection = step < TOTAL_DATA_STEPS ? APPLICATION_STEPS[step] : null;

  // Small rollup used both on Page 6 (as a summary banner) and on the
  // Preview page (as a warning banner) so the applicant always sees the
  // state of automatic identity checks at a glance.
  const verificationSummary = AUTO_CHECKED_DOCS.reduce(
    (acc, key) => {
      const status = docVerification[key]?.status;
      if (status === "match") acc.matched += 1;
      else if (status === "mismatch" || status === "error") acc.mismatched += 1;
      else if (status === "checking") acc.checking += 1;
      return acc;
    },
    { matched: 0, mismatched: 0, checking: 0 }
  );

  // Rendered through a portal directly into document.body. This is
  // required because the site header uses `backdropFilter`, which makes
  // the header a CSS "containing block" for any `position: fixed`
  // descendant. Without the portal, this modal's `position: fixed; inset: 0`
  // would be measured against the header's small box instead of the
  // viewport, making the modal appear squashed near the top of the page.
  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "#fdf8f0", zIndex: 10050, display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <style>{`
        @keyframes stCertSpin { to { transform: rotate(360deg); } }
        @keyframes emrsFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .emrs-apply-body-anim { animation: emrsFadeIn 0.2s ease; }
      `}</style>
      <div style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", padding: "20px 40px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <BodoWeaveBackground opacity={0.1} color="#fff" />
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              🖊️ EMRS Entrance Test — Online Application
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
              {submitted ? "Application submitted" : currentSection ? currentSection.title : step === STEP_DECLARATIONS ? "Candidate & Parent/Guardian Declarations" : "Preview & Submit"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 34, height: 34, borderRadius: 8, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>×</button>
        </div>
      </div>

      {submitted ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 30px", textAlign: "center", overflowY: "auto" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 46, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.brownDark, marginBottom: 8 }}>Application Submitted Successfully</div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: "0 auto 18px" }}>
              All {TOTAL_DATA_STEPS} pages, your document checklist, passport photograph, and both signed declarations have been received. Please note your application ID for future reference and tracking.
            </p>
            <div style={{ display: "inline-block", background: "#eaf6f1", border: "1px solid rgba(45,106,79,0.25)", color: T.green, fontWeight: 800, fontSize: 15, padding: "10px 22px", borderRadius: 10, letterSpacing: 0.5, marginBottom: 22 }}>
              {appId}
            </div>
            <div>
              <button onClick={onClose} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "11px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "16px 40px 0", flexShrink: 0, maxWidth: 1100, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
            <StepProgress current={step} />
          </div>

          <div ref={bodyRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px 40px 32px" }}>
            <div className="emrs-apply-body-anim" style={{ maxWidth: 1000, margin: "0 auto" }} key={step}>
              {currentSection && (
                <>
                  <p style={{ fontSize: 12.5, color: T.muted, margin: "4px 0 18px", lineHeight: 1.6 }}>
                    <span style={{ marginRight: 6 }}>{currentSection.icon}</span>{currentSection.intro}
                  </p>

                  {/* Application No. + Candidate Photo — Page 1 only */}
                  {currentSection.hasAppNo && (
                    <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10.5, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Application No. (Auto-generated)</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.brown, marginTop: 2, letterSpacing: 0.5 }}>{appNo}</div>
                      </div>
                    </div>
                  )}
                  {currentSection.hasPhotoUpload && (
                    <div style={{ marginBottom: 16 }}>
                      <FieldLabel required>Candidate Photograph (Passport-size)</FieldLabel>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, border: `1.5px dashed ${photo ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: photo ? "#eaf6f1" : "#fdfaf3" }} onClick={() => photoInputRef.current?.click()}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Passport preview" style={{ width: 56, height: 70, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(139,69,19,0.25)", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 56, height: 70, borderRadius: 6, border: "1px dashed rgba(139,69,19,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, color: "#b89a78" }}>🧑</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: photo ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {photo ? photo.name : "Click to upload passport photograph"}
                          </div>
                          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{photo ? `${(photo.size / 1024).toFixed(0)} KB — ready` : "JPG or PNG, up to 2 MB. Plain background recommended."}</div>
                        </div>
                        {photo && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(); }} style={{ background: "none", border: `1px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 7, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={photoInputRef} type="file" accept="image/jpeg,image/jpg,image/png" style={{ display: "none" }} onChange={handlePhoto} />
                      {errors.photo && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4 }}>{errors.photo}</div>}
                    </div>
                  )}

                  {/* Document checklist — Page 6 */}
                  {currentSection.isChecklist && (
                    <div style={{ marginBottom: currentSection.fields?.length ? 20 : 0 }}>
                      {/* Automation summary banner */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px",
                        borderRadius: 10, background: verificationSummary.mismatched > 0 ? "#fdf2f1" : "rgba(139,69,19,0.05)",
                        border: `1px solid ${verificationSummary.mismatched > 0 ? "rgba(192,57,43,0.3)" : T.border}`,
                      }}>
                        <span style={{ fontSize: 18 }}>🤖</span>
                        <div style={{ fontSize: 12, color: "#5a3e28", lineHeight: 1.5 }}>
                          <strong>Aadhaar</strong> uploads are automatically scanned and cross-checked against the candidate's name, date of birth, and Aadhaar number entered earlier in this form. <strong>ST Certificate</strong> uploads are checked against the candidate's name, parent's name, and reservation category.
                          {(verificationSummary.matched > 0 || verificationSummary.mismatched > 0) && (
                            <span style={{ display: "block", marginTop: 4, fontWeight: 700 }}>
                              {verificationSummary.matched > 0 && <span style={{ color: T.green }}>✔ {verificationSummary.matched} verified  </span>}
                              {verificationSummary.mismatched > 0 && <span style={{ color: "#c0392b" }}>⚠ {verificationSummary.mismatched} need review</span>}
                            </span>
                          )}
                        </div>
                      </div>

                      {currentSection.checklistItems.map(item => (
                        <ChecklistRow
                          key={item.key}
                          item={item}
                          checked={checklist[item.key]}
                          file={checklistFiles[item.key]}
                          onToggle={toggleChecklist}
                          onFile={setChecklistFile}
                          verification={docVerification[item.key]}
                        />
                      ))}
                      {Object.keys(errors).filter(k => currentSection.checklistItems.some(it => it.key === k)).length > 0 && (
                        <div style={{ color: "#c0392b", fontSize: 11.5, marginTop: 4 }}>Please confirm all required documents (marked *) before continuing.</div>
                      )}
                    </div>
                  )}

                  {/* GIS nearest-school panel — EMRS Preference page only */}
                  {currentSection.isEmrsPreference && (
                    <div style={{
                      marginBottom: 18, padding: "12px 16px", borderRadius: 10,
                      background: geoState.status === "error" ? "#fdf2f1" : "rgba(139,69,19,0.05)",
                      border: `1px solid ${geoState.status === "error" ? "rgba(192,57,43,0.3)" : T.border}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#5a3e28", lineHeight: 1.5 }}>
                          <span style={{ fontSize: 16 }}>📍</span>
                          <span>
                            {geoState.status === "loading"
                              ? "Locating the candidate's address and ranking EMRS schools by distance…"
                              : geoState.status === "success"
                              ? <>Preferences 1–5 below have been auto-filled nearest-first. {geoState.message}</>
                              : geoState.status === "error"
                              ? geoState.message
                              : "Schools nearest to the candidate's home address can be auto-filled below."}
                          </span>
                          {geoState.status === "success" && geoState.approximate && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#8b6914", background: "rgba(200,120,30,0.12)", border: "1px solid rgba(200,120,30,0.3)", borderRadius: 20, padding: "2px 8px", flexShrink: 0, whiteSpace: "nowrap" }}>approximate</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => runNearestSchoolLookup(true)}
                          disabled={geoState.status === "loading"}
                          style={{
                            background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none",
                            padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: 11.5,
                            cursor: geoState.status === "loading" ? "default" : "pointer",
                            opacity: geoState.status === "loading" ? 0.7 : 1, flexShrink: 0,
                          }}
                        >
                          {geoState.status === "loading" ? "Locating…" : "🔄 Auto-fill nearest 5"}
                        </button>
                      </div>

                      {geoState.status === "success" && geoState.results.length > 0 && (
                        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                          {geoState.results.slice(0, 5).map((s, i) => (
                            <div key={s.name} style={{ fontSize: 11.5, color: "#5a3e28", display: "flex", gap: 6 }}>
                              <span style={{ fontWeight: 700, color: T.brown, flexShrink: 0 }}>{i + 1}.</span>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                              <span style={{ color: T.faint, flexShrink: 0, marginLeft: "auto" }}>{s.distanceKm.toFixed(1)} km</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Regular fields grid — every page that has fields */}
                  {currentSection.fields && currentSection.fields.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {currentSection.fields.map(f => (
                        <div key={f.name} style={f.type === "textarea" ? { gridColumn: "1 / -1" } : undefined}>
                          <GenericField field={f} value={formData[f.name]} error={errors[f.name]} onChange={update} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {/* ── Declarations step (Candidate + Parent/Guardian uploads) ── */}
              {step === STEP_DECLARATIONS && (
                <>
                  <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 20, background: "#fff" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: T.brownDark, marginBottom: 8 }}>Section I: Candidate Declaration</div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>
                      I declare that the information furnished is true and correct and I understand that any false information may lead to cancellation of my candidature/admission.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#5a3e28", marginBottom: 14, cursor: "pointer" }}>
                      <input type="checkbox" checked={declarations.candidateAgree} onChange={e => setDeclarations(d => ({ ...d, candidateAgree: e.target.checked }))} style={{ marginTop: 2, cursor: "pointer" }} />
                      I (the candidate) agree to the declaration above.
                    </label>
                    {errors.candidateAgree && <div style={{ color: "#c0392b", fontSize: 11, marginBottom: 10 }}>{errors.candidateAgree}</div>}

                    <FieldLabel required>Candidate Signature</FieldLabel>
                    <SignaturePad value={declarations.candidateSignature} onChange={sig => setDeclarations(d => ({ ...d, candidateSignature: sig }))} />
                    {errors.candidateSignature && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4 }}>{errors.candidateSignature}</div>}

                    <div style={{ marginTop: 14 }}>
                      <FieldLabel>Upload Signed Candidate Declaration (optional, PDF/image)</FieldLabel>
                      <div onClick={() => candidateFileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px dashed ${declarations.candidateFile ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: declarations.candidateFile ? "#eaf6f1" : "#fdfaf3" }}>
                        <span style={{ fontSize: 20 }}>{declarations.candidateFile ? "📄" : "⬆️"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: declarations.candidateFile ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {declarations.candidateFile ? declarations.candidateFile.name : "Click to upload the signed declaration"}
                          </div>
                          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{declarations.candidateFile ? `${(declarations.candidateFile.size / 1024).toFixed(0)} KB — ready` : "PDF, JPG, or PNG, up to 5 MB"}</div>
                        </div>
                        {declarations.candidateFile && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setDeclarations(d => ({ ...d, candidateFile: null })); if (candidateFileRef.current) candidateFileRef.current.value = ""; }} style={{ background: "none", border: `1px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 7, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={candidateFileRef} type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" style={{ display: "none" }} onChange={handleDeclarationFile("candidate")} />
                      {errors.candidateFile && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4 }}>{errors.candidateFile}</div>}
                    </div>
                  </div>

                  <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", background: "#fff" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: T.brownDark, marginBottom: 8 }}>Section J: Parent/Guardian Declaration</div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>
                      I certify that my ward satisfies the eligibility conditions, all documents submitted are genuine, and I agree to abide by the EMRS admission guidelines.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#5a3e28", marginBottom: 14, cursor: "pointer" }}>
                      <input type="checkbox" checked={declarations.parentAgree} onChange={e => setDeclarations(d => ({ ...d, parentAgree: e.target.checked }))} style={{ marginTop: 2, cursor: "pointer" }} />
                      I (the parent/guardian) agree to the declaration above.
                    </label>
                    {errors.parentAgree && <div style={{ color: "#c0392b", fontSize: 11, marginBottom: 10 }}>{errors.parentAgree}</div>}

                    <FieldLabel required>Parent/Guardian Signature</FieldLabel>
                    <SignaturePad value={declarations.parentSignature} onChange={sig => setDeclarations(d => ({ ...d, parentSignature: sig }))} />
                    {errors.parentSignature && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4 }}>{errors.parentSignature}</div>}

                    <div style={{ marginTop: 14 }}>
                      <FieldLabel>Upload Signed Parent/Guardian Declaration (optional, PDF/image)</FieldLabel>
                      <div onClick={() => parentFileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 12, border: `1.5px dashed ${declarations.parentFile ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: declarations.parentFile ? "#eaf6f1" : "#fdfaf3" }}>
                        <span style={{ fontSize: 20 }}>{declarations.parentFile ? "📄" : "⬆️"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: declarations.parentFile ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {declarations.parentFile ? declarations.parentFile.name : "Click to upload the signed declaration"}
                          </div>
                          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{declarations.parentFile ? `${(declarations.parentFile.size / 1024).toFixed(0)} KB — ready` : "PDF, JPG, or PNG, up to 5 MB"}</div>
                        </div>
                        {declarations.parentFile && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setDeclarations(d => ({ ...d, parentFile: null })); if (parentFileRef.current) parentFileRef.current.value = ""; }} style={{ background: "none", border: `1px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 7, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={parentFileRef} type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" style={{ display: "none" }} onChange={handleDeclarationFile("parent")} />
                      {errors.parentFile && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 4 }}>{errors.parentFile}</div>}
                    </div>
                  </div>
                </>
              )}

              {/* ── Preview step ── */}
              {step === STEP_PREVIEW && (
                <div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
                    {photoPreview && <img src={photoPreview} alt="Candidate" style={{ width: 56, height: 70, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(139,69,19,0.25)", flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.brownDark }}>{formData.candidateName || "—"}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Class Applied: {formData.classApplied || "—"} · Session: {formData.academicSession || "—"}</div>
                      <div style={{ fontSize: 11.5, color: T.brown, fontWeight: 700, marginTop: 2 }}>App. No: {appNo}</div>
                    </div>
                  </div>

                  {verificationSummary.mismatched > 0 && (
                    <div style={{ background: "#fdecea", border: "1px solid rgba(192,57,43,0.3)", color: "#c0392b", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12.5, lineHeight: 1.6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span>⚠️</span>
                      <span>One or more uploaded documents did not match the details entered in the form. Please go back to <strong>Page 6</strong> and review the flagged documents before submitting.</span>
                    </div>
                  )}

                  {APPLICATION_STEPS.map((section, i) => (
                    <div key={section.key} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: T.brownDark }}>{section.icon} {section.title}</div>
                        <button onClick={() => jumpTo(i)} style={{ background: "none", border: "none", color: T.brown, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Edit →</button>
                      </div>
                      {section.isChecklist && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: section.fields?.length ? 12 : 0 }}>
                          {section.checklistItems.map(item => (
                            <div key={item.key} style={{ fontSize: 12, color: "#5a3e28", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: checklist[item.key] ? T.green : "#c0392b" }}>{checklist[item.key] ? "✔" : "✖"}</span>{item.label}
                              {docVerification[item.key]?.status === "mismatch" && <span style={{ color: "#c0392b", fontWeight: 700 }}>· mismatch</span>}
                              {docVerification[item.key]?.status === "match" && <span style={{ color: T.green, fontWeight: 700 }}>· verified</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {section.fields && section.fields.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                          {section.fields.map(f => (
                            <div key={f.name} style={{ fontSize: 12, color: "#5a3e28", display: "flex", gap: 6 }}>
                              <span style={{ color: T.faint, minWidth: 0 }}>{f.label}:</span>
                              <span style={{ fontWeight: 600, color: T.brownDark }}>
                                {f.type === "checkbox" ? (formData[f.name] ? "✔ Yes" : "—") : (formData[f.name] || "—")}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: T.brownDark }}>✍️ Declarations</div>
                      <button onClick={() => jumpTo(STEP_DECLARATIONS)} style={{ background: "none", border: "none", color: T.brown, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Edit →</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11.5, color: T.faint, marginBottom: 6 }}>Candidate Signature</div>
                        {declarations.candidateSignature
                          ? <img src={declarations.candidateSignature} alt="Candidate signature" style={{ height: 50, border: `1px solid ${T.border}`, borderRadius: 6, background: "#fff" }} />
                          : <div style={{ fontSize: 12, color: "#c0392b" }}>Not signed</div>}
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{declarations.candidateFile ? `📄 ${declarations.candidateFile.name}` : "No file uploaded"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11.5, color: T.faint, marginBottom: 6 }}>Parent/Guardian Signature</div>
                        {declarations.parentSignature
                          ? <img src={declarations.parentSignature} alt="Parent signature" style={{ height: 50, border: `1px solid ${T.border}`, borderRadius: 6, background: "#fff" }} />
                          : <div style={{ fontSize: 12, color: "#c0392b" }}>Not signed</div>}
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{declarations.parentFile ? `📄 ${declarations.parentFile.name}` : "No file uploaded"}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(139,69,19,0.05)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", marginTop: 14 }}>
                    <span style={{ fontSize: 14 }}>ℹ️</span>
                    <span style={{ fontSize: 11.5, color: "#5a3e28", lineHeight: 1.6 }}>Please review every section above carefully. Once submitted, changes to this application will require contacting the EMRS office.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer navigation ── */}
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderTop: `1px solid ${T.border}`, background: "#fdf3e3", flexShrink: 0 }}>
            <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" onClick={step === 0 ? onClose : goBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, color: "#5a3e28", padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {step === 0 ? "Cancel" : "← Back"}
              </button>
              <div style={{ fontSize: 11.5, color: T.faint, fontWeight: 600 }}>Step {step + 1} of {TOTAL_STEPS}</div>
              {step === STEP_PREVIEW ? (
                <button type="button" disabled={submitting} onClick={handleSubmit} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "11px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: "0 4px 16px rgba(139,69,19,0.3)" }}>
                  {submitting ? "Submitting…" : "Submit Application →"}
                </button>
              ) : (
                <button type="button" onClick={goNext} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "11px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px rgba(139,69,19,0.3)" }}>
                  {step === STEP_DECLARATIONS ? "Preview →" : "Next →"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  );
}

export default ApplyOnlineModal;
