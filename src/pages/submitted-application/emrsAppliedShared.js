export const getFormId = (form) => {
  const raw = form?._id ?? form?.id;
  if (raw == null || raw === "") return "";
  if (typeof raw === "object" && raw.$oid) return String(raw.$oid);
  return String(raw);
};

/* ─────────────────────────────────────────────────────────────────────────
   getUniqueKey — the ONE identifier that is guaranteed unique PER
   SUBMISSION (never shared across a school's multiple forms).
   clientSubmissionId is generated fresh on every submit in EMRSForm.jsx,
   so it's always safe. getFormId() (the backend _id) is the fallback for
   legacy records that predate clientSubmissionId.

   Never use EMRScode / schoolCode as a uniqueness key — many submissions
   legitimately share that field, and treating it as unique is exactly
   what caused "delete one form → all forms from that school vanish".
───────────────────────────────────────────────────────────────────────── */
export const getUniqueKey = (form) => {
  if (form?.clientSubmissionId) return String(form.clientSubmissionId);
  const fid = getFormId(form);
  return fid || "";
};

export const cell = (label, value) => ({ label, value: value ?? "—" });

export const buildSections = (form) => [
  {
    title: "🏫 School Details",
    rows: [
      cell("School Name", form.schoolname),
      cell("EMRS Code", form.EMRScode),
      cell("UDISE Code", form.udaisecode),
      cell("School Type", form.schooltype),
      cell("Affiliation", form.affiliation),
      cell("Principal Name", form.principalName),
      cell("Contact No", form.contactno),
      cell("Email", form.email),
    ],
  },
  {
    title: "📍 Location Details",
    rows: [
      cell("Pincode", form.pincode),
      cell("District", form.district),
      cell("Block", form.block),
      cell("Gram Panchayat", form.grampanchayat),
      cell("Village", form.village),
    ],
  },
  {
    title: "🔬 Infrastructure Details",
    rows: [
      cell("Total Classrooms", form.totalClassrooms),
      cell("Smart Class Rooms", form.classroomWithSmartClass),
      cell("Projector Rooms", form.classroomWithProjector),
      cell("Science Lab", form.scienceLab),
      cell("Biology Lab", form.biologyLab),
      cell("Chemistry Lab", form.chemistryLab),
      cell("Physics Lab", form.physicsLab),
      cell("Computer Lab", form.computerLab),
      cell("Library", form.library),
      cell("Books in Library", form.booksInLibrary),
      cell("Playground", form.playground),
      cell("Playground Area (sq ft)", form.playgroundArea),
      cell("Auditorium", form.auditorium),
      cell("Medical Room", form.medicalRoom),
    ],
  },
  {
    title: "🏠 Boys Hostel",
    rows: [
      cell("Capacity", form.boysHostel?.capacity),
      cell("Beds Available", form.boysHostel?.bedsAvailable),
      cell("Current Occupancy", form.boysHostel?.currentOccupancy),
      cell("CCTV Installed", form.boysHostel?.cctvInstalled),
      cell("No of CCTV", form.boysHostel?.noOfCCTV),
      cell("Security Agency", form.boysHostel?.securityAgencyName),
      cell("Warden Name", form.boysHostel?.warden?.name),
      cell("Warden Email", form.boysHostel?.warden?.email),
      cell("Warden Contact", form.boysHostel?.warden?.contact),
    ],
  },
  {
    title: "🏠 Girls Hostel",
    rows: [
      cell("Capacity", form.girlsHostel?.capacity),
      cell("Beds Available", form.girlsHostel?.bedsAvailable),
      cell("Current Occupancy", form.girlsHostel?.currentOccupancy),
      cell("CCTV Installed", form.girlsHostel?.cctvInstalled),
      cell("No of CCTV", form.girlsHostel?.noOfCCTV),
      cell("Security Agency", form.girlsHostel?.securityAgencyName),
      cell("Warden Name", form.girlsHostel?.warden?.name),
      cell("Warden Email", form.girlsHostel?.warden?.email),
      cell("Warden Contact", form.girlsHostel?.warden?.contact),
    ],
  },
  {
    title: "🍽️ Mess Compliance",
    rows: [
      cell("Weekly Menu Displayed", form.messCompliance?.weeklyMenuDisplayed),
      cell("Mess Inspection Register", form.messCompliance?.messInspectionRegister),
      cell("Food Stock Register", form.messCompliance?.foodStockRegister),
      cell("Food Complaint Register", form.messCompliance?.foodComplaintRegister),
      cell("Mess Cleanliness Daily", form.messCompliance?.messCleanlinessDaily),
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Generic helpers so export can walk through ANY array-of-objects or
   single-object section (staff, attendance, financial, procurement, etc.)
   without hand-listing every possible field name.
───────────────────────────────────────────────────────────────────────── */
const labelize = (key) =>
  String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

// A value counts as "blank" for display purposes if it's null/undefined,
// an empty string, or a string that's only whitespace (e.g. the " "
// placeholder EMRSForm.jsx seeds staffname with on blank qualification rows).
const isBlank = (v) => {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  return false;
};

/* ─────────────────────────────────────────────────────────────────────────
   toText / formatObjectEntry — replaces the old JSON.stringify(value)
   fallback. That fallback is what dumped raw JSON blobs into the
   Teaching/Non-Teaching Staff qualification columns and turned empty
   arrays (monthlyAttendance: [], areasOfDevelopment: [""]) into garbled
   boxes in the exported PDF/CSV.

   - Empty/blank arrays or objects → "—"
   - Arrays of primitives → comma-separated list
   - Arrays of objects (qualifications, dropouts, migrations, achievements,
     procurements, etc.) → each non-blank object rendered as
     "Key: Value, Key2: Value2", entries joined with " | "; entirely blank
     objects (e.g. an untouched qualification row) are dropped rather than
     printed as empty JSON
   - Plain objects → same "Key: Value" formatting, recursively
───────────────────────────────────────────────────────────────────────── */
const formatObjectEntry = (obj) => {
  const parts = Object.entries(obj)
    .filter(([, v]) => !isBlank(v))
    .map(([k, v]) => `${labelize(k)}: ${toText(v)}`);
  return parts.join(", ");
};

export const toText = (value) => {
  if (isBlank(value)) return "—";

  if (Array.isArray(value)) {
    const entries = value
      .map((item) => {
        if (item && typeof item === "object") return formatObjectEntry(item);
        return isBlank(item) ? "" : String(item);
      })
      .filter((s) => s !== "");
    return entries.length ? entries.join(" | ") : "—";
  }

  if (typeof value === "object") {
    const formatted = formatObjectEntry(value);
    return formatted || "—";
  }

  return String(value);
};

const firstDefined = (...values) => values.find((v) => v !== undefined && v !== null);

const firstSubmittedValue = (form, ...keys) =>
  firstDefined(...keys.map((key) => form?.[key]));

const asRows = (data) => {
  if (Array.isArray(data)) return data.filter((r) => r && typeof r === "object");
  if (data && typeof data === "object") return [data];
  return [];
};

const collectImageEntries = (images) => {
  if (!images || typeof images !== "object") return [];
  return Object.entries(images).flatMap(([key, val]) => {
    const values = Array.isArray(val) ? val : [val];
    return values
      .map((value) => (typeof value === "string" ? value : value?.dataUrl))
      .filter((src) => typeof src === "string" && (src.startsWith("data:") || src.startsWith("http")))
      .map((src, i) => ({ key, src, id: `${key}-${i}` }));
  });
};

/* ─────────────────────────────────────────────────────────────────────────
   buildExtraSections — everything shown in the on-screen tabs (EMRSApplied
   → AppliedFormTabs) AFTER the core buildSections() blocks: enrollment,
   staff, attendance, operational cost, financial/procurement, images.
   Both exportCSV and exportPDF walk this same list so the two exports and
   the on-screen view never drift apart again.
───────────────────────────────────────────────────────────────────────── */
const buildExtraSections = (form) => {
  const sections = [];

  if (form.classStrength?.length) {
    sections.push({
      title: "🎓 Enrollment",
      headers: ["Academic Year", "Class", "Section", "Sanctioned Capacity", "Current Enrollment"],
      keys: ["academicYear", "class", "section", "sanctionedCapacity", "currentEnrollment"],
      rows: form.classStrength,
    });
  }

  if (form.teachingStaff?.length) {
    sections.push({ title: "👨‍🏫 Teaching Staff", rows: form.teachingStaff });
  }

  if (form.nonTeachingStaff?.length) {
    sections.push({ title: "👷 Non-Teaching Staff", rows: form.nonTeachingStaff });
  }

  const extraCurricular = firstSubmittedValue(form, "extraCurricular", "extraCurricularRows");
  if (asRows(extraCurricular).length) {
    sections.push({ title: "🎭 Extra Curricular", rows: asRows(extraCurricular) });
  }

  const hospitalization = firstSubmittedValue(form, "hospitalization", "hospitalizationRows");
  if (asRows(hospitalization).length) {
    sections.push({ title: "🏥 Hospitalization", rows: asRows(hospitalization) });
  }

  if (form.teachingStaffAttendance?.length || asRows(form.teachingStaffAttendance).length) {
    sections.push({ title: "📋 Teaching Staff Attendance", rows: asRows(form.teachingStaffAttendance) });
  }

  if (asRows(form.nonTeachingStaffAttendance).length) {
    sections.push({ title: "📋 Non-Teaching Staff Attendance", rows: asRows(form.nonTeachingStaffAttendance) });
  }

  if (asRows(form.studentAttendance).length) {
    sections.push({ title: "🎓 Student Attendance", rows: asRows(form.studentAttendance) });
  }

  if (asRows(form.operationalCost).length) {
    sections.push({
      title: "💰 Operational Cost",
      headers: ["Year", "Month", "Cost Type", "Amount"],
      keys: ["year", "month", "costType", "amount"],
      rows: form.operationalCost,
    });
  }

  const financialData = firstSubmittedValue(form, "financialData", "financial");
  if (asRows(financialData).length) {
    sections.push({ title: "📊 Financial Summary", rows: asRows(financialData) });
  }

  const recurringBreakup =
    firstSubmittedValue(form, "recurringBreakup") ||
    form.financialData?.recurringBreakup ||
    form.financial?.recurringBreakup;
  if (asRows(recurringBreakup).length) {
    sections.push({ title: "📊 Recurring Breakup", rows: asRows(recurringBreakup) });
  }

  const procurements =
    firstSubmittedValue(form, "procurements") ||
    form.financialData?.procurements ||
    form.financial?.procurements;
  if (asRows(procurements).length) {
    sections.push({ title: "📦 Procurement Record", rows: asRows(procurements) });
  }

  return sections;
};

const sectionRowsAsTableRows = (section) => {
  const { headers, keys, rows } = section;
  if (headers && keys) {
    return { headers, rows: rows.map((r) => keys.map((k) => toText(r[k]))) };
  }
  // Generic: derive headers from the union of keys across all rows.
  const keySet = new Set();
  rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
  const genericKeys = Array.from(keySet);
  return {
    headers: genericKeys.map(labelize),
    rows: rows.map((r) => genericKeys.map((k) => toText(r[k]))),
  };
};

export const exportCSV = (form) => {
  const sections = buildSections(form);
  let csv = `EMRS Form Export - ${form.schoolname || "School"}\n\n`;
  sections.forEach((sec) => {
    csv += `${sec.title}\nField,Value\n`;
    sec.rows.forEach((r) => {
      csv += `"${r.label}","${String(r.value).replace(/"/g, '""')}"\n`;
    });
    csv += "\n";
  });

  buildExtraSections(form).forEach((section) => {
    const { headers, rows } = sectionRowsAsTableRows(section);
    csv += `${section.title}\n${headers.map((h) => `"${h}"`).join(",")}\n`;
    rows.forEach((row) => {
      csv += `${row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")}\n`;
    });
    csv += "\n";
  });

  const imageEntries = collectImageEntries(firstSubmittedValue(form, "emrsImages", "uploadedImages"));
  if (imageEntries.length) {
    csv += "📸 Images\nField,Image Reference\n";
    imageEntries.forEach((img) => {
      csv += `"${labelize(img.key)}","${img.src.startsWith("data:") ? "(embedded image, see PDF export)" : img.src}"\n`;
    });
    csv += "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EMRS_${form.schoolname || "form"}_${form.EMRScode || ""}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportPDF = (form) => {
  const sections = buildSections(form);
  let html = `<html><head><style>
    body{font-family:Arial,sans-serif;font-size:12px;margin:20px}
    h2{color:#1976d2;font-size:14px;margin-top:20px;border-bottom:2px solid #1976d2;padding-bottom:4px}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#1976d2;color:white;padding:6px 10px;text-align:left;font-size:11px}
    td{padding:5px 10px;border:1px solid #e2e8f0;font-size:11px;word-break:break-word}
    tr:nth-child(even){background:#f8fafc}
    .hdr{background:linear-gradient(to right,#1976d2,#42a5f5);color:white;padding:16px;border-radius:8px;margin-bottom:20px}
    .hdr p{margin:4px 0;font-size:12px}
    .img-grid{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}
    .img-item{width:160px;text-align:center;font-size:10px;color:#475569}
    .img-item img{width:160px;height:120px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;display:block;margin-bottom:4px}
    @media print{.img-grid{page-break-inside:avoid}}
  </style></head><body>
  <div class="hdr">
    <h1 style="margin:0;color:white">EMRS Form — ${form.schoolname || "—"}</h1>
    <p>EMRS Code: ${form.EMRScode || "—"} | District: ${form.district || "—"}</p>
    <p>Submitted: ${form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}</p>
  </div>`;

  sections.forEach((sec) => {
    html += `<h2>${sec.title}</h2><table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>`;
    sec.rows.forEach((r) => { html += `<tr><td><b>${r.label}</b></td><td>${r.value}</td></tr>`; });
    html += `</tbody></table>`;
  });

  buildExtraSections(form).forEach((section) => {
    const { headers, rows } = sectionRowsAsTableRows(section);
    html += `<h2>${section.title}</h2><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
    rows.forEach((row) => {
      html += `<tr>${row.map((v) => `<td>${v}</td>`).join("")}</tr>`;
    });
    html += `</tbody></table>`;
  });

  const imageEntries = collectImageEntries(firstSubmittedValue(form, "emrsImages", "uploadedImages"));
  if (imageEntries.length) {
    html += `<h2>📸 Images (${imageEntries.length})</h2><div class="img-grid">`;
    imageEntries.forEach((img) => {
      html += `<div class="img-item"><img src="${img.src}" alt="${labelize(img.key)}" /><div>${labelize(img.key)}</div></div>`;
    });
    html += `</div>`;
  }

  html += `</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

export const EMRS_API_BASE = "http://192.168.20.193:5000/api/emrs";

export const fetchEmrsFromBackend = async () => {
  const res = await fetch(EMRS_API_BASE);
  if (!res.ok) throw new Error("Failed to fetch EMRS submissions");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch EMRS submissions");
  return Array.isArray(json.data) ? json.data : [];
};