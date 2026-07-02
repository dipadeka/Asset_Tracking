import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Chip,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CLASS_OPTIONS = ["6", "7", "8"];

const TEACHING_POSTS = [
  "Principal","Vice Principal","PGT - English","PGT - Hindi","PGT - Mathematics",
  "PGT - Physics","PGT - Chemistry","PGT - Biology","PGT - History","PGT - Geography",
  "PGT - Economics","PGT - Political Science","PGT - Computer Science","TGT - English",
  "TGT - Hindi","TGT - Mathematics","TGT - Science","TGT - Social Science","TGT - Sanskrit",
  "TGT - Physical Education","PRT - Primary Teacher","Librarian","Art & Craft Teacher",
  "Music Teacher","Yoga Teacher","Counsellor","Other",
];

const NON_TEACHING_POSTS = [
  "Warden (Boys)","Warden (Girls)","Hostel Superintendent","Lab Assistant",
  "Library Assistant","Computer Lab Assistant","Office Assistant","Accountant",
  "Clerk","Peon/Attender","Security Guard","Cook","Helper","Sweeper",
  "Electrician","Plumber","Driver","Nurse","Other",
];

const ALL_TEACHING_POSTS_SET    = new Set(TEACHING_POSTS.map((p) => p.toLowerCase().trim()));
const ALL_NON_TEACHING_POSTS_SET = new Set(NON_TEACHING_POSTS.map((p) => p.toLowerCase().trim()));

const ASSAM_HOLIDAYS = [
  { date: "2024-01-26", name: "Republic Day", type: "National" },
  { date: "2024-04-14", name: "Bohag Bihu / Dr. Ambedkar Jayanti", type: "State" },
  { date: "2024-04-15", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2024-04-16", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2024-05-01", name: "May Day / Labour Day", type: "State" },
  { date: "2024-08-15", name: "Independence Day", type: "National" },
  { date: "2024-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2024-10-13", name: "Kati Bihu", type: "State" },
  { date: "2024-12-25", name: "Christmas Day", type: "National" },
  { date: "2025-01-14", name: "Magh Bihu (Bhogali Bihu)", type: "State" },
  { date: "2025-01-26", name: "Republic Day", type: "National" },
  { date: "2025-04-14", name: "Bohag Bihu / Dr. Ambedkar Jayanti", type: "State" },
  { date: "2025-04-15", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2025-04-16", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2025-05-01", name: "May Day / Labour Day", type: "State" },
  { date: "2025-08-15", name: "Independence Day", type: "National" },
  { date: "2025-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2025-12-25", name: "Christmas Day", type: "National" },
  { date: "2026-01-14", name: "Magh Bihu (Bhogali Bihu)", type: "State" },
  { date: "2026-01-26", name: "Republic Day", type: "National" },
  { date: "2026-04-14", name: "Bohag Bihu / Dr. Ambedkar Jayanti", type: "State" },
  { date: "2026-04-15", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2026-04-16", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2026-05-01", name: "May Day / Labour Day", type: "State" },
  { date: "2026-08-15", name: "Independence Day", type: "National" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2026-12-25", name: "Christmas Day", type: "National" },
];

const getHolidaysForMonth = (monthName) => {
  const monthIndex = MONTHS.indexOf(monthName);
  if (monthIndex === -1) return [];
  return ASSAM_HOLIDAYS.filter((h) => new Date(h.date).getMonth() === monthIndex);
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const computeAttendance = (row) => {
  const wd = parseFloat(row.workingDays) || 0;
  const totalLeave =
    (parseFloat(row.casualLeave)    || 0) +
    (parseFloat(row.earnedLeave)    || 0) +
    (parseFloat(row.medicalLeave)   || 0) +
    (parseFloat(row.maternityLeave) || 0) +
    (parseFloat(row.paternityLeave) || 0);
  const daysPresent = wd > 0 ? Math.max(0, wd - totalLeave) : 0;
  const daysAbsent  = wd > 0 ? Math.min(totalLeave, wd) : 0;
  const percentage  = wd > 0 ? parseFloat(((daysPresent / wd) * 100).toFixed(1)) : 0;
  return { ...row, daysPresent, daysAbsent, percentage };
};

const normaliseKeys = (obj) => {
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    out[k.toLowerCase().replace(/[\s_-]/g, "")] = v;
  });
  return out;
};

const pctColor = (pct) => {
  if (pct >= 90) return { color: "#16a34a", bg: "#dcfce7" };
  if (pct >= 75) return { color: "#0f766e", bg: "#ccfbf1" };
  if (pct >= 50) return { color: "#d97706", bg: "#fef3c7" };
  return { color: "#dc2626", bg: "#fee2e2" };
};

const detectPostType = (postStr) => {
  const p = postStr.toLowerCase().trim();
  if (ALL_TEACHING_POSTS_SET.has(p))     return "Teaching";
  if (ALL_NON_TEACHING_POSTS_SET.has(p)) return "Non-Teaching";
  return "Unknown";
};

