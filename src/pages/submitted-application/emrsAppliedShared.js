export const LS_KEY = "emrs_submitted_forms";

export const readLS = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const writeLS = (forms) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(forms));
  } catch { /* ignore */ }
};

export const getFormId = (form) => {
  const raw = form?._id ?? form?.id;
  if (raw == null || raw === "") return "";
  if (typeof raw === "object" && raw.$oid) return String(raw.$oid);
  return String(raw);
};

export const removeFormFromLS = (formId, emrsCode) => {
  const code = String(emrsCode || "").trim();
  const id = String(formId || "").trim();
  const updated = readLS().filter((form) => {
    const fid = getFormId(form);
    if (id && fid === id) return false;
    if (code && String(form.EMRScode || form.schoolCode || "").trim() === code) return false;
    return true;
  });
  writeLS(updated);
  return updated;
};

export const deduplicate = (forms) => {
  const sorted = [...forms].sort(
    (a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0)
  );
  const seenIds = new Set();
  const seenCodes = new Set();

  return sorted.filter((form) => {
    const id = getFormId(form);
    const code = String(form.EMRScode || form.schoolCode || "").trim();

    if (id) {
      if (seenIds.has(id)) return false;
      seenIds.add(id);
    }
    if (code) {
      if (seenCodes.has(code)) return false;
      seenCodes.add(code);
    }
    return true;
  });
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
  if (form.classStrength?.length) {
    csv += "🎓 Enrollment Details\nAcademic Year,Class,Section,Sanctioned Capacity,Current Enrollment\n";
    form.classStrength.forEach((c) => {
      csv += `"${c.academicYear}","${c.class}","${c.section}","${c.sanctionedCapacity}","${c.currentEnrollment}"\n`;
    });
    csv += "\n";
  }
  if (form.teachingStaff?.length) {
    csv += "👨‍🏫 Teaching Staff\nPost,Name,DOB,DOJ,Email,Contact,Total,Filled,Vacant\n";
    form.teachingStaff.forEach((s) => {
      csv += `"${s.post}","${s.name}","${s.dob}","${s.doj}","${s.email}","${s.contact}","${s.total}","${s.filled}","${s.vacant}"\n`;
    });
    csv += "\n";
  }
  if (form.nonTeachingStaff?.length) {
    csv += "👷 Non-Teaching Staff\nPost,Name,DOB,DOJ,Email,Contact,Total,Filled,Vacant\n";
    form.nonTeachingStaff.forEach((s) => {
      csv += `"${s.post}","${s.name}","${s.dob}","${s.doj}","${s.email}","${s.contact}","${s.total}","${s.filled}","${s.vacant}"\n`;
    });
    csv += "\n";
  }
  if (form.operationalCost?.length) {
    csv += "💰 Operational Cost\nYear,Month,Cost Type,Amount\n";
    form.operationalCost.forEach((o) => {
      csv += `"${o.year}","${o.month}","${o.costType}","${o.amount}"\n`;
    });
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
    td{padding:5px 10px;border:1px solid #e2e8f0;font-size:11px}
    tr:nth-child(even){background:#f8fafc}
    .hdr{background:linear-gradient(to right,#1976d2,#42a5f5);color:white;padding:16px;border-radius:8px;margin-bottom:20px}
    .hdr p{margin:4px 0;font-size:12px}
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
  if (form.classStrength?.length) {
    html += `<h2>🎓 Enrollment</h2><table><thead><tr><th>Year</th><th>Class</th><th>Section</th><th>Capacity</th><th>Enrollment</th></tr></thead><tbody>`;
    form.classStrength.forEach((c) => { html += `<tr><td>${c.academicYear}</td><td>${c.class}</td><td>${c.section}</td><td>${c.sanctionedCapacity}</td><td>${c.currentEnrollment}</td></tr>`; });
    html += `</tbody></table>`;
  }
  html += `</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

export const EMRS_API_BASE = "http://localhost:5000/api/emrs";

export const fetchEmrsFromBackend = async () => {
  const res = await fetch(EMRS_API_BASE);
  if (!res.ok) throw new Error("Failed to fetch EMRS submissions");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch EMRS submissions");
  return Array.isArray(json.data) ? json.data : [];
};
