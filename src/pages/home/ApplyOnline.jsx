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

// Computes the candidate's age "as on 31 March" of the relevant academic
// year — the standard cutoff date used on EMRS/school admission forms —
// from the Date of Birth entered on Page 1. If the Academic Session field
// (e.g. "2026–27") contains a 4-digit year, that year's 31 March is used as
// the cutoff; otherwise it falls back to the current calendar year.
// Returns "" if dob is missing/unparseable.
function calculateAgeAsOnMarch31(dobStr, academicSession) {
  if (!dobStr) return "";
  const parts = dobStr.split("-");
  if (parts.length !== 3) return "";
  const [byStr, bmStr, bdStr] = parts;
  const by = parseInt(byStr, 10);
  const bm = parseInt(bmStr, 10);
  const bd = parseInt(bdStr, 10);
  if (!by || !bm || !bd) return "";

  let marchYear = new Date().getFullYear();
  if (academicSession) {
    const match = academicSession.match(/\d{4}/);
    if (match) marchYear = parseInt(match[0], 10);
  }

  let age = marchYear - by;
  const birthMonthDay = bm * 100 + bd;
  if (birthMonthDay > 331) age -= 1; // birthday falls after 31 March — not yet reached
  return age >= 0 ? String(age) : "";
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

// A short, stable "fingerprint" of the address fields that feed the GIS
// lookup. Used to detect when the candidate has actually changed their
// address (Village/Block/District/PIN) so the nearest-school auto-fill can
// re-run, instead of only ever firing once per visit to this app.
function buildAddressSignature(formData) {
  return [formData.village, formData.block, formData.district, formData.pinCode]
    .map(v => (v || "").trim().toLowerCase())
    .join("|");
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

// Ultimate fallback — approximate geographic centre of Assam. Used only if
// BOTH the live geocode lookup AND the district-centroid fallback come up
// empty (e.g. the candidate picked "Other" for District and typed a village
// Nominatim doesn't recognise, or the geocoding request couldn't reach the
// network at all e.g. blocked by a corporate/browser firewall). This keeps
// the "nearest school" ranking — and therefore the auto-filled Preference
// 1–5 dropdowns — always populated with *something* useful instead of
// leaving the applicant to fill in all five manually.
const ASSAM_DEFAULT_CENTER = { lat: 26.2006, lon: 92.9376 };

// Turns the candidate's Page 1 address into { lat, lon }, trying several
// queries from most to least specific against OpenStreetMap's free Nominatim
// geocoder (no API key required — only the typed address text is sent,
// nothing else about the candidate). If every live lookup comes back empty
// (e.g. a small village Nominatim doesn't index, like "Silonijan"), falls
// back to the candidate's district centroid, and if even that isn't
// available, to an approximate state-wide centre — so the ranking never
// simply fails outright.
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
      // Guard the request with a short timeout — if the geocoding service
      // is slow/unreachable (e.g. blocked by a network/CSP policy) we want
      // to fall through to the next, coarser attempt quickly rather than
      // hanging and leaving the applicant staring at "Locating…" forever.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      let res;
      try {
        res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
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

  // Still nothing (e.g. district is "Other"/unset and live geocoding
  // couldn't be reached at all) — fall back to an approximate state-wide
  // centre rather than leaving the preferences unranked.
  if (village || block || district || validPin) {
    return { lat: ASSAM_DEFAULT_CENTER.lat, lon: ASSAM_DEFAULT_CENTER.lon, matchedOn: "Assam (approximate — couldn't pinpoint the exact address)", approximate: true };
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
// ★ DIGILOCKER INTEGRATION (simulated)
// Lets the applicant pull a document straight from their DigiLocker account
// instead of manually scanning/uploading it — mirroring how real Indian
// government portals let citizens "Fetch from DigiLocker" for Aadhaar,
// certificates, marksheets, etc. There's no live backend wired up in this
// demo (that would require registering with DigiLocker's Partner/eSign API
// and a server-side OAuth exchange), so this simulates the flow end-to-end
// — connect, pick the matching document, "fetch" it — and produces a
// placeholder file so the rest of the app (attach/verify/preview) behaves
// exactly as if a real document had been pulled in. In production, replace
// `simulateDigiLockerFetch` with a real DigiLocker "Pull Document" API call.
// ─────────────────────────────────────────────────────────────────────────────

// Which DigiLocker-issued document(s) can be pulled in for each checklist
// item, shown as the picker list once "connected".
const DIGILOCKER_DOC_OPTIONS = {
  passportPhoto: [{ id: "photo", label: "Passport-size Photograph" }],
  candidateSignature: [{ id: "sig", label: "Specimen Signature" }],
  birthCertificate: [{ id: "birth", label: "Birth Certificate — Registrar of Births & Deaths" }],
  aadhaarDoc: [{ id: "aadhaar", label: "Aadhaar Card — UIDAI" }],
  stCertificate: [{ id: "st", label: "Scheduled Tribe Certificate — Govt. of Assam" }],
  residenceCertificate: [{ id: "residence", label: "Residence / Domicile Certificate — Govt. of Assam" }],
  incomeCertificate: [{ id: "income", label: "Income Certificate — Govt. of Assam" }],
  bonafideCertificate: [{ id: "bonafide", label: "Bonafide Certificate — School" }],
  disabilityCertificate: [{ id: "udid", label: "Unique Disability ID (UDID) Certificate" }],
  sportsCertificate: [{ id: "sports", label: "Sports Certificate — SAI / State Sports Council" }],
};

// Builds a small placeholder image (as a real File object) standing in for
// the document DigiLocker would have returned, so the rest of the app can
// treat it exactly like a manually uploaded scan.
function createMockDigiLockerFile(label) {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0b3d66";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = "#0b3d66";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("DigiLocker — Verified Document", 30, 50);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#333333";
    ctx.fillText(label, 30, 90);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#777777";
    ctx.fillText("Issued document fetched via DigiLocker (simulated)", 30, 340);
    canvas.toBlob(blob => {
      const safeName = label.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
      resolve(new File([blob], `${safeName}_digilocker.png`, { type: "image/png" }));
    }, "image/png");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ OFFICIAL / GOVERNMENT-STYLE ACCENTS
// A small, restrained navy accent used only for the "official portal" chrome
// (masthead strip, form-reference chip, mandatory-field legend, footer
// disclaimer) — layered on top of the existing EMRS brown/terracotta theme
// rather than replacing it, so the overall look stays the same.
// ─────────────────────────────────────────────────────────────────────────────
const GOVT = {
  navy: "#0b3d66",
  navyDark: "#082c4a",
  navySoft: "rgba(11,61,102,0.07)",
  navyBorder: "rgba(11,61,102,0.25)",
  saffron: "#ff9933",
};

// ─────────────────────────────────────────────────────────────────────────────
// ★ CANDIDATE ACCOUNTS + RESUMABLE APPLICATION PROGRESS (client-side demo)
// Registration/login and "resume where I left off" are implemented entirely
// in the browser via localStorage — there's no backend wired up in this demo
// (see the note above `handleSubmit` for what a real submit call would look
// like). Two things are persisted, keyed by the candidate's mobile number:
//   1. `emrs_accounts_v1`      — { [mobile]: { password, createdAt } }
//   2. `emrs_app_state_v1_<mobile>` — the full in-progress application
//      (every field, the current step/page, document checklist state, and
//      the uploaded photo/documents/signatures themselves as base64 data
//      URLs so a re-upload isn't needed after logging back in).
// IMPORTANT (production note): storing a plaintext password in localStorage
// is only acceptable for this offline demo. A real deployment must never
// store or compare passwords in the browser — authenticate against a proper
// backend (hashed + salted passwords, HTTPS, sessions/JWT) instead.
// ─────────────────────────────────────────────────────────────────────────────
const ACCOUNTS_STORAGE_KEY = "emrs_accounts_v1";
const APP_STATE_STORAGE_PREFIX = "emrs_app_state_v1_";

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

function appStateStorageKey(mobile) {
  return APP_STATE_STORAGE_PREFIX + mobile;
}

function loadAppState(mobile) {
  try {
    const raw = localStorage.getItem(appStateStorageKey(mobile));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAppState(mobile, state) {
  try {
    localStorage.setItem(appStateStorageKey(mobile), JSON.stringify(state));
    return true;
  } catch (err) {
    // Most likely the browser's per-origin storage quota was exceeded by
    // the base64 document images — the in-memory state for this session is
    // unaffected, but progress made after this point may not survive a
    // logout until something is removed. Fail silently rather than
    // interrupting the applicant's typing with an error.
    console.warn("Could not save application progress to this device (storage limit reached).", err);
    return false;
  }
}

function clearAppState(mobile) {
  try {
    localStorage.removeItem(appStateStorageKey(mobile));
  } catch {
    // ignore
  }
}

// Converts an uploaded File into a base64 data URL so it can be saved to
// localStorage and survive a logout/login cycle.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

// Reconstructs a real File object from a previously-saved base64 data URL,
// so a resumed document/photo/signature behaves exactly like one that was
// just uploaded (correct name, correct MIME type, works with OCR, etc).
function dataUrlToFile(dataUrl, filename, mimeType) {
  if (!dataUrl) return null;
  const commaIdx = dataUrl.indexOf(",");
  const header = dataUrl.slice(0, commaIdx);
  const base64 = dataUrl.slice(commaIdx + 1);
  const mime = mimeType || (header.match(/data:(.*);base64/) || [])[1] || "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename || "document", { type: mime });
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ SIGNATURE UPLOAD (shared by declaration steps)
// Applicants upload a photo/scan of their actual signature instead of
// drawing one with a mouse or finger — closer to how the physical form's
// wet-ink signature is normally captured, and avoids a shaky trackpad
// "signature" being treated as the legal one.
// ─────────────────────────────────────────────────────────────────────────────
function SignatureUpload({ value, fileName, error: externalError, onChange }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const processFile = (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setLocalError("Please upload a JPG or PNG image of your signature.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLocalError("Image is too large — please keep it under 2 MB.");
      return;
    }
    setLocalError("");
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setLocalError("");
    onChange(null, null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const shownError = localError || externalError;

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: 12,
          border: `2px dashed ${value ? "rgba(45,106,79,0.5)" : dragOver ? "rgba(200,120,30,0.5)" : "rgba(139,69,19,0.3)"}`,
          borderRadius: 12, background: value ? "#eaf6f1" : dragOver ? "#fff6e8" : "#fdfaf3",
          padding: "14px 18px", cursor: "pointer", minHeight: 64, boxSizing: "border-box",
        }}
      >
        {value ? (
          <img src={value} alt="Uploaded signature" style={{ height: 48, maxWidth: 170, objectFit: "contain", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 6, padding: 4, flexShrink: 0 }} />
        ) : (
          <span style={{ fontSize: 22, flexShrink: 0 }}>✍️</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: value ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value ? (fileName || "Signature uploaded") : "Click or drag & drop to upload your signature"}
          </div>
          <div style={{ fontSize: 12.5, color: T.faint, marginTop: 2 }}>JPG or PNG, up to 2 MB — a photo of your signature on plain paper works fine</div>
        </div>
        {value && (
          <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }} style={{ background: "none", border: `1px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 7, cursor: "pointer", flexShrink: 0 }}>Remove</button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png" style={{ display: "none" }} onChange={e => processFile(e.target.files?.[0])} />
      {shownError && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{shownError}</div>}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "#5a3e28", marginBottom: 8, letterSpacing: 0.2 }}>
      {children}{required && <span style={{ color: "#c0392b" }}> *</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 15px", borderRadius: 10, border: `2px solid rgba(139,69,19,0.22)`,
  fontSize: 15.5, color: T.brownDark, background: "#fffdf9", boxSizing: "border-box", fontFamily: "inherit",
  boxShadow: "0 1px 3px rgba(139,69,19,0.06), inset 0 1px 2px rgba(139,69,19,0.03)",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };
const textAreaStyle = { ...inputStyle, minHeight: 86, resize: "vertical" };

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
      { name: "age", label: "Age (as on 31 March)", type: "text", placeholder: "Auto-calculated from Date of Birth", readOnly: true },
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
    key: "2",
    title: "Page 2: Educational Details",
    icon: "🏫",
    intro: "Details of the school the candidate currently attends.",
    fields: [
      { name: "presentSchool", label: "Present School", type: "text" },
      { name: "schoolType", label: "School Type", type: "select", options: ["Government","Government-aided","Private","EMRS","Other"] },
      { name: "currentClass", label: "Current Class", type: "text", placeholder: "e.g. V or VII" },
      { name: "classPassed", label: "Class Passed", type: "text" },
      { name: "yearOfPassing", label: "Year of Passing", type: "text", placeholder: "e.g. 2025", pattern: /^(19|20)\d{2}$/, patternMsg: "Enter a valid 4-digit year" },
      { name: "rollNumber", label: "Roll Number", type: "text" },
      { name: "mediumOfInstruction", label: "Medium of Instruction", type: "select", options: ["Assamese","English","Bodo","Hindi","Bengali","Other"] },
    ],
  },
  {
    key: "3",
    title: "Page 3: Reservation / Special Category",
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
    key: "4",
    title: "Page 4: EMRS Preference",
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
    key: "5",
    title: "Page 5: Document Checklist & Medical Information",
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
      <div style={{ height: 7, background: "rgba(139,69,19,0.1)", borderRadius: 20, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#8b4513,#c8781e)", borderRadius: 20, transition: "width 0.35s ease" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", padding: "2px 2px 10px" }}>
        {allLabels.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12.5, fontWeight: 800, flexShrink: 0,
                background: active ? "linear-gradient(135deg,#8b4513,#c8781e)" : done ? "rgba(45,106,79,0.15)" : "rgba(139,69,19,0.08)",
                color: active ? "#fff" : done ? T.green : T.faint,
                border: active ? "none" : `1px solid ${done ? "rgba(45,106,79,0.3)" : "rgba(139,69,19,0.15)"}`,
                boxShadow: active ? "0 3px 10px rgba(139,69,19,0.4)" : "none",
                transition: "all 0.2s",
              }}>
                {done ? "✓" : label}
              </div>
              {i < allLabels.length - 1 && (
                <div style={{ width: 16, height: 2, background: done ? "rgba(45,106,79,0.4)" : "rgba(139,69,19,0.15)", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GenericField({ field, value, error, onChange }) {
  const { name, label, type, required, options, placeholder, readOnly } = field;
  const [focused, setFocused] = useState(false);
  const focusStyle = focused ? { borderColor: "#c8781e", background: "#fff", boxShadow: "0 0 0 4px rgba(200,120,30,0.16), 0 1px 3px rgba(139,69,19,0.06)" } : {};

  // Tick-only fields (e.g. reservation/special-category quotas): a single
  // checkbox that stores a boolean, instead of a Yes/No dropdown.
  if (type === "checkbox") {
    return (
      <div>
        <label style={{
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          padding: "13px 15px", borderRadius: 10,
          border: `2px solid ${value ? "rgba(45,106,79,0.45)" : "rgba(139,69,19,0.22)"}`,
          background: value ? "#eaf6f1" : "#fffdf9",
          boxShadow: value ? "0 1px 4px rgba(45,106,79,0.1)" : "0 1px 3px rgba(139,69,19,0.06)",
          transition: "all 0.15s",
        }}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(name, e.target.checked)}
            style={{ width: 20, height: 20, cursor: "pointer", flexShrink: 0, accentColor: "#8b4513" }}
          />
          <span style={{ fontSize: 15.5, fontWeight: 600, color: T.brownDark }}>
            {label}{required && <span style={{ color: "#c0392b" }}> *</span>}
          </span>
        </label>
        {error && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{error}</div>}
      </div>
    );
  }

  // Read-only computed fields (currently just Age, derived from Date of
  // Birth) — shown as a greyed-out, non-editable value with a small note
  // instead of a normal input, so it's clear the number isn't hand-typed.
  if (readOnly) {
    return (
      <div>
        <FieldLabel required={required}>{label}</FieldLabel>
        <input
          type="text"
          readOnly
          disabled
          value={value || ""}
          placeholder={placeholder}
          style={{ ...inputStyle, background: "rgba(139,69,19,0.06)", color: value ? T.brownDark : T.faint, cursor: "not-allowed" }}
        />
        <div style={{ fontSize: 12, color: T.faint, marginTop: 5 }}>
          {value ? "Auto-calculated from Date of Birth" : "Fill in Date of Birth to auto-calculate"}
        </div>
        {error && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{error}</div>}
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
      {error && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><span>⚠️</span>{error}</div>}
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

// Reusable "Fetch from DigiLocker" control: click → simulated connect →
// pick the matching issued document → simulated fetch → calls
// onFetched(file) with a placeholder File standing in for the real one.
function DigiLockerButton({ options, onFetched }) {
  const [phase, setPhase] = useState("idle"); // idle | connecting | picking | fetching
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const start = (e) => {
    e.stopPropagation();
    setPhase("connecting");
    timerRef.current = setTimeout(() => setPhase("picking"), 700);
  };

  const cancel = (e) => {
    e?.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  const pick = async (option, e) => {
    e.stopPropagation();
    setPhase("fetching");
    const file = await createMockDigiLockerFile(option.label);
    timerRef.current = setTimeout(() => {
      setPhase("idle");
      onFetched(file, option.label);
    }, 500);
  };

  return (
    <div style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={phase === "idle" ? start : undefined}
        style={{
          background: "#fff", color: GOVT.navy, border: `1.5px solid ${GOVT.navyBorder}`,
          fontSize: 12.5, fontWeight: 700, padding: "7px 12px", borderRadius: 8,
          cursor: phase === "idle" ? "pointer" : "default", display: "flex", alignItems: "center", gap: 5,
        }}
      >
        🔗 {phase === "idle" ? "DigiLocker" : phase === "connecting" ? "Connecting…" : phase === "fetching" ? "Fetching…" : "DigiLocker"}
      </button>

      {(phase === "connecting" || phase === "picking" || phase === "fetching") && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20, width: 270,
          background: "#fff", border: `1.5px solid ${GOVT.navyBorder}`, borderRadius: 11,
          boxShadow: "0 10px 28px rgba(11,61,102,0.2)", padding: "14px 16px",
        }}>
          {phase === "connecting" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: GOVT.navy }}>
              <span style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${GOVT.navy}`, borderTopColor: "transparent", animation: "stCertSpin 0.8s linear infinite" }} />
              Connecting to DigiLocker…
            </div>
          )}
          {phase === "picking" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: GOVT.navy, marginBottom: 9 }}>Select a document to fetch</div>
              {options.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={(e) => pick(o, e)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", background: GOVT.navySoft,
                    border: `1.5px solid ${GOVT.navyBorder}`, borderRadius: 8, padding: "9px 11px",
                    fontSize: 13, color: "#333", cursor: "pointer", marginBottom: 7,
                  }}
                >
                  📄 {o.label}
                </button>
              ))}
              <button type="button" onClick={cancel} style={{ background: "none", border: "none", color: T.faint, fontSize: 12.5, cursor: "pointer", marginTop: 2 }}>Cancel</button>
            </div>
          )}
          {phase === "fetching" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: GOVT.navy }}>
              <span style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${GOVT.navy}`, borderTopColor: "transparent", animation: "stCertSpin 0.8s linear infinite" }} />
              Fetching document…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChecklistRow({ item, checked, file, source, onToggle, onFile, onDigiLockerFetch, verification }) {
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
    <div style={{ marginBottom: 12 }}>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 17px", border: `2px solid ${borderColor}`, borderRadius: 12, background: bg, boxShadow: "0 2px 6px rgba(139,69,19,0.07)", transition: "all 0.15s" }}
      >
        <input type="checkbox" checked={!!checked} onChange={e => onToggle(item.key, e.target.checked)} style={{ width: 19, height: 19, flexShrink: 0, cursor: "pointer" }} />
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(139,69,19,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
          {DOC_ICONS[item.key] || "📄"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: T.brownDark, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            {item.label}{item.required && <span style={{ color: "#c0392b" }}> *</span>}
            {isAutoChecked && (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: T.brown, background: "rgba(139,69,19,0.08)", border: "1px solid rgba(139,69,19,0.18)", borderRadius: 20, padding: "2px 8px", letterSpacing: 0.3 }}>🤖 auto-checked</span>
            )}
            {source === "digilocker" && (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: GOVT.navy, background: GOVT.navySoft, border: `1px solid ${GOVT.navyBorder}`, borderRadius: 20, padding: "2px 8px", letterSpacing: 0.3 }}>🔗 via DigiLocker</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.faint, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file ? file.name : "Drag & drop, Attach, or fetch via DigiLocker — optional"}
          </div>
        </div>
        <DigiLockerButton options={DIGILOCKER_DOC_OPTIONS[item.key] || []} onFetched={(f, label) => onDigiLockerFetch(item.key, f, label)} />
        <button type="button" onClick={() => fileRef.current?.click()} style={{ background: file ? "none" : "linear-gradient(135deg,#8b4513,#c8781e)", color: file ? T.brown : "#fff", border: file ? `1.5px solid rgba(139,69,19,0.25)` : "none", fontSize: 12.5, fontWeight: 700, padding: "7px 14px", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>{file ? "Replace" : "Attach"}</button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => onFile(item.key, e.target.files?.[0] || null)} />
      </div>
      {verification && verification.message && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 9,
          fontSize: 13, lineHeight: 1.55, marginTop: 7, padding: "9px 13px",
          borderRadius: 9, background: vStyle.bg, border: `1.5px solid ${vStyle.border}`, color: vStyle.text,
        }}>
          {vStatus === "checking" ? (
            <span style={{ flexShrink: 0, width: 13, height: 13, marginTop: 2, borderRadius: "50%", border: `2px solid ${vStyle.text}`, borderTopColor: "transparent", animation: "stCertSpin 0.8s linear infinite" }} />
          ) : (
            <span style={{ flexShrink: 0, width: 9, height: 9, marginTop: 3, borderRadius: "50%", background: vStyle.dot }} />
          )}
          <span>{verification.message}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ AUTH GATE — candidate registration + login screen shown before the
// application wizard. Uses the candidate's mobile number as their account
// identifier (this is the same field the application form itself asks
// for), plus a password. See the persistence note above ACCOUNTS_STORAGE_KEY
// for the demo-only caveats.
// ─────────────────────────────────────────────────────────────────────────────
function AuthGate({ onAuthenticated, onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(mobile)) { setError("Enter a valid 10-digit mobile number."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    const accounts = loadAccounts();
    if (accounts[mobile]) {
      setError("An account with this mobile number already exists. Please log in instead.");
      setMode("login");
      return;
    }
    accounts[mobile] = { password, createdAt: Date.now() };
    saveAccounts(accounts);
    onAuthenticated(mobile);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const accounts = loadAccounts();
    const account = accounts[mobile];
    if (!/^\d{10}$/.test(mobile) || !account || account.password !== password) {
      setError("Incorrect mobile number or password.");
      return;
    }
    onAuthenticated(mobile);
  };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "#fdf8f0", zIndex: 10050, display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <style>{`@keyframes stCertSpin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Official masthead strip — matches the wizard's chrome ── */}
      <div style={{ background: GOVT.navy, padding: "7px 40px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "rgba(255,255,255,0.92)", fontWeight: 600, letterSpacing: 0.2 }}>
            <span style={{ fontSize: 15 }}>🇮🇳</span>
            <span>Government of India · Ministry of Tribal Affairs</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Eklavya Model Residential School (EMRS), Assam</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            Form No. EMRSST-2026-27 · Official Admission Portal
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", padding: "26px 40px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <BodoWeaveBackground opacity={0.1} color="#fff" />
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 9 }}>
              🖊️ EMRS Entrance Test — Online Application
            </div>
            <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
              {mode === "login" ? "Candidate Login" : "Candidate Registration"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 38, height: 38, borderRadius: 9, cursor: "pointer", fontSize: 20, flexShrink: 0 }}>×</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 460, background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 18, padding: "32px 32px 26px", boxShadow: "0 14px 40px rgba(139,69,19,0.14)" }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 7, marginBottom: 24, background: "rgba(139,69,19,0.06)", borderRadius: 12, padding: 5 }}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 14.5, fontWeight: 700,
                background: mode === "login" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "transparent",
                color: mode === "login" ? "#fff" : T.brown,
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 14.5, fontWeight: 700,
                background: mode === "register" ? "linear-gradient(135deg,#8b4513,#c8781e)" : "transparent",
                color: mode === "register" ? "#fff" : T.brown,
              }}
            >
              Register
            </button>
          </div>

          <div style={{ fontSize: 17, fontWeight: 800, color: T.brownDark, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create your candidate account"}
          </div>
          <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, marginBottom: 22 }}>
            {mode === "login"
              ? "Log in with your mobile number and password to continue your application from where you left off."
              : "Register once with your mobile number and a password. You can log out any time and pick up your application exactly where you left it."}
          </p>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <FieldLabel required>Mobile Number</FieldLabel>
              <input
                type="text"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                style={inputStyle}
                maxLength={10}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: mode === "register" ? 16 : 22 }}>
              <FieldLabel required>Password</FieldLabel>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "login" ? "Your password" : "At least 4 characters"}
                style={inputStyle}
              />
            </div>
            {mode === "register" && (
              <div style={{ marginBottom: 22 }}>
                <FieldLabel required>Confirm Password</FieldLabel>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  style={inputStyle}
                />
              </div>
            )}

            {error && (
              <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 7, background: "#fdeaea", border: "1.5px solid rgba(192,57,43,0.25)", borderRadius: 9, padding: "10px 12px" }}>
                <span>⚠️</span><span>{error}</span>
              </div>
            )}
            {info && (
              <div style={{ color: T.green, fontSize: 13, marginBottom: 16, background: "#eaf6f1", border: "1.5px solid rgba(45,106,79,0.25)", borderRadius: 9, padding: "10px 12px" }}>
                {info}
              </div>
            )}

            <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "14px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(139,69,19,0.32)" }}>
              {mode === "login" ? "Log In →" : "Register & Start Application →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: T.faint }}>
            {mode === "login" ? (
              <>New candidate? <button type="button" onClick={() => switchMode("register")} style={{ background: "none", border: "none", color: T.brown, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13 }}>Register here</button></>
            ) : (
              <>Already registered? <button type="button" onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: T.brown, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13 }}>Log in here</button></>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: GOVT.navySoft, borderTop: `1px solid ${GOVT.navyBorder}`, padding: "9px 40px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 11.5, color: GOVT.navy, textAlign: "center", lineHeight: 1.5 }}>
          Your login and in-progress application are saved on this device only, so that you can resume later. Furnishing false information on the application itself is punishable under applicable law.
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ APPLICATION WIZARD — Section-by-section wizard → Declarations upload →
// Preview. Rendered only once a candidate is logged in (see AuthGate above
// and the outer ApplyOnlineModal below). `candidateKey` is the candidate's
// mobile number, used to load/save this candidate's in-progress application
// so that logging out and back in resumes exactly where they left off.
// ─────────────────────────────────────────────────────────────────────────────
function ApplicationWizard({ candidateKey, onLogout, onClose }) {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  // Auto-generated the first time this candidate starts an application;
  // restored from saved progress on every subsequent login instead of being
  // regenerated, so the application number stays stable for the candidate.
  const [appNo, setAppNo] = useState(() => "EMRS" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000));
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [checklistFiles, setChecklistFiles] = useState({});
  // Tracks how each checklist file arrived: "upload" (manually attached) or
  // "digilocker" (pulled in via the simulated DigiLocker fetch) — used to
  // show the "via DigiLocker" badge and to skip the OCR cross-check for
  // documents that came straight from the issuing government source.
  const [checklistSource, setChecklistSource] = useState({});
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
  // Remembers the address "signature" (Village/Block/District/PIN) that the
  // most recent auto-fill attempt was run against, so the lookup can safely
  // re-run whenever the candidate changes/adds their address — instead of
  // only ever firing once per visit to the app (which is what previously
  // left the Preference dropdowns empty if the address wasn't complete the
  // very first time this page was reached).
  const lastGeoSignatureRef = useRef(null);
  const [declarations, setDeclarations] = useState({
    candidateAgree: false,
    candidateSignature: null,
    candidateSignatureFileName: null,
    candidateFile: null,
    parentAgree: false,
    parentSignature: null,
    parentSignatureFileName: null,
    parentFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");
  // Brief "Saved" toast shown after each Save & Next / Save & Preview click,
  // so the applicant gets the same reassurance a real government e-portal
  // gives before moving between sections.
  const [savedNotice, setSavedNotice] = useState(false);
  const savedNoticeTimerRef = useRef(null);
  const photoInputRef = useRef(null);
  const candidateFileRef = useRef(null);
  const parentFileRef = useRef(null);
  const bodyRef = useRef(null);
  const persistingRef = useRef(false);
  const autosaveTimerRef = useRef(null);

  // ── Load this candidate's previously-saved progress, if any, the moment
  // they log in — this is what makes "fill half the form, log out, log back
  // in later" resume instead of starting over. ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = loadAppState(candidateKey);
      if (saved && !cancelled) {
        setFormData(saved.formData || {});
        setStep(typeof saved.step === "number" ? Math.min(saved.step, TOTAL_STEPS - 1) : 0);
        if (saved.appNo) setAppNo(saved.appNo);
        setChecklist(saved.checklist || {});
        setChecklistSource(saved.checklistSource || {});
        setDocVerification(saved.docVerification || {});

        if (saved.photo) {
          const f = dataUrlToFile(saved.photo.dataUrl, saved.photo.name, saved.photo.type);
          setPhoto(f);
          setPhotoPreview(saved.photo.dataUrl);
        }

        if (saved.checklistFilesData) {
          const restored = {};
          Object.keys(saved.checklistFilesData).forEach(key => {
            const d = saved.checklistFilesData[key];
            if (d) restored[key] = dataUrlToFile(d.dataUrl, d.name, d.type);
          });
          setChecklistFiles(restored);
        }

        if (saved.declarations) {
          setDeclarations(d => ({
            ...d,
            candidateAgree: !!saved.declarations.candidateAgree,
            candidateSignature: saved.declarations.candidateSignature || null,
            candidateSignatureFileName: saved.declarations.candidateSignatureFileName || null,
            candidateFile: saved.declarations.candidateFile
              ? dataUrlToFile(saved.declarations.candidateFile.dataUrl, saved.declarations.candidateFile.name, saved.declarations.candidateFile.type)
              : null,
            parentAgree: !!saved.declarations.parentAgree,
            parentSignature: saved.declarations.parentSignature || null,
            parentSignatureFileName: saved.declarations.parentSignatureFileName || null,
            parentFile: saved.declarations.parentFile
              ? dataUrlToFile(saved.declarations.parentFile.dataUrl, saved.declarations.parentFile.name, saved.declarations.parentFile.type)
              : null,
          }));
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateKey]);

  // ── Persist this candidate's current progress to localStorage. Called
  // explicitly on Save & Next / Save & Preview and on Logout, and also via
  // a short debounce whenever tracked state changes — so progress isn't
  // lost even if the candidate closes the tab without formally logging out. ──
  const persistNow = async () => {
    if (!candidateKey || persistingRef.current) return;
    persistingRef.current = true;
    try {
      const photoData = photo ? { name: photo.name, type: photo.type, dataUrl: photoPreview } : null;
      const checklistFilesData = {};
      for (const key of Object.keys(checklistFiles)) {
        const f = checklistFiles[key];
        if (f) {
          try {
            checklistFilesData[key] = { name: f.name, type: f.type, dataUrl: await fileToDataUrl(f) };
          } catch {
            // skip this one file rather than failing the whole save
          }
        }
      }

      let candidateFileData = null;
      if (declarations.candidateFile) {
        try {
          candidateFileData = { name: declarations.candidateFile.name, type: declarations.candidateFile.type, dataUrl: await fileToDataUrl(declarations.candidateFile) };
        } catch { /* ignore */ }
      }
      let parentFileData = null;
      if (declarations.parentFile) {
        try {
          parentFileData = { name: declarations.parentFile.name, type: declarations.parentFile.type, dataUrl: await fileToDataUrl(declarations.parentFile) };
        } catch { /* ignore */ }
      }
      saveAppState(candidateKey, {
        appNo,
        step,
        formData,
        checklist,
        checklistSource,
        docVerification,
        photo: photoData,
        checklistFilesData,
        declarations: {
          candidateAgree: declarations.candidateAgree,
          candidateSignature: declarations.candidateSignature,
          candidateSignatureFileName: declarations.candidateSignatureFileName,
          candidateFile: candidateFileData,
          parentAgree: declarations.parentAgree,
          parentSignature: declarations.parentSignature,
          parentSignatureFileName: declarations.parentSignatureFileName,
          parentFile: parentFileData,
        },
        savedAt: Date.now(),
      });
    } finally {
      persistingRef.current = false;
    }
  };
  useEffect(() => {
    if (!hydrated) return; // don't autosave over a load that hasn't finished yet
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => { persistNow(); }, 900);
    return () => { if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, step, formData, checklist, checklistSource, checklistFiles, declarations, photo]);
  const handleLogout = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    await persistNow();
    onLogout();
  };
  const update = (name, value) => {
    setFormData(f => {
      const next = { ...f, [name]: value };
      // Keep Age (Page 1, "as on 31 March") in sync automatically whenever
      // the Date of Birth — or the Academic Session, which determines the
      // 31 March cutoff year — changes, instead of requiring manual entry.
      if (name === "dob" || name === "academicSession") {
        next.age = calculateAgeAsOnMarch31(next.dob, next.academicSession);
      }
      return next;
    });
  };
  const scrollTop = () => { if (bodyRef.current) bodyRef.current.scrollTop = 0; };
  const flashSavedNotice = () => {
    setSavedNotice(true);
    if (savedNoticeTimerRef.current) clearTimeout(savedNoticeTimerRef.current);
    savedNoticeTimerRef.current = setTimeout(() => setSavedNotice(false), 2200);
  };

  useEffect(() => () => { if (savedNoticeTimerRef.current) clearTimeout(savedNoticeTimerRef.current); }, []);

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
    setChecklistSource(s => ({ ...s, [key]: file ? "upload" : undefined }));
    if (file) {
      setChecklist(c => ({ ...c, [key]: true }));
      runVerification(key, file);
    } else {
      setDocVerification(v => ({ ...v, [key]: undefined }));
    }
  };

  // Called when a document is pulled in via the simulated DigiLocker fetch
  // instead of a manual upload. Documents fetched this way come directly
  // from the issuing government source, so they're treated as already
  // verified — no client-side OCR cross-check is needed or run.
  const handleDigiLockerFetch = (key, file, label) => {
    setChecklistFiles(c => ({ ...c, [key]: file }));
    setChecklistSource(s => ({ ...s, [key]: "digilocker" }));
    setChecklist(c => ({ ...c, [key]: true }));
    if (AUTO_CHECKED_DOCS.includes(key)) {
      setDocVerification(v => ({
        ...v,
        [key]: { status: "match", message: `✅ Fetched directly from DigiLocker (${label}) — an issued government record, so no further check is needed.` },
      }));
    } else {
      setDocVerification(v => ({ ...v, [key]: undefined }));
    }
  };

  // ── Nearest-EMRS-school lookup (GIS auto-fill for the Preference page) ──
  // Geocodes the candidate's Page 1 address (trying village -> PIN -> block
  // -> district, then falling back to the district centroid, and finally to
  // an approximate state-wide centre if nothing else matched), ranks every
  // EMRS school by distance from it, and fills Preference 1 with the
  // nearest school, Preference 2 with the second-nearest, and so on. When
  // `overwrite` is false (the automatic run triggered when the page opens
  // or the address changes) it only fills preference slots the candidate
  // hasn't already chosen; the "Auto-fill" button always passes
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

  // Auto-run the lookup whenever the candidate reaches the EMRS Preference
  // page with an address on file that hasn't been looked up yet — either
  // because this is the first visit, or because the candidate has since
  // added/changed the Village/Block/District/PIN on Page 1 (e.g. went back
  // to fill it in after an earlier attempt came up empty, then returned).
  // Comparing against a signature (rather than only checking
  // `geoState.status === "idle"`) is what makes the auto-fill re-trigger in
  // that "filled it in afterwards" case instead of requiring a manual click
  // of "Auto-fill nearest 5" every time.
  useEffect(() => {
    if (!hydrated) return; // wait for restored progress before auto-geocoding
    if (step !== EMRS_PREFERENCE_STEP_INDEX) return;
    const hasAddress = !!(formData.district || formData.village || formData.pinCode);
    if (!hasAddress) return;
    const signature = buildAddressSignature(formData);
    if (signature === lastGeoSignatureRef.current && geoState.status !== "idle") return;
    lastGeoSignatureRef.current = signature;
    runNearestSchoolLookup(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, step, formData.village, formData.block, formData.district, formData.pinCode]);

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
    flashSavedNotice();
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
    scrollTop();
    persistNow();
  };

  const goBack = () => {
    setErrors({});
    setStep(s => Math.max(s - 1, 0));
    scrollTop();
    persistNow();
  };

  const jumpTo = (index) => { setErrors({}); setStep(index); scrollTop(); persistNow(); };

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
      // The application is complete — clear the saved in-progress draft for
      // this candidate so a future login starts a fresh application rather
      // than reopening the one that was just submitted.
      clearAppState(candidateKey);
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

  // While restored progress is loading, show a brief loading state instead
  // of flashing an empty Page 1 and then suddenly refilling it.
  if (!hydrated) {
    return createPortal(
      <div style={{ position: "fixed", inset: 0, background: "#fdf8f0", zIndex: 10050, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes stCertSpin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid ${T.brown}`, borderTopColor: "transparent", animation: "stCertSpin 0.8s linear infinite" }} />
          <div style={{ fontSize: 15, color: T.brownDark, fontWeight: 600 }}>Loading your saved application…</div>
        </div>
      </div>,
      document.body
    );
  }

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
        @keyframes emrsToastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .emrs-apply-body-anim { animation: emrsFadeIn 0.2s ease; }
        .emrs-saved-toast { animation: emrsToastIn 0.2s ease; }
      `}</style>

      {/* ── Official masthead strip — Government / Ministry identity bar ── */}
      <div style={{ background: GOVT.navy, padding: "7px 40px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "rgba(255,255,255,0.92)", fontWeight: 600, letterSpacing: 0.2 }}>
            <span style={{ fontSize: 15 }}>🇮🇳</span>
            <span>Government of India · Ministry of Tribal Affairs</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Eklavya Model Residential School (EMRS), Assam</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            <span>Form No. EMRSST-2026-27 · Official Admission Portal</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>👤 {candidateKey}</span>
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 7, cursor: "pointer" }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", padding: "24px 40px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <BodoWeaveBackground opacity={0.1} color="#fff" />
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 9 }}>
              🖊️ EMRS Entrance Test — Online Application
            </div>
            <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
              {submitted ? "Application submitted" : currentSection ? currentSection.title : step === STEP_DECLARATIONS ? "Candidate & Parent/Guardian Declarations" : "Preview & Submit"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 38, height: 38, borderRadius: 9, cursor: "pointer", fontSize: 20, flexShrink: 0 }}>×</button>
        </div>
      </div>

      {submitted ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 30px", textAlign: "center", overflowY: "auto" }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: T.brownDark, marginBottom: 10 }}>Application Submitted Successfully</div>
            <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.75, margin: "0 auto 20px" }}>
              All {TOTAL_DATA_STEPS} pages, your document checklist, passport photograph, and both signed declarations have been received. Please note your application ID for future reference and tracking.
            </p>
            <div style={{ display: "inline-block", background: "#eaf6f1", border: "1.5px solid rgba(45,106,79,0.25)", color: T.green, fontWeight: 800, fontSize: 17, padding: "12px 26px", borderRadius: 12, letterSpacing: 0.5, marginBottom: 12 }}>
              {appId}
            </div>
            <div style={{ fontSize: 12.5, color: T.faint, marginBottom: 26 }}>
              Please save/print this ID. You can track your application status on the official EMRS Assam portal using this reference number.
            </div>
            <div>
              <button onClick={onClose} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "13px 30px", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "18px 40px 0", flexShrink: 0, maxWidth: 1100, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
            <StepProgress current={step} />
            {/* Mandatory-field legend + reassurance line — common on official
                government forms, and a plain-language explanation of how
                the Save & Next flow works on this portal. */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 2, marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, color: T.faint }}>
                Fields marked <span style={{ color: "#c0392b", fontWeight: 700 }}>*</span> are mandatory.
              </div>
              <div style={{ fontSize: 12.5, color: GOVT.navy, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span>💾</span> Your details are saved on this device — log out any time and pick up where you left off
              </div>
            </div>
          </div>

          <div ref={bodyRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px 40px 32px" }}>
            <div className="emrs-apply-body-anim" style={{ maxWidth: 1000, margin: "0 auto" }} key={step}>
              {currentSection && (
                <>
                  <p style={{ fontSize: 14.5, color: T.muted, margin: "4px 0 20px", lineHeight: 1.65 }}>
                    <span style={{ marginRight: 7 }}>{currentSection.icon}</span>{currentSection.intro}
                  </p>

                  {/* Application No. + Candidate Photo — Page 1 only */}
                  {currentSection.hasAppNo && (
                    <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#fbf6ec", border: `2px solid rgba(139,69,19,0.2)`, borderRadius: 12, padding: "15px 19px", marginBottom: 18, boxShadow: "0 2px 8px rgba(139,69,19,0.07)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Application No. (Auto-generated)</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: T.brown, marginTop: 3, letterSpacing: 0.5 }}>{appNo}</div>
                      </div>
                    </div>
                  )}
                  {currentSection.hasPhotoUpload && (
                    <div style={{ marginBottom: 18 }}>
                      <FieldLabel required>Candidate Photograph (Passport-size)</FieldLabel>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, border: `2px dashed ${photo ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", background: photo ? "#eaf6f1" : "#fdfaf3" }} onClick={() => photoInputRef.current?.click()}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Passport preview" style={{ width: 62, height: 78, objectFit: "cover", borderRadius: 7, border: "1px solid rgba(139,69,19,0.25)", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 62, height: 78, borderRadius: 7, border: "1.5px dashed rgba(139,69,19,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, color: "#b89a78" }}>🧑</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: photo ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {photo ? photo.name : "Click to upload passport photograph"}
                          </div>
                          <div style={{ fontSize: 12.5, color: T.faint, marginTop: 3 }}>{photo ? `${(photo.size / 1024).toFixed(0)} KB — ready` : "JPG or PNG, up to 2 MB. Plain background recommended."}</div>
                        </div>
                        {photo && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(); }} style={{ background: "none", border: `1.5px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={photoInputRef} type="file" accept="image/jpeg,image/jpg,image/png" style={{ display: "none" }} onChange={handlePhoto} />
                      {errors.photo && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5 }}>{errors.photo}</div>}
                    </div>
                  )}

                  {/* Document checklist — Page 6 */}
                  {currentSection.isChecklist && (
                    <div style={{ marginBottom: currentSection.fields?.length ? 22 : 0 }}>
                      {/* Automation summary banner */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 11, marginBottom: 16, padding: "13px 17px",
                        borderRadius: 12, background: verificationSummary.mismatched > 0 ? "#fdf2f1" : "#fbf6ec",
                        border: `2px solid ${verificationSummary.mismatched > 0 ? "rgba(192,57,43,0.35)" : "rgba(139,69,19,0.2)"}`,
                        boxShadow: "0 2px 6px rgba(139,69,19,0.06)",
                      }}>
                        <span style={{ fontSize: 20 }}>🤖</span>
                        <div style={{ fontSize: 13.5, color: "#5a3e28", lineHeight: 1.55 }}>
                          Every document below can be attached manually or fetched directly via <strong>🔗 DigiLocker</strong>. <strong>Aadhaar</strong> uploads are automatically scanned and cross-checked against the candidate's name, date of birth, and Aadhaar number entered earlier in this form. <strong>ST Certificate</strong> uploads are checked against the candidate's name, parent's name, and reservation category. Documents fetched via DigiLocker skip this check since they come directly from the issuing government source.
                          {(verificationSummary.matched > 0 || verificationSummary.mismatched > 0) && (
                            <span style={{ display: "block", marginTop: 5, fontWeight: 700 }}>
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
                          source={checklistSource[item.key]}
                          onToggle={toggleChecklist}
                          onFile={setChecklistFile}
                          onDigiLockerFetch={handleDigiLockerFetch}
                          verification={docVerification[item.key]}
                        />
                      ))}
                      {Object.keys(errors).filter(k => currentSection.checklistItems.some(it => it.key === k)).length > 0 && (
                        <div style={{ color: "#c0392b", fontSize: 13, marginTop: 5 }}>Please confirm all required documents (marked *) before continuing.</div>
                      )}
                    </div>
                  )}

                  {/* GIS nearest-school panel — EMRS Preference page only */}
                  {currentSection.isEmrsPreference && (
                    <div style={{
                      marginBottom: 20, padding: "15px 19px", borderRadius: 12,
                      background: geoState.status === "error" ? "#fdf2f1" : "#fbf6ec",
                      border: `2px solid ${geoState.status === "error" ? "rgba(192,57,43,0.35)" : "rgba(139,69,19,0.2)"}`,
                      boxShadow: "0 2px 6px rgba(139,69,19,0.06)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#5a3e28", lineHeight: 1.55 }}>
                          <span style={{ fontSize: 18 }}>📍</span>
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
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#8b6914", background: "rgba(200,120,30,0.12)", border: "1px solid rgba(200,120,30,0.3)", borderRadius: 20, padding: "3px 9px", flexShrink: 0, whiteSpace: "nowrap" }}>approximate</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => { lastGeoSignatureRef.current = buildAddressSignature(formData); runNearestSchoolLookup(true); }}
                          disabled={geoState.status === "loading"}
                          style={{
                            background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none",
                            padding: "8px 16px", borderRadius: 9, fontWeight: 700, fontSize: 13,
                            cursor: geoState.status === "loading" ? "default" : "pointer",
                            opacity: geoState.status === "loading" ? 0.7 : 1, flexShrink: 0,
                          }}
                        >
                          {geoState.status === "loading" ? "Locating…" : "🔄 Auto-fill nearest 5"}
                        </button>
                      </div>

                      {geoState.status === "success" && geoState.results.length > 0 && (
                        <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px" }}>
                          {geoState.results.slice(0, 5).map((s, i) => (
                            <div key={s.name} style={{ fontSize: 13, color: "#5a3e28", display: "flex", gap: 7 }}>
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                  <div style={{ border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 22, background: "#fff", boxShadow: "0 2px 10px rgba(139,69,19,0.06)" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.brownDark, marginBottom: 10 }}>Section I: Candidate Declaration</div>
                    <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
                      I declare that the information furnished is true and correct and I understand that any false information may lead to cancellation of my candidature/admission.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "#5a3e28", marginBottom: 16, cursor: "pointer" }}>
                      <input type="checkbox" checked={declarations.candidateAgree} onChange={e => setDeclarations(d => ({ ...d, candidateAgree: e.target.checked }))} style={{ marginTop: 2, cursor: "pointer", width: 17, height: 17 }} />
                      I (the candidate) agree to the declaration above.
                    </label>
                    {errors.candidateAgree && <div style={{ color: "#c0392b", fontSize: 12.5, marginBottom: 11 }}>{errors.candidateAgree}</div>}

                    <FieldLabel required>Candidate Signature</FieldLabel>
                    <SignatureUpload
                      value={declarations.candidateSignature}
                      fileName={declarations.candidateSignatureFileName}
                      error={errors.candidateSignature}
                      onChange={(dataUrl, fileName) => setDeclarations(d => ({ ...d, candidateSignature: dataUrl, candidateSignatureFileName: fileName }))}
                    />

                    <div style={{ marginTop: 16 }}>
                      <FieldLabel>Upload Signed Candidate Declaration (optional, PDF/image)</FieldLabel>
                      <div onClick={() => candidateFileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 14, border: `2px dashed ${declarations.candidateFile ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", background: declarations.candidateFile ? "#eaf6f1" : "#fdfaf3" }}>
                        <span style={{ fontSize: 22 }}>{declarations.candidateFile ? "📄" : "⬆️"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: declarations.candidateFile ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {declarations.candidateFile ? declarations.candidateFile.name : "Click to upload the signed declaration"}
                          </div>
                          <div style={{ fontSize: 12.5, color: T.faint, marginTop: 3 }}>{declarations.candidateFile ? `${(declarations.candidateFile.size / 1024).toFixed(0)} KB — ready` : "PDF, JPG, or PNG, up to 5 MB"}</div>
                        </div>
                        {declarations.candidateFile && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setDeclarations(d => ({ ...d, candidateFile: null })); if (candidateFileRef.current) candidateFileRef.current.value = ""; }} style={{ background: "none", border: `1.5px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={candidateFileRef} type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" style={{ display: "none" }} onChange={handleDeclarationFile("candidate")} />
                      {errors.candidateFile && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5 }}>{errors.candidateFile}</div>}
                    </div>
                  </div>

                  <div style={{ border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", background: "#fff", boxShadow: "0 2px 10px rgba(139,69,19,0.06)" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.brownDark, marginBottom: 10 }}>Section J: Parent/Guardian Declaration</div>
                    <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
                      I certify that my ward satisfies the eligibility conditions, all documents submitted are genuine, and I agree to abide by the EMRS admission guidelines.
                    </p>
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "#5a3e28", marginBottom: 16, cursor: "pointer" }}>
                      <input type="checkbox" checked={declarations.parentAgree} onChange={e => setDeclarations(d => ({ ...d, parentAgree: e.target.checked }))} style={{ marginTop: 2, cursor: "pointer", width: 17, height: 17 }} />
                      I (the parent/guardian) agree to the declaration above.
                    </label>
                    {errors.parentAgree && <div style={{ color: "#c0392b", fontSize: 12.5, marginBottom: 11 }}>{errors.parentAgree}</div>}

                    <FieldLabel required>Parent/Guardian Signature</FieldLabel>
                    <SignatureUpload
                      value={declarations.parentSignature}
                      fileName={declarations.parentSignatureFileName}
                      error={errors.parentSignature}
                      onChange={(dataUrl, fileName) => setDeclarations(d => ({ ...d, parentSignature: dataUrl, parentSignatureFileName: fileName }))}
                    />

                    <div style={{ marginTop: 16 }}>
                      <FieldLabel>Upload Signed Parent/Guardian Declaration (optional, PDF/image)</FieldLabel>
                      <div onClick={() => parentFileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 14, border: `2px dashed ${declarations.parentFile ? "rgba(45,106,79,0.5)" : "rgba(139,69,19,0.3)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", background: declarations.parentFile ? "#eaf6f1" : "#fdfaf3" }}>
                        <span style={{ fontSize: 22 }}>{declarations.parentFile ? "📄" : "⬆️"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: declarations.parentFile ? T.green : T.brownDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {declarations.parentFile ? declarations.parentFile.name : "Click to upload the signed declaration"}
                          </div>
                          <div style={{ fontSize: 12.5, color: T.faint, marginTop: 3 }}>{declarations.parentFile ? `${(declarations.parentFile.size / 1024).toFixed(0)} KB — ready` : "PDF, JPG, or PNG, up to 5 MB"}</div>
                        </div>
                        {declarations.parentFile && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setDeclarations(d => ({ ...d, parentFile: null })); if (parentFileRef.current) parentFileRef.current.value = ""; }} style={{ background: "none", border: `1.5px solid rgba(139,69,19,0.25)`, color: T.brown, fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Remove</button>
                        )}
                      </div>
                      <input ref={parentFileRef} type="file" accept="image/jpeg,image/jpg,image/png,application/pdf" style={{ display: "none" }} onChange={handleDeclarationFile("parent")} />
                      {errors.parentFile && <div style={{ color: "#c0392b", fontSize: 12.5, marginTop: 5 }}>{errors.parentFile}</div>}
                    </div>
                  </div>
                </>
              )}

              {/* ── Preview step ── */}
              {step === STEP_PREVIEW && (
                <div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, boxShadow: "0 2px 10px rgba(139,69,19,0.06)" }}>
                    {photoPreview && <img src={photoPreview} alt="Candidate" style={{ width: 62, height: 78, objectFit: "cover", borderRadius: 7, border: "1px solid rgba(139,69,19,0.25)", flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: T.brownDark }}>{formData.candidateName || "—"}</div>
                      <div style={{ fontSize: 13.5, color: T.muted, marginTop: 3 }}>Class Applied: {formData.classApplied || "—"} · Session: {formData.academicSession || "—"}</div>
                      <div style={{ fontSize: 13, color: T.brown, fontWeight: 700, marginTop: 3 }}>App. No: {appNo}</div>
                    </div>
                  </div>

                  {verificationSummary.mismatched > 0 && (
                    <div style={{ background: "#fdecea", border: "1.5px solid rgba(192,57,43,0.3)", color: "#c0392b", borderRadius: 11, padding: "13px 18px", marginBottom: 18, fontSize: 13.5, lineHeight: 1.6, display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span>⚠️</span>
                      <span>One or more uploaded documents did not match the details entered in the form. Please go back to <strong>Page 6</strong> and review the flagged documents before submitting.</span>
                    </div>
                  )}

                  {APPLICATION_STEPS.map((section, i) => (
                    <div key={section.key} style={{ background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 14, boxShadow: "0 2px 8px rgba(139,69,19,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 800, color: T.brownDark }}>{section.icon} {section.title}</div>
                        <button onClick={() => jumpTo(i)} style={{ background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Edit →</button>
                      </div>
                      {section.isChecklist && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: section.fields?.length ? 13 : 0 }}>
                          {section.checklistItems.map(item => (
                            <div key={item.key} style={{ fontSize: 13.5, color: "#5a3e28", display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ color: checklist[item.key] ? T.green : "#c0392b" }}>{checklist[item.key] ? "✔" : "✖"}</span>{item.label}
                              {docVerification[item.key]?.status === "mismatch" && <span style={{ color: "#c0392b", fontWeight: 700 }}>· mismatch</span>}
                              {docVerification[item.key]?.status === "match" && <span style={{ color: T.green, fontWeight: 700 }}>· verified</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {section.fields && section.fields.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 18px" }}>
                          {section.fields.map(f => (
                            <div key={f.name} style={{ fontSize: 13.5, color: "#5a3e28", display: "flex", gap: 7 }}>
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

                  <div style={{ background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: T.brownDark }}>✍️ Declarations</div>
                      <button onClick={() => jumpTo(STEP_DECLARATIONS)} style={{ background: "none", border: "none", color: T.brown, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Edit →</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, color: T.faint, marginBottom: 7 }}>Candidate Signature</div>
                        {declarations.candidateSignature
                          ? <img src={declarations.candidateSignature} alt="Candidate signature" style={{ height: 54, border: `1px solid ${T.border}`, borderRadius: 7, background: "#fff" }} />
                          : <div style={{ fontSize: 13.5, color: "#c0392b" }}>Not signed</div>}
                        <div style={{ fontSize: 12.5, color: T.muted, marginTop: 5 }}>{declarations.candidateFile ? `📄 ${declarations.candidateFile.name}` : "No file uploaded"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: T.faint, marginBottom: 7 }}>Parent/Guardian Signature</div>
                        {declarations.parentSignature
                          ? <img src={declarations.parentSignature} alt="Parent signature" style={{ height: 54, border: `1px solid ${T.border}`, borderRadius: 7, background: "#fff" }} />
                          : <div style={{ fontSize: 13.5, color: "#c0392b" }}>Not signed</div>}
                        <div style={{ fontSize: 12.5, color: T.muted, marginTop: 5 }}>{declarations.parentFile ? `📄 ${declarations.parentFile.name}` : "No file uploaded"}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 11, alignItems: "flex-start", background: "rgba(139,69,19,0.05)", border: `1.5px solid ${T.border}`, borderRadius: 11, padding: "12px 16px", marginTop: 16 }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    <span style={{ fontSize: 13, color: "#5a3e28", lineHeight: 1.65 }}>Please review every section above carefully. Once submitted, changes to this application will require contacting the EMRS office.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer navigation ── */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {savedNotice && (
              <div className="emrs-saved-toast" style={{
                position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
                background: T.green, color: "#fff", fontSize: 13.5, fontWeight: 700,
                padding: "9px 20px", borderRadius: 20, boxShadow: "0 4px 14px rgba(45,106,79,0.35)",
                display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", zIndex: 2,
              }}>
                ✅ Progress saved
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderTop: `1.5px solid ${T.border}`, background: "#fdf3e3" }}>
              <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={step === 0 ? onClose : goBack} style={{ background: "transparent", border: `2px solid ${T.border}`, color: "#5a3e28", padding: "12px 24px", borderRadius: 11, fontWeight: 700, fontSize: 14.5, cursor: "pointer" }}>
                  {step === 0 ? "Cancel" : "← Back"}
                </button>
                <div style={{ fontSize: 13, color: T.faint, fontWeight: 600 }}>Step {step + 1} of {TOTAL_STEPS}</div>
                {step === STEP_PREVIEW ? (
                  <button type="button" disabled={submitting} onClick={handleSubmit} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 11, fontWeight: 700, fontSize: 14.5, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, boxShadow: "0 5px 18px rgba(139,69,19,0.32)" }}>
                    {submitting ? "Submitting…" : "Submit Application →"}
                  </button>
                ) : (
                  <button type="button" onClick={goNext} style={{ background: "linear-gradient(135deg,#8b4513,#c8781e)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 11, fontWeight: 700, fontSize: 14.5, cursor: "pointer", boxShadow: "0 5px 18px rgba(139,69,19,0.32)" }}>
                    {step === STEP_DECLARATIONS ? "💾 Save & Preview →" : "💾 Save & Next →"}
                  </button>
                )}
              </div>
            </div>
            {/* Official disclaimer strip — matches the masthead's govt-portal styling */}
            <div style={{ background: GOVT.navySoft, borderTop: `1px solid ${GOVT.navyBorder}`, padding: "9px 40px" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto", fontSize: 11.5, color: GOVT.navy, textAlign: "center", lineHeight: 1.5 }}>
                This is an official admission form of the Eklavya Model Residential School scheme, Ministry of Tribal Affairs, Government of India. Furnishing false information is punishable under applicable law.
              </div>
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ★ APPLY ONLINE — outer component. Gates access behind candidate login/
// registration (AuthGate), then hands off to the multi-page ApplicationWizard
// once a candidate is authenticated. `candidateKey` (the candidate's mobile
// number) is what ties a browser session back to a specific saved,
// in-progress application.
// ─────────────────────────────────────────────────────────────────────────────
function ApplyOnlineModal({ onClose }) {
  const [candidateKey, setCandidateKey] = useState(null);

  if (!candidateKey) {
    return <AuthGate onAuthenticated={setCandidateKey} onClose={onClose} />;
  }

  return (
    <ApplicationWizard
      candidateKey={candidateKey}
      onLogout={() => setCandidateKey(null)}
      onClose={onClose}
    />
  );
}

export default ApplyOnlineModal;