/* ─────────────────────────────────────────────────────────────────────────────
   ASSAM HOLIDAY LIST
───────────────────────────────────────────────────────────────────────────── */
const AssamHolidayList = () => {
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterType,  setFilterType]  = useState("All");

  const filtered = ASSAM_HOLIDAYS.filter((h) => {
    const mName = MONTHS[new Date(h.date).getMonth()];
    return (filterMonth === "All" || mName === filterMonth) &&
           (filterType  === "All" || h.type === filterType);
  });

  return (
    <Box sx={{ border: "1px solid #bfdbfe", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ px: 2, py: 1.5, background: "#f0f7ff", display: "flex", gap: 2, flexWrap: "wrap", borderBottom: "1px solid #bfdbfe", alignItems: "center" }}>
        <TextField select size="small" label="Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={{ minWidth: 130 }}>
          <MenuItem value="All">All Months</MenuItem>
          {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Type" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ minWidth: 130 }}>
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="National">National</MenuItem>
          <MenuItem value="State">State (Assam)</MenuItem>
        </TextField>
        <Typography sx={{ fontSize: 12, color: "#64748b", ml: "auto" }}>
          Showing <strong>{filtered.length}</strong> of {ASSAM_HOLIDAYS.length} holidays
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto", maxHeight: 300, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              {["#", "Date", "Day", "Holiday Name", "Type"].map((h) => (
                <th key={h} style={{ background: "#e0f2fe", color: "#0c4a6e", padding: "8px 12px", textAlign: "left", fontSize: 12, fontWeight: 700, border: "1px solid #bae6fd" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((h, i) => {
              const d = new Date(h.date);
              return (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f0f9ff" : "#fff" }}>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8" }}>{i + 1}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#1e40af" }}>
                    {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 12, color: "#475569" }}>
                    {d.toLocaleDateString("en-IN", { weekday: "long" })}
                  </td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 500 }}>{h.name}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0" }}>
                    <Chip
                      label={h.type === "National" ? "🇮🇳 National" : "🏛️ State"}
                      size="small"
                      sx={{ background: h.type === "National" ? "#dbeafe" : "#dcfce7", color: h.type === "National" ? "#1d4ed8" : "#16a34a", fontWeight: 700, fontSize: 11 }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   STAFF ATTENDANCE SECTION
───────────────────────────────────────────────────────────────────────────── */
const StaffAttendanceSection = ({ staffType, rows, setRows, activeMonth, setActiveMonth }) => {
  const [excelError,   setExcelError]   = useState("");
  const [uploadWarn,   setUploadWarn]   = useState("");
  const [uploading,    setUploading]    = useState(false);
  const [showAddForm,  setShowAddForm]  = useState(false);

  const postOptions  = staffType === "Teaching" ? TEACHING_POSTS : NON_TEACHING_POSTS;
  const accent       = staffType === "Teaching" ? "#1976d2" : "#7c3aed";
  const accentLight  = staffType === "Teaching" ? "#eff6ff" : "#f5f3ff";
  const sectionLabel = staffType === "Teaching" ? "Teaching Staff" : "Non-Teaching Staff";

  const blankRow = useCallback(() => ({
    id: Date.now() + Math.random(),
    staffType, post: "", name: "", month: activeMonth,
    workingDays: "", casualLeave: "", earnedLeave: "",
    medicalLeave: "", maternityLeave: "", paternityLeave: "",
    daysPresent: 0, daysAbsent: 0, percentage: 0,
  }), [staffType, activeMonth]);

  const [newRow, setNewRow] = useState(blankRow());
  useEffect(() => { setNewRow((p) => ({ ...p, month: activeMonth })); }, [activeMonth]);

  const filteredRows = rows.filter((r) => r.staffType === staffType && r.month === activeMonth);

  const handleFieldChange = useCallback((rowId, field, value) => {
    setRows((prev) => prev.map((r) => r.id === rowId ? computeAttendance({ ...r, [field]: value }) : r));
  }, [setRows]);

  const addManualRow = () => {
    if (!newRow.name.trim()) { toast.error("Please enter staff name."); return; }
    const computed = computeAttendance({ ...newRow, staffType, month: activeMonth, id: Date.now() + Math.random() });
    setRows((prev) => [...prev, computed]);
    setNewRow({ ...blankRow(), id: Date.now() + Math.random() });
    toast.success(`✅ ${computed.name} added to ${sectionLabel}.`);
    setShowAddForm(false);
  };

  const removeRow = (rowId) => setRows((prev) => prev.filter((r) => r.id !== rowId));

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Post", "Name", "Month", "Working Days", "Casual Leave", "Earned Leave", "Medical Leave", "Maternity Leave", "Paternity Leave"],
    ]);
    postOptions.slice(0, 3).forEach((post, i) => {
      const rowVals = [post, "Staff Name", activeMonth, "26", "1", "0", "0", "0", "0"];
      rowVals.forEach((val, j) => {
        ws[XLSX.utils.encode_cell({ r: i + 1, c: j })] = { v: val, t: "s" };
      });
    });
    ws["!cols"] = [22, 24, 12, 14, 14, 14, 14, 16, 16].map((w) => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, `${staffType} Attendance`);
    XLSX.writeFile(wb, `${staffType.replace(/\s/g, "_")}_Attendance_Template.xlsx`);
    toast.success(`${sectionLabel} template downloaded!`);
  };

  const exportData = () => {
    if (!filteredRows.length) { toast.error("No data to export."); return; }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredRows.map((r) => ({
      "Post": r.post, "Name": r.name, "Month": r.month,
      "Working Days": r.workingDays, "Casual Leave": r.casualLeave,
      "Earned Leave": r.earnedLeave, "Medical Leave": r.medicalLeave,
      "Maternity Leave": r.maternityLeave, "Paternity Leave": r.paternityLeave,
      "Days Present": r.daysPresent, "Days Absent": r.daysAbsent, "Attendance %": r.percentage,
    })));
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${staffType.replace(/\s/g, "_")}_${activeMonth}_Attendance.xlsx`);
    toast.success("Exported!");
  };

  const handleExcelUpload = (file) => {
    if (!file) return;
    setExcelError(""); setUploadWarn(""); setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb  = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
        const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
        if (!raw.length) { setExcelError("File is empty."); setUploading(false); return; }

        const accepted = [];
        const rejected = [];

        raw.forEach((row) => {
          const r    = normaliseKeys(row);
          const post = String(r["post"] ?? r["designation"] ?? "").trim();
          const detectedType = detectPostType(post);

          if (detectedType === "Unknown") {
            accepted.push(buildRow(r, post, staffType, activeMonth));
          } else if (detectedType !== staffType) {
            rejected.push(post || "(blank)");
          } else {
            accepted.push(buildRow(r, post, staffType, activeMonth));
          }
        });

        if (accepted.length === 0) {
          setExcelError(
            `❌ No valid ${sectionLabel} posts found. ` +
            `All ${raw.length} row(s) had posts that belong to the other staff section. ` +
            `Please upload in the correct section.`
          );
          setUploading(false);
          return;
        }

        setRows((prev) => {
          const updated = [...prev];
          accepted.forEach((incoming) => {
            const idx = updated.findIndex(
              (x) => x.staffType === staffType &&
                     x.name.trim().toLowerCase() === incoming.name.trim().toLowerCase() &&
                     x.month === incoming.month
            );
            if (idx !== -1) updated[idx] = { ...incoming, id: updated[idx].id };
            else updated.push(incoming);
          });
          return updated;
        });

        if (rejected.length > 0) {
          setUploadWarn(
            `⚠️ ${rejected.length} row(s) were skipped because their Post belongs to the other staff section: ` +
            [...new Set(rejected)].join(", ") + ". Please upload those rows in the other section."
          );
        }

        toast.success(`✅ Imported ${accepted.length} ${sectionLabel} record(s).`);
      } catch (err) {
        setExcelError("Failed to parse file: " + err.message);
      } finally { setUploading(false); }
    };
    reader.onerror = () => { setExcelError("Could not read file."); setUploading(false); };
    reader.readAsArrayBuffer(file);
  };

  const buildRow = (r, post, type, month) => computeAttendance({
    id: Date.now() + Math.random(),
    staffType: type,
    post,
    name:           String(r["name"] ?? r["staffname"] ?? r["teachername"] ?? r["employeename"] ?? "").trim(),
    month:          String(r["month"] || month).trim(),
    workingDays:    r["workingdays"]    ?? r["totaldays"] ?? "",
    casualLeave:    r["casualleave"]    ?? r["cl"] ?? "",
    earnedLeave:    r["earnedleave"]    ?? r["el"] ?? "",
    medicalLeave:   r["medicalleave"]   ?? r["ml"] ?? "",
    maternityLeave: r["maternityleave"] ?? r["mat"] ?? "",
    paternityLeave: r["paternityleave"] ?? r["pat"] ?? "",
  });

  const totalStaff = filteredRows.length;
  const avgPct     = totalStaff > 0 ? (filteredRows.reduce((s, r) => s + r.percentage, 0) / totalStaff).toFixed(1) : null;
  const above75    = filteredRows.filter((r) => r.percentage >= 75).length;
  const below75    = filteredRows.filter((r) => r.percentage < 75 && r.percentage > 0).length;

  const leaveFields = [
    { key: "casualLeave",    label: "Casual Leave",   full: "Casual Leave" },
    { key: "earnedLeave",    label: "Earned Leave",   full: "Earned Leave" },
    { key: "medicalLeave",   label: "Medical Leave",  full: "Medical Leave" },
    { key: "maternityLeave", label: "Maternity Leave", full: "Maternity Leave" },
    { key: "paternityLeave", label: "Paternity Leave", full: "Paternity Leave" },
  ];

  const monthHolidays = getHolidaysForMonth(activeMonth);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, background: accentLight, border: `1px solid ${accent}33` }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: accent }}>
            {staffType === "Teaching" ? "👨‍🏫" : "🧹"} {sectionLabel} — valid posts only
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2, alignItems: "center" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mr: 0.5 }}>Month:</Typography>
        {MONTHS.map((m) => (
          <Chip key={m} label={m.slice(0, 3)} size="small" onClick={() => setActiveMonth(m)}
            color={activeMonth === m ? "primary" : "default"}
            variant={activeMonth === m ? "filled" : "outlined"}
            sx={{ fontWeight: activeMonth === m ? 700 : 400, cursor: "pointer", fontSize: 11 }}
          />
        ))}
      </Box>

      {monthHolidays.length > 0 && (
        <Alert severity="info" icon={false} sx={{ mb: 2, py: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}>🗓️ Holidays in {activeMonth}:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {monthHolidays.map((h, i) => (
              <Chip key={i} label={`${new Date(h.date).getDate()} – ${h.name}`} size="small"
                sx={{ fontSize: 11, background: h.type === "National" ? "#dbeafe" : "#dcfce7", color: h.type === "National" ? "#1d4ed8" : "#16a34a", fontWeight: 600 }} />
            ))}
          </Box>
        </Alert>
      )}

      {totalStaff > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { label: "Total Staff",    val: totalStaff,   color: accent,    icon: "👤" },
            { label: "Avg Attendance", val: `${avgPct}%`, color: "#0f766e", icon: "📊" },
            { label: "≥ 75%",          val: above75,      color: "#16a34a", icon: "🟢" },
            { label: "< 75%",          val: below75,      color: "#dc2626", icon: "🔴" },
          ].map(({ label, val, color, icon }) => (
            <Grid item xs={6} sm={3} key={label}>
              <Paper elevation={0} sx={{ p: 1.5, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Typography sx={{ fontSize: 16 }}>{icon}</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color }}>{val}</Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b" }}>{label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ background: accentLight, border: `1px solid ${accent}33`, borderRadius: 2, p: 2, mb: 2 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: accent, mb: 1 }}>
          📁 Excel Import / Export — {sectionLabel}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
          <Button variant="outlined" size="small" onClick={downloadTemplate}
            sx={{ borderColor: accent, color: accent, fontSize: 12, fontWeight: 600 }}>
            ⬇ Template
          </Button>
          <Button variant="contained" size="small" component="label" disabled={uploading}
            sx={{ background: accent, "&:hover": { filter: "brightness(0.9)" }, fontSize: 12, fontWeight: 600 }}>
            {uploading ? "Importing…" : "📤 Import Excel"}
            <input type="file" hidden accept=".xlsx,.xls" key={Date.now()}
              onChange={(e) => { const f = e.target.files[0]; if (f) handleExcelUpload(f); e.target.value = ""; }} />
          </Button>
          {filteredRows.length > 0 && (
            <Button variant="outlined" size="small" onClick={exportData}
              sx={{ borderColor: accent, color: accent, fontSize: 12, fontWeight: 600 }}>
              📥 Export
            </Button>
          )}
          <Button variant="outlined" size="small" onClick={() => setShowAddForm((v) => !v)}
            sx={{ borderColor: "#64748b", color: "#374151", fontSize: 12, fontWeight: 600, ml: "auto" }}>
            {showAddForm ? "✕ Cancel" : "✏️ Add Manually"}
          </Button>
        </Box>
        <Typography sx={{ fontSize: 11, color: "#64748b", mt: 1 }}>
          ⚠️ Only <strong>{sectionLabel}</strong> posts will be accepted. Rows with wrong posts are automatically rejected.
        </Typography>
      </Box>

      {excelError  && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setExcelError("")}>{excelError}</Alert>}
      {uploadWarn  && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setUploadWarn("")}>{uploadWarn}</Alert>}

      {showAddForm && (
        <Box sx={{ border: `1px solid ${accent}33`, borderRadius: 2, p: 2, mb: 2, background: "#fafafa" }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: accent, mb: 1.5 }}>
            ✏️ Add {sectionLabel} Manually
          </Typography>
          <Grid container spacing={1.5} alignItems="flex-end">
            <Grid item xs={12} sm={3}>
              <TextField select fullWidth size="small" label="Post / Designation" value={newRow.post}
                onChange={(e) => setNewRow((p) => ({ ...p, post: e.target.value }))}>
                {postOptions.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth size="small" label="Staff Name" value={newRow.name}
                onChange={(e) => setNewRow((p) => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField fullWidth size="small" label="Days" type="number" inputProps={{ min: 0, max: 31 }}
                value={newRow.workingDays}
                onChange={(e) => setNewRow((p) => computeAttendance({ ...p, workingDays: e.target.value }))} />
            </Grid>
            {leaveFields.map(({ key, label, full }) => (
              <Grid item xs={4} sm={1} key={key}>
                <Tooltip title={full}>
                  <TextField fullWidth size="small" label={label} type="number" inputProps={{ min: 0 }}
                    value={newRow[key]}
                    onChange={(e) => setNewRow((p) => computeAttendance({ ...p, [key]: e.target.value }))} />
                </Tooltip>
              </Grid>
            ))}
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" size="small" onClick={addManualRow}
                sx={{ background: accent, "&:hover": { filter: "brightness(0.9)" }, height: 40, fontWeight: 700 }}>
                + Add
              </Button>
            </Grid>
          </Grid>
          {newRow.workingDays && (
            <Box sx={{ mt: 1.5, display: "flex", gap: 2, p: 1.5, background: accentLight, borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: 12, color: "#16a34a" }}>✅ Present: <strong>{newRow.daysPresent}</strong></Typography>
              <Typography sx={{ fontSize: 12, color: "#dc2626" }}>❌ Absent: <strong>{newRow.daysAbsent}</strong></Typography>
              <Typography sx={{ fontSize: 12, color: accent }}>📊 <strong>{newRow.percentage}%</strong></Typography>
            </Box>
          )}
        </Box>
      )}

      {filteredRows.length > 0 ? (
        <>
          <Box sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #e2e8f0", mb: 3 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr>
                  {["#", "Post", "Name", "Days", "CL", "EL", "ML", "Mat", "Pat", "Present", "Absent", "Att %", "Status", ""].map((h) => (
                    <th key={h} style={{
                      background: accent, color: "#fff", padding: "9px 8px",
                      fontSize: 11, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)",
                      whiteSpace: "nowrap", textAlign: "center",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, i) => {
                  const tc = pctColor(r.percentage);
                  return (
                    <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>{i + 1}</td>
                      <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                        <TextField select size="small" value={r.post} sx={{ minWidth: 140 }}
                          onChange={(e) => handleFieldChange(r.id, "post", e.target.value)}
                          inputProps={{ style: { fontSize: 12 } }}>
                          {postOptions.map((opt) => <MenuItem key={opt} value={opt} sx={{ fontSize: 12 }}>{opt}</MenuItem>)}
                        </TextField>
                      </td>
                      <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                        <TextField size="small" value={r.name} sx={{ minWidth: 120 }}
                          onChange={(e) => handleFieldChange(r.id, "name", e.target.value)}
                          inputProps={{ style: { fontSize: 12 } }} />
                      </td>
                      <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                        <TextField size="small" type="number" value={r.workingDays} sx={{ minWidth: 60 }}
                          inputProps={{ min: 0, max: 31, style: { fontSize: 12, textAlign: "center" } }}
                          onChange={(e) => handleFieldChange(r.id, "workingDays", e.target.value)} />
                      </td>
                      {leaveFields.map(({ key }) => (
                        <td key={key} style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                          <TextField size="small" type="number" value={r[key]} sx={{ minWidth: 52 }}
                            inputProps={{ min: 0, style: { fontSize: 12, textAlign: "center" } }}
                            onChange={(e) => handleFieldChange(r.id, key, e.target.value)} />
                        </td>
                      ))}
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Chip label={r.daysPresent} color="success" size="small" sx={{ fontWeight: 700, minWidth: 34 }} />
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Chip label={r.daysAbsent} color={r.daysAbsent > 0 ? "error" : "success"} size="small" sx={{ fontWeight: 700, minWidth: 34 }} />
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Box sx={{ px: 1.2, py: 0.3, borderRadius: 10, background: tc.bg, color: tc.color, fontSize: 12, fontWeight: 800, display: "inline-block", minWidth: 48 }}>
                          {r.percentage}%
                        </Box>
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: 14 }}>
                        {r.percentage >= 90 ? "🟢" : r.percentage >= 75 ? "🔵" : r.percentage >= 50 ? "🟡" : "🔴"}
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Button size="small" color="error" variant="text"
                          sx={{ minWidth: 0, px: 0.5, py: 0, fontSize: 14 }}
                          onClick={() => removeRow(r.id)}>✕</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>

          <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151", mb: 1.5 }}>
            Individual Summary — {activeMonth}
          </Typography>
          <Grid container spacing={2}>
            {filteredRows.map((r) => {
              const tc = pctColor(r.percentage);
              return (
                <Grid item xs={12} sm={6} md={4} key={r.id}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${tc.color}33`, borderLeft: `4px solid ${tc.color}` }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 12, color: accent }}>{r.post || "—"}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#1e3a5f", fontWeight: 700 }}>{r.name || "—"}</Typography>
                    <Divider sx={{ my: 0.8 }} />
                    <Typography sx={{ fontSize: 12 }}>Working Days: <strong>{r.workingDays || "—"}</strong></Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 1, mt: 0.5 }}>
                      <Typography sx={{ fontSize: 12, color: "#16a34a" }}>✅ <strong>{r.daysPresent}</strong> Present</Typography>
                      <Typography sx={{ fontSize: 12, color: "#dc2626" }}>❌ <strong>{r.daysAbsent}</strong> Absent</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${Math.min(r.percentage, 100)}%`, background: tc.color, borderRadius: 3 }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: tc.color, minWidth: 42 }}>{r.percentage}%</Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 5, border: `2px dashed ${accent}44`, borderRadius: 3, color: "#94a3b8", background: accentLight }}>
          <Typography sx={{ fontSize: 28, mb: 1 }}>{staffType === "Teaching" ? "👨‍🏫" : "🧹"}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: accent }}>No {sectionLabel} records for {activeMonth}</Typography>
          <Typography sx={{ fontSize: 12, mt: 0.5 }}>Download the template, fill it, and import — or click "Add Manually".</Typography>
        </Box>
      )}
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT ATTENDANCE SECTION
───────────────────────────────────────────────────────────────────────────── */
const normalizeMonth = (raw) => {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  const n = Number(s);
  if (!isNaN(n) && n >= 1 && n <= 12) return MONTHS[n - 1];
  const lower = s.toLowerCase();
  const found = MONTHS.find(
    (m) => m.toLowerCase() === lower || m.toLowerCase().startsWith(lower.slice(0, 3))
  );
  return found || "";
};

const StudentAttendanceSection = ({
  studentAttendanceData, setStudentAttendanceData,
  studentAttendanceMonth, setStudentAttendanceMonth,
}) => {
  const [activeTab,             setActiveTab]             = useState("attendance");
  const [filterClass,           setFilterClass]           = useState("All");
  const [studentExcelError,     setStudentExcelError]     = useState("");
  const [studentExcelUploading, setStudentExcelUploading] = useState(false);
  const [showAddForm,           setShowAddForm]           = useState(false);

  const [newRow, setNewRow] = useState({
    rollNo: "", name: "", class: "", section: "",
    month: studentAttendanceMonth, workingDays: "", daysPresent: "",
    daysAbsent: 0, percentage: 0,
  });

  useEffect(() => { setNewRow((p) => ({ ...p, month: studentAttendanceMonth })); }, [studentAttendanceMonth]);

  const computeStudentRow = (row) => {
    const wd  = parseFloat(row.workingDays) || 0;
    const dp  = parseFloat(row.daysPresent) || 0;
    const da  = wd > 0 ? Math.max(0, wd - dp) : 0;
    const pct = wd > 0 ? parseFloat(((dp / wd) * 100).toFixed(1)) : 0;
    return { ...row, daysAbsent: da, percentage: pct };
  };

  const downloadStudentAttendanceTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Class","Section","Month","Working Days","Days Present"]]);
    [["1","Student Name","6","A",studentAttendanceMonth,"26","24"],
     ["2","Student Name","7","B",studentAttendanceMonth,"26","20"]].forEach((row, i) => {
      row.forEach((val, j) => { ws[XLSX.utils.encode_cell({ r: i+1, c: j })] = { v: val, t: "s" }; });
    });
    ws["!cols"] = [10,24,8,10,12,14,14].map((w) => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, "Student Attendance");
    XLSX.writeFile(wb, "Student_Attendance_Template.xlsx");
    toast.success("Template downloaded!");
  };

  const handleStudentExcelUpload = (file) => {
    if (!file) return;
    setStudentExcelError(""); setStudentExcelUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb  = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
        const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
        if (!raw.length) { setStudentExcelError("File is empty."); setStudentExcelUploading(false); return; }

        const parsed = raw.map((row) => {
          const r = normaliseKeys(row);
          const rawMonth  = r["month"] ?? "";
          const normMonth = normalizeMonth(rawMonth) || studentAttendanceMonth;
          const rollNo = String(r["rollno"] ?? r["roll"] ?? "").trim();

          return computeStudentRow({
            rollNo,
            name:        String(r["name"]   ?? r["studentname"] ?? "").trim(),
            class:       String(r["class"]  ?? r["grade"] ?? "").trim(),
            section:     String(r["section"] ?? r["sec"] ?? "").trim(),
            month:       normMonth,
            workingDays: r["workingdays"] ?? r["totaldays"] ?? "",
            daysPresent: r["dayspresent"] ?? r["present"] ?? "",
            daysAbsent: 0, percentage: 0,
          });
        });

        setStudentAttendanceData((prev) => {
          const updated = [...prev];
          parsed.forEach((inc) => {
            const idx = updated.findIndex(
              (x) => String(x.rollNo).trim() === String(inc.rollNo).trim() &&
                     x.month === inc.month
            );
            if (idx !== -1) updated[idx] = inc; else updated.push(inc);
          });
          return updated;
        });

        toast.success(`✅ Imported ${parsed.length} student record(s).`);
      } catch (err) {
        setStudentExcelError("Failed to parse: " + err.message);
      } finally { setStudentExcelUploading(false); }
    };
    reader.onerror = () => { setStudentExcelError("Could not read file."); setStudentExcelUploading(false); };
    reader.readAsArrayBuffer(file);
  };

  const exportStudentAttendance = () => {
    const data = studentAttendanceData.filter((r) => !studentAttendanceMonth || r.month === studentAttendanceMonth);
    if (!data.length) { toast.error("No data to export."); return; }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data.map((r) => ({
      "Roll No": r.rollNo, "Name": r.name, "Class": r.class, "Section": r.section,
      "Month": r.month, "Working Days": r.workingDays, "Days Present": r.daysPresent,
      "Days Absent": r.daysAbsent, "Attendance %": r.percentage,
    })));
    XLSX.utils.book_append_sheet(wb, ws, "Student Attendance");
    XLSX.writeFile(wb, `Student_${studentAttendanceMonth}_Attendance.xlsx`);
    toast.success("Exported!");
  };

  const allClasses = [...new Set(
    studentAttendanceData
      .filter((r) => !studentAttendanceMonth || r.month === studentAttendanceMonth)
      .map((r) => r.class).filter(Boolean)
  )].sort();

  const filteredData = studentAttendanceData.filter((r) => {
    const monthOk = !studentAttendanceMonth || r.month === studentAttendanceMonth;
    const classOk = filterClass === "All" || r.class === filterClass;
    return monthOk && classOk;
  });

  const classAverages = {};
  allClasses.forEach((cls) => {
    const recs = studentAttendanceData.filter(
      (r) => r.class === cls && (!studentAttendanceMonth || r.month === studentAttendanceMonth)
    );
    if (recs.length)
      classAverages[cls] = parseFloat((recs.reduce((s, r) => s + r.percentage, 0) / recs.length).toFixed(1));
  });

  const addManualRow = () => {
    if (!newRow.name.trim()) { toast.error("Please enter student name."); return; }
    const computed = computeStudentRow({ ...newRow, month: studentAttendanceMonth });
    setStudentAttendanceData((prev) => {
      const idx = prev.findIndex(
        (x) => String(x.rollNo).trim() === String(computed.rollNo).trim() && x.month === computed.month
      );
      const updated = [...prev];
      if (idx !== -1) updated[idx] = computed; else updated.push(computed);
      return updated;
    });
    setNewRow({
      rollNo: "", name: "", class: "", section: "",
      month: studentAttendanceMonth, workingDays: "", daysPresent: "",
      daysAbsent: 0, percentage: 0,
    });
    setShowAddForm(false);
    toast.success("✅ Student added.");
  };

  const removeRow = (rollNo, month) =>
    setStudentAttendanceData((prev) =>
      prev.filter((r) => !(String(r.rollNo).trim() === String(rollNo).trim() && r.month === month))
    );

  const totalStudents = filteredData.length;
  const avgAttendance = totalStudents > 0
    ? (filteredData.reduce((s, r) => s + r.percentage, 0) / totalStudents).toFixed(1) : null;
  const above75 = filteredData.filter((r) => r.percentage >= 75).length;
  const below50 = filteredData.filter((r) => r.percentage < 50).length;

  const attColor = (pct) => {
    if (pct >= 75) return { color: "#16a34a", bg: "#dcfce7" };
    if (pct >= 50) return { color: "#d97706", bg: "#fef3c7" };
    return { color: "#dc2626", bg: "#fee2e2" };
  };

  const monthHolidays = getHolidaysForMonth(studentAttendanceMonth);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {[{ id: "attendance", label: "📋 Attendance" }, { id: "classwise", label: "🏫 Class-wise" }, { id: "performance", label: "📊 Performance" }].map((tab) => (
          <Button key={tab.id} size="small" variant={activeTab === tab.id ? "contained" : "outlined"} onClick={() => setActiveTab(tab.id)}
            sx={{ borderRadius: 2, fontWeight: 600, fontSize: 12, ...(activeTab === tab.id ? { background: "#0f766e", "&:hover": { background: "#0d5f58" } } : { borderColor: "#0f766e", color: "#0f766e" }) }}>
            {tab.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2, alignItems: "center" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mr: 0.5 }}>Month:</Typography>
        {MONTHS.map((m) => (
          <Chip key={m} label={m.slice(0,3)} size="small" onClick={() => setStudentAttendanceMonth(m)}
            color={studentAttendanceMonth === m ? "success" : "default"}
            variant={studentAttendanceMonth === m ? "filled" : "outlined"}
            sx={{ fontWeight: studentAttendanceMonth === m ? 700 : 400, cursor: "pointer", fontSize: 11 }} />
        ))}
      </Box>

      {monthHolidays.length > 0 && (
        <Alert severity="info" icon={false} sx={{ mb: 2, py: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}>🗓️ Holidays in {studentAttendanceMonth}:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {monthHolidays.map((h, i) => (
              <Chip key={i} label={`${new Date(h.date).getDate()} – ${h.name}`} size="small"
                sx={{ fontSize: 11, background: h.type === "National" ? "#dbeafe" : "#dcfce7", color: h.type === "National" ? "#1d4ed8" : "#16a34a", fontWeight: 600 }} />
            ))}
          </Box>
        </Alert>
      )}

      {activeTab === "attendance" && (
        <>
          {totalStudents > 0 && (
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {[
                { label: "Total Students", val: totalStudents,       color: "#1976d2", icon: "👨‍🎓" },
                { label: "Avg Attendance", val: `${avgAttendance}%`, color: "#0f766e", icon: "📊" },
                { label: "≥ 75%",          val: above75,             color: "#16a34a", icon: "🟢" },
                { label: "< 50%",          val: below50,             color: "#dc2626", icon: "🔴" },
              ].map(({ label, val, color, icon }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                    <Typography sx={{ fontSize: 16 }}>{icon}</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color }}>{val}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>{label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 2, p: 2, mb: 2 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#0f766e", mb: 1 }}>📁 Excel Import / Export — Student Attendance</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Button variant="outlined" size="small" onClick={downloadStudentAttendanceTemplate}
                sx={{ borderColor: "#0f766e", color: "#0f766e", fontSize: 12, fontWeight: 600 }}>
                ⬇ Template
              </Button>
              <Button variant="contained" size="small" component="label" disabled={studentExcelUploading}
                sx={{ background: "#0f766e", "&:hover": { background: "#0d5f58" }, fontSize: 12, fontWeight: 600 }}>
                {studentExcelUploading ? "Importing…" : "📤 Import Excel"}
                <input type="file" hidden accept=".xlsx,.xls"
                  onChange={(e) => { if (e.target.files[0]) handleStudentExcelUpload(e.target.files[0]); e.target.value = ""; }} />
              </Button>
              {filteredData.length > 0 && (
                <Button variant="outlined" size="small" onClick={exportStudentAttendance}
                  sx={{ borderColor: "#0f766e", color: "#0f766e", fontSize: 12, fontWeight: 600 }}>
                  📥 Export
                </Button>
              )}
              <Button variant="outlined" size="small" onClick={() => setShowAddForm((v) => !v)}
                sx={{ borderColor: "#64748b", color: "#374151", fontSize: 12, fontWeight: 600, ml: "auto" }}>
                {showAddForm ? "✕ Cancel" : "✏️ Add Manually"}
              </Button>
            </Box>
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 1 }}>
              Columns: Roll No · Name · Class · Section · Month · Working Days · Days Present
            </Typography>
          </Box>

          {studentExcelError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setStudentExcelError("")}>{studentExcelError}</Alert>}

          {showAddForm && (
            <Box sx={{ border: "1px solid #0f766e33", borderRadius: 2, p: 2, mb: 2, background: "#fafafa" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f766e", mb: 1.5 }}>✏️ Add Student Manually</Typography>
              <Grid container spacing={1.5} alignItems="center">
                {[
                  { key: "rollNo",      label: "Roll No",      xs: 6,  sm: 2 },
                  { key: "name",        label: "Name",         xs: 12, sm: 3 },
                  { key: "class",       label: "Class",        xs: 4,  sm: 1 },
                  { key: "section",     label: "Section",      xs: 4,  sm: 1 },
                  { key: "workingDays", label: "Working Days", xs: 4,  sm: 2, type: "number" },
                  { key: "daysPresent", label: "Days Present", xs: 6,  sm: 2, type: "number" },
                ].map(({ key, label, xs, sm, type = "text" }) => (
                  <Grid item xs={xs} sm={sm} key={key}>
                    <TextField fullWidth size="small" label={label} type={type} value={newRow[key]}
                      inputProps={type === "number" ? { min: 0, max: 31 } : {}}
                      onChange={(e) => setNewRow((p) => computeStudentRow({ ...p, [key]: e.target.value }))} />
                  </Grid>
                ))}
                <Grid item xs={6} sm={1}>
                  <Button fullWidth variant="contained" size="small" onClick={addManualRow}
                    sx={{ background: "#0f766e", "&:hover": { background: "#0d5f58" }, height: 40 }}>
                    + Add
                  </Button>
                </Grid>
              </Grid>
              {(newRow.workingDays || newRow.daysPresent) && (
                <Box sx={{ mt: 1.5, display: "flex", gap: 2, p: 1.5, background: "#f0fdf4", borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: 12, color: "#16a34a" }}>✅ Present: <strong>{newRow.daysPresent}</strong></Typography>
                  <Typography sx={{ fontSize: 12, color: "#dc2626" }}>❌ Absent: <strong>{newRow.daysAbsent}</strong></Typography>
                  <Typography sx={{ fontSize: 12, color: "#0f766e" }}>📊 <strong>{newRow.percentage}%</strong></Typography>
                </Box>
              )}
            </Box>
          )}

          {allClasses.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 2, alignItems: "center" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mr: 0.5 }}>Class:</Typography>
              {["All", ...allClasses].map((cls) => (
                <Chip key={cls} label={cls === "All" ? "All" : `Class ${cls}`} size="small"
                  onClick={() => setFilterClass(cls)}
                  color={filterClass === cls ? "success" : "default"}
                  variant={filterClass === cls ? "filled" : "outlined"}
                  sx={{ fontWeight: filterClass === cls ? 700 : 400, cursor: "pointer", fontSize: 11 }} />
              ))}
            </Box>
          )}

          {filteredData.length > 0 ? (
            <Box sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
                <thead>
                  <tr>
                    {["#","Roll No","Name","Class","Sec","Days","Present","Absent","Att %","Status",""].map((h) => (
                      <th key={h} style={{ background: "#0f766e", color: "#fff", padding: "8px 10px", fontSize: 11, fontWeight: 700, border: "1px solid #0d5f58", whiteSpace: "nowrap", textAlign: "center" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((r, i) => {
                    const tc = attColor(r.percentage);
                    return (
                      <tr key={`${r.rollNo}-${r.month}-${i}`} style={{ backgroundColor: i % 2 === 0 ? "#f0fdfa" : "#fff" }}>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center", fontSize:12, color:"#94a3b8" }}>{i+1}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", fontSize:12, fontWeight:600 }}>{r.rollNo}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", fontSize:13, fontWeight:600 }}>{r.name}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", fontSize:12, textAlign:"center" }}>{r.class}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", fontSize:12, textAlign:"center" }}>{r.section}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", fontSize:12, textAlign:"center" }}>{r.workingDays}</td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center" }}>
                          <Chip label={r.daysPresent} color="success" size="small" sx={{ fontWeight:700, minWidth:34 }} />
                        </td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center" }}>
                          <Chip label={r.daysAbsent} color={r.daysAbsent > 0 ? "error" : "success"} size="small" sx={{ fontWeight:700, minWidth:34 }} />
                        </td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center" }}>
                          <Box sx={{ px:1.2, py:0.3, borderRadius:10, background:tc.bg, color:tc.color, fontSize:12, fontWeight:800, display:"inline-block" }}>{r.percentage}%</Box>
                        </td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center", fontSize:14 }}>
                          {r.percentage >= 75 ? "🟢" : r.percentage >= 50 ? "🟡" : "🔴"}
                        </td>
                        <td style={{ padding:"6px 10px", border:"1px solid #d1fae5", textAlign:"center" }}>
                          <Button size="small" color="error" variant="text" sx={{ minWidth:0, px:0.5, fontSize:14 }} onClick={() => removeRow(r.rollNo, r.month)}>✕</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          ) : (
            <Box sx={{ textAlign:"center", py:5, border:"2px dashed #e2e8f0", borderRadius:3, color:"#94a3b8" }}>
              <Typography sx={{ fontSize:28, mb:1 }}>📋</Typography>
              <Typography sx={{ fontSize:14, fontWeight:600 }}>No records for {studentAttendanceMonth}</Typography>
              <Typography sx={{ fontSize:12, mt:0.5 }}>Import Excel or click "Add Manually".</Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === "classwise" && (
        <Box>
          <Typography sx={{ fontWeight:700, color:"#0f766e", fontSize:14, mb:2 }}>🏫 Class-wise Average — {studentAttendanceMonth}</Typography>
          {allClasses.length === 0 ? (
            <Typography sx={{ color:"#94a3b8", fontStyle:"italic" }}>No data available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {allClasses.map((cls) => {
                const recs = studentAttendanceData.filter((r) => r.class === cls && (!studentAttendanceMonth || r.month === studentAttendanceMonth));
                const avg  = classAverages[cls] || 0;
                const good = recs.filter((r) => r.percentage >= 75).length;
                const low  = recs.filter((r) => r.percentage < 50).length;
                const tc   = attColor(avg);
                return (
                  <Grid item xs={12} sm={6} md={4} key={cls}>
                    <Paper elevation={0} sx={{ p:2, borderRadius:2, border:"1px solid #e2e8f0", borderTop:`4px solid ${tc.color}` }}>
                      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:1 }}>
                        <Typography sx={{ fontWeight:800, color:"#1e3a5f", fontSize:15 }}>Class {cls}</Typography>
                        <Box sx={{ px:1.5, py:0.3, borderRadius:10, background:tc.bg, color:tc.color, fontSize:15, fontWeight:800 }}>{avg}%</Box>
                      </Box>
                      <Typography sx={{ fontSize:12, color:"#64748b", mb:1 }}>Students: <strong>{recs.length}</strong></Typography>
                      <Box sx={{ height:6, background:"#e2e8f0", borderRadius:3, overflow:"hidden", mb:1 }}>
                        <Box sx={{ height:"100%", width:`${Math.min(avg,100)}%`, background:tc.color, borderRadius:3 }} />
                      </Box>
                      <Box sx={{ display:"flex", gap:1 }}>
                        <Chip label={`🟢 ${good}`} size="small" sx={{ background:"#dcfce7", color:"#16a34a", fontWeight:700, fontSize:11 }} />
                        <Chip label={`🔴 ${low}`}  size="small" sx={{ background:"#fee2e2", color:"#dc2626", fontWeight:700, fontSize:11 }} />
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {activeTab === "performance" && (
        <Box>
          <Typography sx={{ fontWeight:700, color:"#0f766e", fontSize:14, mb:1.5 }}>📈 Monthly Attendance Trend</Typography>
          {(() => {
            const trend = MONTHS.map((m) => {
              const recs = studentAttendanceData.filter((r) => r.month === m);
              return {
                month: m,
                avg: recs.length
                  ? parseFloat((recs.reduce((s, r) => s + r.percentage, 0) / recs.length).toFixed(1))
                  : null,
                count: recs.length,
              };
            });
            const maxAvg = Math.max(...trend.filter((t) => t.avg !== null).map((t) => t.avg), 1);
            const hasAnyData = trend.some((t) => t.avg !== null);

            if (!hasAnyData) {
              return (
                <Box sx={{ textAlign:"center", py:4, border:"2px dashed #e2e8f0", borderRadius:2, color:"#94a3b8" }}>
                  <Typography sx={{ fontSize:13 }}>No attendance data yet. Import records to see the trend.</Typography>
                </Box>
              );
            }

            return (
              <Box sx={{ display:"flex", alignItems:"flex-end", gap:1, height:160, background:"#f0fdfa", border:"1px solid #a7f3d0", borderRadius:2, px:2, py:2, overflowX:"auto", mb:3 }}>
                {trend.map(({ month, avg, count }) => {
                  const clr = avg === null ? "#d1d5db" : avg >= 75 ? "#16a34a" : avg >= 50 ? "#d97706" : "#dc2626";
                  const barH = avg !== null ? `${Math.max((avg / maxAvg) * 100, 4)}px` : "4px";
                  return (
                    <Tooltip key={month} title={avg !== null ? `${avg}% (${count} students)` : "No data"} arrow>
                      <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:36, flex:1, cursor:"default" }}>
                        <Typography sx={{ fontSize:9, fontWeight:700, color:clr, mb:0.5 }}>
                          {avg !== null ? `${avg}%` : "—"}
                        </Typography>
                        <Box sx={{ width:"80%", height: barH, background:clr, borderRadius:"4px 4px 0 0", minHeight:4, transition:"height 0.3s" }} />
                        <Typography sx={{ fontSize:9, color: month === studentAttendanceMonth ? "#0f766e" : "#64748b", mt:0.5, fontWeight: month === studentAttendanceMonth ? 800 : 400 }}>
                          {month.slice(0,3)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })()}

          {studentAttendanceData.filter((r) => r.percentage < 75).length > 0 && (
            <Alert severity="warning" sx={{ borderRadius:2 }}>
              <Typography sx={{ fontWeight:700, fontSize:13, mb:1 }}>⚠️ Students Below 75% (all months)</Typography>
              <Box sx={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>{["Roll No","Name","Class","Month","Att %"].map((h) => (
                      <th key={h} style={{ padding:"4px 8px", background:"#fef3c7", fontSize:11, fontWeight:700, border:"1px solid #fde68a" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {studentAttendanceData
                      .filter((r) => r.percentage < 75)
                      .sort((a, b) => a.percentage - b.percentage)
                      .slice(0, 20)
                      .map((r, i) => (
                        <tr key={i} style={{ backgroundColor: r.percentage < 50 ? "#fee2e2" : "#fffbeb" }}>
                          <td style={{ padding:"4px 8px", border:"1px solid #fde68a", fontSize:12 }}>{r.rollNo}</td>
                          <td style={{ padding:"4px 8px", border:"1px solid #fde68a", fontSize:12, fontWeight:600 }}>{r.name}</td>
                          <td style={{ padding:"4px 8px", border:"1px solid #fde68a", fontSize:12 }}>{r.class} {r.section ? `- ${r.section}` : ""}</td>
                          <td style={{ padding:"4px 8px", border:"1px solid #fde68a", fontSize:12 }}>{r.month}</td>
                          <td style={{ padding:"4px 8px", border:"1px solid #fde68a", fontSize:12, fontWeight:700, color: r.percentage < 50 ? "#dc2626" : "#d97706" }}>{r.percentage}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ANNUAL STAFF OVERVIEW
───────────────────────────────────────────────────────────────────────────── */
const AnnualStaffOverview = ({ staffAttendanceRows }) => {
  if (!staffAttendanceRows.length)
    return <Typography sx={{ color:"#94a3b8", fontStyle:"italic", fontSize:13 }}>No attendance data yet.</Typography>;

  const staffMap = {};
  staffAttendanceRows.forEach((r) => {
    const key = `${r.staffType}|${r.post}|${r.name}`;
    if (!staffMap[key]) staffMap[key] = { name: r.name, post: r.post, type: r.staffType, months: {} };
    staffMap[key].months[r.month] = r.percentage;
  });

  return (
    <Box sx={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            {["Staff","Post","Type",...MONTHS.map((m) => m.slice(0,3))].map((h) => (
              <th key={h} style={{ backgroundColor:"#f1f5f9", color:"#374151", padding:"6px 8px", textAlign:"center", fontSize:11, fontWeight:700, border:"1px solid #e2e8f0", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(staffMap).map((staff, rIdx) => (
            <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? "#f8fafc" : "#fff" }}>
              <td style={{ padding:"6px 8px", border:"1px solid #e2e8f0", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>{staff.name || "—"}</td>
              <td style={{ padding:"6px 8px", border:"1px solid #e2e8f0", fontSize:11, color:"#1976d2", fontWeight:600 }}>{staff.post || "—"}</td>
              <td style={{ padding:"6px 8px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                <Chip label={staff.type === "Teaching" ? "🏫 T" : "🧹 NT"} size="small"
                  sx={{ fontSize:10, background: staff.type === "Teaching" ? "#dbeafe" : "#ede9fe", color: staff.type === "Teaching" ? "#1d4ed8" : "#7c3aed", fontWeight:700 }} />
              </td>
              {MONTHS.map((month) => {
                const pct = staff.months[month];
                return (
                  <td key={month} style={{ padding:"4px 6px", border:"1px solid #e2e8f0", textAlign:"center", fontSize:11, backgroundColor: pct == null ? "transparent" : pct >= 75 ? "#f0fdf4" : "#fef2f2" }}>
                    {pct != null
                      ? <Typography component="span" sx={{ fontWeight:700, color: pct >= 75 ? "#16a34a" : "#dc2626", fontSize:11 }}>{pct}%</Typography>
                      : <Typography component="span" sx={{ color:"#d1d5db", fontSize:10 }}>—</Typography>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS — SAKSHAM SATURDAY
───────────────────────────────────────────────────────────────────────────── */
const getSaturdaysForMonth = (monthName, yearValue) => {
  const monthIndex = MONTHS.indexOf(monthName);
  const year = parseInt(yearValue, 10);
  if (monthIndex === -1 || Number.isNaN(year)) return [];
  const dates = [];
  const current = new Date(year, monthIndex, 1);
  while (current.getMonth() === monthIndex) {
    if (current.getDay() === 6) dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const SAKSHAM_THEME_CATEGORIES = [
  "Literary Arts and Language Enrichment",
  "Tourism, Heritage and Hospitality",
  "Arts, Crafts and Handicrafts",
  "Performing and Visual Arts",
  "Technical and Vocational Trades",
  "Allied Agricultural and Horticulture Activities",
  "Craft and Innovation through Reusable/Waste Materials",
  "Information Technology, Digital Literacy and Innovation",
  "Life Skills, Health and Wellness Education",
  "Traditional Indigenous Games and Recreational Activities",
  "Educational Exposure Visits and Community Interaction",
  "Sports, Physical Education and Fitness Activities",
  "Environment Conservation, Sustainability and Climate Awareness",
];

const SAKSHAM_ACTIVITIES_BY_THEME = {
  "Literary Arts and Language Enrichment": ["Storytelling","Creative writing","Debate","Poetry recitation","Reading activity","Language-based learning exercise"],
  "Tourism, Heritage and Hospitality": ["Visit to historical monument","Museum visit","Cultural site visit","Tourist place visit","Interaction with local community"],
  "Arts, Crafts and Handicrafts": ["Pottery","Bamboo craft","Weaving","Tribal handicraft activity","Clay modelling","Local artisan-based activity"],
  "Performing and Visual Arts": ["Music activity","Dance activity","Theatre activity","Painting","Drawing","Folk arts presentation","Cultural presentation"],
  "Technical and Vocational Trades": ["Carpentry basics","Electrical basics","Repair activity","Entrepreneurship exposure","Skill-based demonstration"],
  "Allied Agricultural and Horticulture Activities": ["Gardening","Kitchen gardening","Plantation drive","Composting","Sustainable farming awareness"],
  "Craft and Innovation through Reusable/Waste Materials": ["Waste-to-art activity","Recycling project","Creative use of locally available materials"],
  "Information Technology, Digital Literacy and Innovation": ["Coding exposure","Cyber safety awareness","Robotics activity","AI awareness","Digital learning activity"],
  "Life Skills, Health and Wellness Education": ["Communication skills activity","Leadership activity","Teamwork activity","Nutrition awareness","Mental well-being activity","Yoga","Sanitation awareness"],
  "Traditional Indigenous Games and Recreational Activities": ["Local games","Teamwork game","Fitness activity","Tribal tradition preservation activity"],
  "Educational Exposure Visits and Community Interaction": ["Farm visit","Local industry visit","Public institution visit","Skill centre visit","Interaction with local artisan","Interaction with expert/resource person"],
  "Sports, Physical Education and Fitness Activities": ["Indoor sports","Outdoor sports","Athletics","Yoga","Wellness programme","Physical fitness programme"],
  "Environment Conservation, Sustainability and Climate Awareness": ["Biodiversity awareness","Water conservation activity","Waste management activity","Environmental campaign","Sustainable lifestyle practice"],
};

/* ─────────────────────────────────────────────────────────────────────────────
   ACADEMIC CALENDAR WIDGET  (shared between pre & post sections)
   - Month + Year selectors
   - Saturday chips — clickable to set selectedDate
   - Holidays shown inline on each chip
───────────────────────────────────────────────────────────────────────────── */
const AcademicCalendarWidget = ({ calendarMonth, setCalendarMonth, calendarYear, setCalendarYear, selectedDate, setSelectedDate }) => {
  const saturdays = getSaturdaysForMonth(calendarMonth, calendarYear);
  const holidays  = getHolidaysForMonth(calendarMonth).filter(
    (h) => new Date(h.date).getFullYear() === parseInt(calendarYear, 10)
  );

  return (
    <Box sx={{ border: "1px solid #dbeafe", borderRadius: 2, overflow: "hidden", mb: 2, background: "#fff" }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, background: "linear-gradient(135deg, #1e40af, #3b82f6)", display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>📅 Academic Calendar</Typography>
        {selectedDate && (
          <Chip
            label={`Selected: ${new Date(selectedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
            size="small"
            onDelete={() => setSelectedDate("")}
            sx={{ ml: "auto", background: "#fff", color: "#1e40af", fontWeight: 700, fontSize: 11 }}
          />
        )}
      </Box>

      {/* Month / Year selectors */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #dbeafe", display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", background: "#eff6ff" }}>
        <TextField
          select size="small" label="Month" value={calendarMonth}
          onChange={(e) => { setCalendarMonth(e.target.value); setSelectedDate(""); }}
          sx={{ minWidth: 140 }}
        >
          {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField
          size="small" label="Year" value={calendarYear}
          onChange={(e) => { setCalendarYear(e.target.value); setSelectedDate(""); }}
          sx={{ minWidth: 100 }}
          inputProps={{ maxLength: 4 }}
        />
        <Typography sx={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, ml: "auto" }}>
          Click a Saturday below to auto-fill the date in your rows
        </Typography>
      </Box>

      {/* Saturday chips */}
      <Box sx={{ p: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {saturdays.length > 0 ? saturdays.map((date) => {
          const iso     = date.toISOString().slice(0, 10);
          const holiday = holidays.find((h) => h.date === iso);
          const isSelected = selectedDate === iso;
          const weekNum = saturdays.indexOf(date) + 1;

          return (
            <Tooltip
              key={iso}
              title={holiday ? `🏖️ Holiday: ${holiday.name}` : `Click to select — Week ${weekNum} Saturday`}
              arrow
            >
              <Chip
                onClick={() => setSelectedDate(isSelected ? "" : iso)}
                label={
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.25 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
                      {date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </Typography>
                    <Typography sx={{ fontSize: 9, lineHeight: 1.2, opacity: 0.85 }}>
                      Sat · Wk {weekNum}
                    </Typography>
                    {holiday && (
                      <Typography sx={{ fontSize: 8, lineHeight: 1.2, color: "#dc2626", fontWeight: 700 }}>
                        Holiday
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  height: "auto",
                  py: 0.5,
                  cursor: "pointer",
                  background: isSelected
                    ? "#1d4ed8"
                    : holiday
                    ? "#fee2e2"
                    : "#dcfce7",
                  color: isSelected ? "#fff" : holiday ? "#dc2626" : "#166534",
                  fontWeight: 700,
                  border: isSelected ? "2px solid #1e40af" : holiday ? "1px solid #fca5a5" : "1px solid #86efac",
                  "&:hover": {
                    background: isSelected ? "#1e40af" : holiday ? "#fecaca" : "#bbf7d0",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  },
                  transition: "all 0.15s ease",
                }}
              />
            </Tooltip>
          );
        }) : (
          <Typography sx={{ color: "#94a3b8", fontSize: 12, py: 0.5 }}>
            Enter a valid month and year to view Saturdays.
          </Typography>
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ px: 2, py: 1, borderTop: "1px solid #dbeafe", background: "#f8faff", display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#dcfce7", border: "1px solid #86efac" }} />
          <Typography sx={{ fontSize: 10, color: "#64748b" }}>Regular Saturday</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#fee2e2", border: "1px solid #fca5a5" }} />
          <Typography sx={{ fontSize: 10, color: "#64748b" }}>Holiday Saturday</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#1d4ed8" }} />
          <Typography sx={{ fontSize: 10, color: "#64748b" }}>Selected</Typography>
        </Box>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CLASS DROPDOWN CELL — renders a select with Class 6 / 7 / 8
───────────────────────────────────────────────────────────────────────────── */
const ClassDropdown = ({ value, onChange }) => (
  <TextField select fullWidth size="small" value={value} onChange={(e) => onChange(e.target.value)}>
    <MenuItem value="">Select Class</MenuItem>
    {CLASS_OPTIONS.map((c) => (
      <MenuItem key={c} value={c}>Class {c}</MenuItem>
    ))}
  </TextField>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SAKSHAM SATURDAY REPORT
   CHANGES:
   1. AcademicCalendarWidget moved ABOVE the Pre-Activity Planning box
   2. Clicking a Saturday chip sets `selectedDate` which is the shared state
   3. className field in both tables now uses ClassDropdown (6 / 7 / 8)
───────────────────────────────────────────────────────────────────────────── */
const SakshamSaturdayReport = () => {
  const currentYear = new Date().getFullYear();

  // ── SHARED calendar state (used by both pre & post tables) ──
  const [calendarMonth, setCalendarMonth] = useState(MONTHS[new Date().getMonth()]);
  const [calendarYear,  setCalendarYear]  = useState(String(currentYear));
  const [selectedDate,  setSelectedDate]  = useState("");   // ISO date string of chosen Saturday

  // Derive a "Week N" label from the selected date
  const selectedWeekLabel = (() => {
    if (!selectedDate) return "";
    const saturdays = getSaturdaysForMonth(calendarMonth, calendarYear);
    const idx = saturdays.findIndex((d) => d.toISOString().slice(0, 10) === selectedDate);
    return idx >= 0 ? `Week ${idx + 1} (${new Date(selectedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })})` : selectedDate;
  })();

  const [prePlanningRows, setPrePlanningRows] = useState([
    {
      id: 1,
      monthWeek: "Week 1",
      className: "6",
      themeCategory: "Literary Arts and Language Enrichment",
      activity: "Reading activity",
      resourcePersons: "Language teacher",
      studentsParticipated: "40",
      orientation: "Student orientation before activity",
      learningObjectives: "Reading fluency and comprehension",      
    },
  ]);

  const [postPlanningRows, setPostPlanningRows] = useState([
    {
      id: 1,
      monthWeek: "Week 1",
      className: "6",
      themeCategory: "Literary Arts and Language Enrichment",
      activity: "Reading activity",
      resourcePersons: "Language teacher",
      studentsParticipated: "",
      learningObjectives: "Reading fluency and comprehension",
      resourcesRequired: "Story cards, worksheets",
      preActivityPlanning: "Orientation, materials and briefing completed",
      executionDuringActivity: "",
      learningOutcomesAssessment: "",
      photos: [],
      reportFile: null,
    },
  ]);

  /* ── Row mutation helpers ── */
  const handlePrePlanningChange = (id, field, value) => {
    setPrePlanningRows((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      if (field === "themeCategory") return { ...row, themeCategory: value, activity: "" };
      return { ...row, [field]: value };
    }));
  };

  const handlePostPlanningChange = (id, field, value) => {
    setPostPlanningRows((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      if (field === "themeCategory") return { ...row, themeCategory: value, activity: "" };
      return { ...row, [field]: value };
    }));
  };

  const handlePostFileUpload = (id, field, files) => {
    const selectedFiles = Array.from(files || []);
    setPostPlanningRows((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      if (field === "photos") return { ...row, photos: selectedFiles.map((f) => f.name) };
      return { ...row, reportFile: selectedFiles[0]?.name || null };
    }));
  };

  const addPrePlanningRow = () => {
    setPrePlanningRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        // Pre-fill monthWeek from the calendar selection if available
        monthWeek: selectedWeekLabel || "",
        className: "",
        themeCategory: "", activity: "", resourcePersons: "",
        studentsParticipated: "", orientation: "", learningObjectives: "",  
      },
    ]);
  };

  const addPostPlanningRow = () => {
    setPostPlanningRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        monthWeek: selectedWeekLabel || "",
        className: "", themeCategory: "", activity: "", resourcePersons: "",
        studentsParticipated: "", learningObjectives: "", resourcesRequired: "",
        preActivityPlanning: "", executionDuringActivity: "",
        learningOutcomesAssessment: "", 
        photos: [], reportFile: null,
      },
    ]);
  };

  const removePrePlanningRow  = (id) => setPrePlanningRows((prev) => prev.filter((r) => r.id !== id));
  const removePostPlanningRow = (id) => setPostPlanningRows((prev) => prev.filter((r) => r.id !== id));

  /* ── Gap analysis ── */
  const makeActivityKey = (row) =>
    [row.monthWeek, row.className, row.themeCategory, row.activity]
      .map((v) => String(v || "").trim().toLowerCase()).join("|");

  const prePlanningMap    = new Map(prePlanningRows.map((r) => [makeActivityKey(r), r]));
  const reportedPostKeys  = new Set(postPlanningRows.map(makeActivityKey));

  const postGapRows = postPlanningRows.map((postRow) => {
    const matchingPlan = prePlanningMap.get(makeActivityKey(postRow));
    const gaps = [
      !matchingPlan                                               ? "No matching pre-activity planning row" : "",
      !postRow.themeCategory.trim()                              ? "Theme category not selected" : "",
      matchingPlan && matchingPlan.learningObjectives.trim() &&
        postRow.learningObjectives.trim() &&
      !postRow.resourcePersons.trim()                            ? "Resource person not recorded" : "",
      !postRow.studentsParticipated.trim()                       ? "Students participated not recorded" : "",
      !postRow.resourcesRequired.trim()                          ? "Resources/resource persons not recorded" : "",
      !postRow.preActivityPlanning.trim()                        ? "Pre-activity planning summary missing" : "",     
     
      (!postRow.photos?.length && !postRow.reportFile)           ? "Activity photos or report file not uploaded" : "",
    ].filter(Boolean);

    return {
      id: `post-${postRow.id}`,
      monthWeek: postRow.monthWeek || "-",
      className: postRow.className || "-",
      themeCategory: postRow.themeCategory || "-",
      activity: postRow.activity || "Untitled activity",
      status: gaps.length ? "Gap Found" : "Complete",
      gap: gaps.join("; ") || "No gap",
      action: gaps.length ? "Complete missing documentation and align report with pre-activity plan" : "Ready for documentation",
    };
  });

  const unreportedPreRows = prePlanningRows
    .filter((preRow) => !reportedPostKeys.has(makeActivityKey(preRow)))
    .map((preRow) => ({
      id: `pre-${preRow.id}`,
      monthWeek: preRow.monthWeek || "-",
      className: preRow.className || "-",
      themeCategory: preRow.themeCategory || "-",
      activity: preRow.activity || "Untitled activity",
      status: "Report Pending",
      gap: "Pre-activity planned but post-activity report is not added",
      action: "Add the matching post-activity report after completion",
    }));

  const gapRows = [...postGapRows, ...unreportedPreRows];

  const renderEditableTable = (headers, rows, renderRow) => (
    <Box sx={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ background: "#f1f5f9", color: "#334155", padding: "8px", textAlign: "left", fontSize: 12, fontWeight: 700, border: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </Box>
  );

  /* ── Shared cell renderer for className ── */
  const renderPreTableRow = (row) => (
    <tr key={row.id}>
      {[
        ["monthWeek",           "Month / Week"],
        ["className",           "Class"],
        ["themeCategory",       "Theme Category"],
        ["activity",            "Activity Name"],
        ["resourcePersons",     "Resource Person"],
        ["studentsParticipated","Students Participated"],       
      ].map(([field, label]) => (
        <td key={field} style={{
          padding: "6px", border: "1px solid #e2e8f0",
          minWidth: field === "className" ? 110 : field === "studentsParticipated" ? 140 : 180,
        }}>
          {field === "className" ? (
            <ClassDropdown value={row[field]} onChange={(v) => handlePrePlanningChange(row.id, field, v)} />
          ) : field === "themeCategory" ? (
            <TextField select fullWidth size="small" value={row[field]} onChange={(e) => handlePrePlanningChange(row.id, field, e.target.value)}>
              <MenuItem value="">Select Theme Category</MenuItem>
              {SAKSHAM_THEME_CATEGORIES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          ) : field === "activity" ? (
            <TextField select fullWidth size="small" value={row[field]} onChange={(e) => handlePrePlanningChange(row.id, field, e.target.value)} disabled={!row.themeCategory}>
              <MenuItem value="">Select Activity</MenuItem>
              {(SAKSHAM_ACTIVITIES_BY_THEME[row.themeCategory] || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
          ) : (
            <TextField fullWidth size="small" type={field === "studentsParticipated" ? "number" : "text"}
              placeholder={label} value={row[field]}
              onChange={(e) => handlePrePlanningChange(row.id, field, e.target.value)} />
          )}
        </td>
      ))}
      <td style={{ padding: "6px", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <Button size="small" color="error" onClick={() => removePrePlanningRow(row.id)}>Remove</Button>
      </td>
    </tr>
  );

  const renderPostTableRow = (row) => (
    <tr key={row.id}>
      {[
        ["monthWeek",                  "Month / Week"],
        ["className",                  "Class"],
        ["themeCategory",              "Theme Category"],
        ["activity",                   "Activity Name"],
        ["resourcePersons",            "Resource Person"],
        ["studentsParticipated",       "Students Participated"], 
             
      ].map(([field, label]) => (
        <td key={field} style={{
          padding: "6px", border: "1px solid #dbeafe",
          minWidth: field === "className" ? 110 : field === "studentsParticipated" ? 140 : 180,
        }}>
          {field === "className" ? (
            <ClassDropdown value={row[field]} onChange={(v) => handlePostPlanningChange(row.id, field, v)} />
          ) : field === "themeCategory" ? (
            <TextField select fullWidth size="small" value={row[field]} onChange={(e) => handlePostPlanningChange(row.id, field, e.target.value)}>
              <MenuItem value="">Select Theme Category</MenuItem>
              {SAKSHAM_THEME_CATEGORIES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          ) : field === "activity" ? (
            <TextField select fullWidth size="small" value={row[field]} onChange={(e) => handlePostPlanningChange(row.id, field, e.target.value)} disabled={!row.themeCategory}>
              <MenuItem value="">Select Activity</MenuItem>
              {(SAKSHAM_ACTIVITIES_BY_THEME[row.themeCategory] || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
          ) : (
            <TextField fullWidth size="small" type={field === "studentsParticipated" ? "number" : "text"}
              placeholder={label} value={row[field]}
              onChange={(e) => handlePostPlanningChange(row.id, field, e.target.value)} />
          )}
        </td>
      ))}
      {/* Photos / Report column */}
      <td style={{ padding: "6px", border: "1px solid #dbeafe", minWidth: 220 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Button size="small" variant="outlined" component="label">
            Upload Photos
            <input hidden multiple accept="image/*" type="file"
              onChange={(e) => handlePostFileUpload(row.id, "photos", e.target.files)} />
          </Button>
          <Typography sx={{ fontSize: 11, color: "#475569" }}>
            {row.photos?.length ? `${row.photos.length} photo(s): ${row.photos.join(", ")}` : "No photos uploaded"}
          </Typography>
          <Button size="small" variant="outlined" component="label">
            Upload Report
            <input hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" type="file"
              onChange={(e) => handlePostFileUpload(row.id, "reportFile", e.target.files)} />
          </Button>
          <Typography sx={{ fontSize: 11, color: "#475569" }}>
            {row.reportFile || "No report uploaded"}
          </Typography>
        </Box>
      </td>
      <td style={{ padding: "6px", border: "1px solid #dbeafe", textAlign: "center" }}>
        <Button size="small" color="error" onClick={() => removePostPlanningRow(row.id)}>Remove</Button>
      </td>
    </tr>
  );

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, color: "#1e3a5f", fontSize: 15, mb: 2 }}>
        Saksham Saturday Planning Report
      </Typography>

      {/* ══════════════════════════════════════════════════════
          ① ACADEMIC CALENDAR — placed first, above all tables
         ══════════════════════════════════════════════════════ */}
      <AcademicCalendarWidget
        calendarMonth={calendarMonth}  setCalendarMonth={setCalendarMonth}
        calendarYear={calendarYear}    setCalendarYear={setCalendarYear}
        selectedDate={selectedDate}    setSelectedDate={setSelectedDate}
      />

      {/* Selected date hint banner */}
      {selectedDate && (
        <Alert
          severity="info"
          icon={false}
          sx={{ mb: 2, py: 0.75, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2 }}
        >
          <Typography sx={{ fontSize: 12, color: "#1e40af" }}>
            📌 <strong>{selectedWeekLabel}</strong> is selected — click <em>"Add Row"</em> in either table below to start a new entry pre-filled with this week label.
          </Typography>
        </Alert>
      )}

      {/* ══════════════════════════════════════════════════════
          ② PRE-ACTIVITY PLANNING TABLE
         ══════════════════════════════════════════════════════ */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #cbd5e1", borderRadius: 2, mb: 2, background: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#334155", fontSize: 13 }}>Pre-Activity Planning</Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.25 }}>
              Class dropdown: 6 / 7 / 8 &nbsp;·&nbsp; Select a Saturday above then click Add Row to pre-fill the week
            </Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={addPrePlanningRow}>+ Add Row</Button>
        </Box>
        {renderEditableTable(
          ["Month / Week", "Class", "Theme Category", "Activity Name", "Resource Person", "Students Participated",  ""],
          prePlanningRows,
          renderPreTableRow
        )}
      </Paper>

      {/* ══════════════════════════════════════════════════════
          ③ POST-ACTIVITY REPORT TABLE
         ══════════════════════════════════════════════════════ */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #bfdbfe", borderRadius: 2, mb: 2, background: "#f8fbff" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#1d4ed8", fontSize: 13 }}>Post-Activity Report</Typography>
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.25 }}>
              Uses the same Academic Calendar above — select a Saturday and Add Row to pre-fill
            </Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={addPostPlanningRow}>+ Add Row</Button>
        </Box>

        {renderEditableTable(
          ["Month / Week", "Class", "Theme Category", "Activity Name", "Resource Person", "Students Participated",           
           
           "Photos / Report", ""],
          postPlanningRows,
          renderPostTableRow
        )}
      </Paper>

      {/* ══════════════════════════════════════════════════════
          ④ GAP ANALYSIS
         ══════════════════════════════════════════════════════ */}
      <Paper elevation={0} sx={{ p: 2, border: "1px solid #fed7aa", borderRadius: 2, background: "#fff7ed" }}>
        <Typography sx={{ fontWeight: 700, color: "#c2410c", fontSize: 13, mb: 1.5 }}>Gap Analysis</Typography>
        {renderEditableTable(
          ["Month / Week", "Class", "Theme Category", "Activity Name", "Gap Identified", "Status", "Action Point"],
          gapRows,
          (row) => (
            <tr key={row.id}>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12 }}>{row.monthWeek}</td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12 }}>{row.className}</td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12 }}>{row.themeCategory}</td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12, fontWeight: 600 }}>{row.activity}</td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12, color: row.gap === "No gap" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{row.gap}</td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa" }}>
                <Chip label={row.status} size="small" sx={{ background: row.status === "Complete" ? "#dcfce7" : "#fee2e2", color: row.status === "Complete" ? "#16a34a" : "#dc2626", fontWeight: 700 }} />
              </td>
              <td style={{ padding: "8px", border: "1px solid #fed7aa", fontSize: 12 }}>{row.action}</td>
            </tr>
          )
        )}
      </Paper>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN ATTENDANCE COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const Attendance = ({
  staffAttendanceRows, setStaffAttendanceRows,
  teachingAttMonth,    setTeachingAttMonth,
  nonTeachingAttMonth, setNonTeachingAttMonth,
  studentAttendanceData,  setStudentAttendanceData,
  studentAttendanceMonth, setStudentAttendanceMonth,
}) => {
  const teachingCount    = staffAttendanceRows.filter((r) => r.staffType === "Teaching"     && r.month === teachingAttMonth).length;
  const nonTeachingCount = staffAttendanceRows.filter((r) => r.staffType === "Non-Teaching" && r.month === nonTeachingAttMonth).length;

  return (
    <Box>
      <Box sx={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 3, px: 3, py: 2.5, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: 30 }}>📅</Typography>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Attendance Management</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 12 }}>
            Staff &amp; Student monthly attendance — Excel import or manual entry
          </Typography>
        </Box>
      </Box>

      {/* Holiday List */}
      <Accordion defaultExpanded={false} sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "#fff", minHeight: 48 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>🗓️ Assam Government Holiday List (2024–2026)</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}><AssamHolidayList /></AccordionDetails>
      </Accordion>

      {/* Saksham Saturday Planning Report */}
      <Accordion defaultExpanded sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(135deg, #92400e, #f97316)", color: "#fff", minHeight: 48 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Saksham Saturday - Pre-Activity Planning, Post-Activity Report &amp; Gap Analysis</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
          <SakshamSaturdayReport />
        </AccordionDetails>
      </Accordion>

      {/* Teaching Staff */}
      <Accordion defaultExpanded sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", minHeight: 48 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>👨‍🏫 Teaching Staff — Monthly Attendance</Typography>
            {teachingCount > 0 && <Chip label={`${teachingCount} records`} size="small" sx={{ background: "#ffffff33", color: "#fff", fontWeight: 700, fontSize: 11 }} />}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
          <StaffAttendanceSection
            staffType="Teaching"
            rows={staffAttendanceRows} setRows={setStaffAttendanceRows}
            activeMonth={teachingAttMonth} setActiveMonth={setTeachingAttMonth}
          />
        </AccordionDetails>
      </Accordion>

      {/* Non-Teaching Staff */}
      <Accordion defaultExpanded sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(to right, #7c3aed, #a78bfa)", color: "#fff", minHeight: 48 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>🧹 Non-Teaching Staff — Monthly Attendance</Typography>
            {nonTeachingCount > 0 && <Chip label={`${nonTeachingCount} records`} size="small" sx={{ background: "#ffffff33", color: "#fff", fontWeight: 700, fontSize: 11 }} />}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
          <StaffAttendanceSection
            staffType="Non-Teaching"
            rows={staffAttendanceRows} setRows={setStaffAttendanceRows}
            activeMonth={nonTeachingAttMonth} setActiveMonth={setNonTeachingAttMonth}
          />
        </AccordionDetails>
      </Accordion>

      {/* Annual Overview */}
      <Accordion sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(to right, #374151, #6b7280)", color: "#fff", minHeight: 48 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>📊 Annual Staff Attendance Overview</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
          <AnnualStaffOverview staffAttendanceRows={staffAttendanceRows} />
        </AccordionDetails>
      </Accordion>

      {/* Student Attendance */}
      <Accordion defaultExpanded sx={{ mb: 2, borderRadius: "10px !important", overflow: "hidden", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)", color: "#fff", minHeight: 48 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>🎓 Student Attendance &amp; Performance</Typography>
            {studentAttendanceData.length > 0 && <Chip label={`${studentAttendanceData.length} records`} size="small" sx={{ background: "#ffffff33", color: "#fff", fontWeight: 700, fontSize: 11 }} />}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, background: "#f8fafc" }}>
          <StudentAttendanceSection
            studentAttendanceData={studentAttendanceData}
            setStudentAttendanceData={setStudentAttendanceData}
            studentAttendanceMonth={studentAttendanceMonth}
            setStudentAttendanceMonth={setStudentAttendanceMonth}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Attendance;