import React, { useState, useEffect } from "react";
import SchoolDetails from "./Steps/SchoolDetails";
import InfrastructureDetails from "./Steps/Infrastructure";
import ConstructionDetails from "./Steps/Construction";
import ExtraCurricular from "./Steps/ExtraCurricular";
import OperationalCost from "./Steps/OperationalCost";
import FinancialProcurement from "./Steps/FinancialProcurement";
import Attendance from "./Steps/Attendance";
import {
  emrsBasicFields,
  emrsLocationFields,
  emrsInfrastructureFields,
  boysHostelFields,
  girlsHostelFields,
  enrollmentFields,
  academicFields,
  achievementLevels,
  teachingStaffSummaryFields,
  nonTeachingStaffDetailFields,
  qualificationOptions,
  tetQualificationOptions,
  professionalQualificationOptions,
  operationalCostFields,
} from "./Steps/constants/emrsfields";
import StaffAttendance from "./Steps/StaffDetails";
import HostelDetails from "./Steps/Hostel";
import Enrollment from "./Steps/Enrollment";
import HospitalizationSection from "./Steps/Hospitalization";
import { CircularProgress } from "@mui/material";
import * as exifr from "exifr";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import EMRSImageUpload from "./Steps/EMRSImageUpload";
import EMRSFormPreview from "./Steps/EMRSFormPreview";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  Chip,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Alert,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Badge,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import {
  sanitizeConstructionComponents,
  toSafeNumber,
  toOptionalNumber,
} from "./utils/emrsPayloadUtils";

const thStyle = {
  border: "1px solid #e0e0e0",
  padding: "8px",
  textAlign: "left",
  fontWeight: 600,
};
const tdStyle = { border: "1px solid #e0e0e0", padding: "8px" };

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const ASSAM_HOLIDAYS = [
  { date: "2024-01-26", name: "Republic Day", type: "National" },
  { date: "2024-02-14", name: "Magh Bihu / Saraswati Puja", type: "State" },
  { date: "2024-03-25", name: "Holi", type: "National" },
  { date: "2024-03-29", name: "Good Friday", type: "National" },
  { date: "2024-04-01", name: "Easter Monday", type: "State" },
  { date: "2024-04-11", name: "Id-Ul-Fitr (Eid)", type: "National" },
  { date: "2024-04-14", name: "Bohag Bihu / Dr. Ambedkar Jayanti", type: "State" },
  { date: "2024-04-15", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2024-04-16", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2024-04-17", name: "Bohag Bihu / Good Friday (alt)", type: "State" },
  { date: "2024-04-21", name: "Easter", type: "State" },
  { date: "2024-05-01", name: "May Day / Labour Day", type: "State" },
  { date: "2024-05-23", name: "Buddha Purnima", type: "National" },
  { date: "2024-06-17", name: "Id-Ul-Zuha (Bakrid)", type: "National" },
  { date: "2024-07-17", name: "Muharram", type: "National" },
  { date: "2024-08-15", name: "Independence Day", type: "National" },
  { date: "2024-08-19", name: "Janmashtami", type: "National" },
  { date: "2024-09-16", name: "Milad-Un-Nabi", type: "National" },
  { date: "2024-10-02", name: "Gandhi Jayanti / Navami", type: "National" },
  { date: "2024-10-12", name: "Dussehra (Vijaya Dashami)", type: "National" },
  { date: "2024-10-13", name: "Kati Bihu", type: "State" },
  { date: "2024-10-31", name: "Diwali / Naraka Chaturdashi", type: "National" },
  { date: "2024-11-01", name: "Diwali Holiday", type: "State" },
  { date: "2024-11-15", name: "Guru Nanak Jayanti", type: "National" },
  { date: "2024-12-25", name: "Christmas Day", type: "National" },
  { date: "2025-01-14", name: "Magh Bihu (Bhogali Bihu)", type: "State" },
  { date: "2025-01-15", name: "Magh Bihu Holiday", type: "State" },
  { date: "2025-01-26", name: "Republic Day", type: "National" },
  { date: "2025-02-26", name: "Maha Shivaratri", type: "National" },
  { date: "2025-03-14", name: "Holi", type: "National" },
  { date: "2025-03-30", name: "Eid-ul-Fitr", type: "National" },
  { date: "2025-04-14", name: "Bohag Bihu / Dr. Ambedkar Jayanti", type: "State" },
  { date: "2025-04-15", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2025-04-16", name: "Bohag Bihu Holiday", type: "State" },
  { date: "2025-04-18", name: "Good Friday", type: "National" },
  { date: "2025-05-01", name: "May Day / Labour Day", type: "State" },
  { date: "2025-05-12", name: "Buddha Purnima", type: "National" },
  { date: "2025-06-07", name: "Eid-ul-Adha (Bakrid)", type: "National" },
  { date: "2025-07-06", name: "Muharram", type: "National" },
  { date: "2025-08-15", name: "Independence Day", type: "National" },
  { date: "2025-08-16", name: "Janmashtami", type: "National" },
  { date: "2025-09-05", name: "Milad-Un-Nabi", type: "National" },
  { date: "2025-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2025-10-02", name: "Kati Bihu", type: "State" },
  { date: "2025-10-20", name: "Dussehra (Vijaya Dashami)", type: "National" },
  { date: "2025-10-20", name: "Diwali", type: "National" },
  { date: "2025-11-05", name: "Guru Nanak Jayanti", type: "National" },
  { date: "2025-12-25", name: "Christmas Day", type: "National" },
  { date: "2026-01-14", name: "Magh Bihu (Bhogali Bihu)", type: "State" },
  { date: "2026-01-26", name: "Republic Day", type: "National" },
  { date: "2026-03-20", name: "Eid-ul-Fitr", type: "National" },
  { date: "2026-04-03", name: "Good Friday", type: "National" },
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
  return ASSAM_HOLIDAYS.filter((h) => {
    const d = new Date(h.date);
    return d.getMonth() === monthIndex;
  });
};

/* ─────────────────────────────────────────────────────────────────────────────
   ASSAM HOLIDAY LIST COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const AssamHolidayList = () => {
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const filtered = ASSAM_HOLIDAYS.filter((h) => {
    const d = new Date(h.date);
    const mName = MONTHS[d.getMonth()];
    const monthOk = filterMonth === "All" || mName === filterMonth;
    const typeOk = filterType === "All" || h.type === filterType;
    return monthOk && typeOk;
  });

  const typeColor = (type) =>
    type === "National"
      ? { bg: "#dbeafe", color: "#1d4ed8" }
      : { bg: "#dcfce7", color: "#16a34a" };

  return (
    <Box sx={{ border: "1px solid #bfdbfe", borderRadius: 3, overflow: "hidden", mb: 3 }}>
      <Box sx={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", px: 3, py: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: 20 }}>🗓️</Typography>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Assam Government Holiday List</Typography>
          <Typography sx={{ color: "#bfdbfe", fontSize: 12 }}>Academic Year 2024–25 &amp; 2025–26 (Official Gazette)</Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Chip label={`${ASSAM_HOLIDAYS.length} Holidays`} sx={{ background: "#ffffff22", color: "#fff", fontWeight: 700, fontSize: 12 }} />
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 1.5, background: "#f0f7ff", display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #bfdbfe" }}>
        <TextField select size="small" label="Filter by Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="All">All Months</MenuItem>
          {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Filter by Type" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="National">National</MenuItem>
          <MenuItem value="State">State (Assam)</MenuItem>
        </TextField>
        <Typography sx={{ fontSize: 12, color: "#64748b", ml: "auto" }}>Showing <strong>{filtered.length}</strong> holidays</Typography>
      </Box>
      <Box sx={{ overflowX: "auto", maxHeight: 360, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              {["#", "Date", "Day", "Holiday Name", "Type"].map((h) => (
                <th key={h} style={{ background: "#e0f2fe", color: "#0c4a6e", padding: "8px 12px", textAlign: "left", fontSize: 12, fontWeight: 700, border: "1px solid #bae6fd", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((h, i) => {
              const d = new Date(h.date);
              const day = d.toLocaleDateString("en-IN", { weekday: "long" });
              const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
              const tc = typeColor(h.type);
              return (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f0f9ff" : "#fff" }}>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8" }}>{i + 1}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#1e40af", whiteSpace: "nowrap" }}>{dateStr}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 12, color: "#475569" }}>{day}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{h.name}</td>
                  <td style={{ padding: "6px 12px", border: "1px solid #e2e8f0" }}>
                    <Chip label={h.type === "National" ? "🇮🇳 National" : "🏛️ State"} size="small" sx={{ background: tc.bg, color: tc.color, fontWeight: 700, fontSize: 11 }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
      <Box sx={{ px: 3, py: 1.5, background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: 12, color: "#64748b" }}>🇮🇳 National Holidays: <strong style={{ color: "#1d4ed8" }}>{ASSAM_HOLIDAYS.filter((h) => h.type === "National").length}</strong></Typography>
        <Typography sx={{ fontSize: 12, color: "#64748b" }}>🏛️ State (Assam) Holidays: <strong style={{ color: "#16a34a" }}>{ASSAM_HOLIDAYS.filter((h) => h.type === "State").length}</strong></Typography>
        <Typography sx={{ fontSize: 12, color: "#64748b", ml: "auto", fontStyle: "italic" }}>* Holiday dates subject to official gazette notification</Typography>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER: compute attendance % from working days + leaves
───────────────────────────────────────────────────────────────────────────── */
const computeTeacherRow = (row) => {
  const wd = parseFloat(row.workingDays) || 0;
  const totalLeave =
    (parseFloat(row.casualLeave) || 0) +
    (parseFloat(row.earnedLeave) || 0) +
    (parseFloat(row.medicalLeave) || 0) +
    (parseFloat(row.maternityLeave) || 0) +
    (parseFloat(row.paternityLeave) || 0);
  const daysPresent = wd > 0 ? Math.max(0, wd - totalLeave) : 0;
  const daysAbsent = wd > 0 ? Math.min(totalLeave, wd) : 0;
  const percentage = wd > 0 ? parseFloat(((daysPresent / wd) * 100).toFixed(1)) : 0;
  return { ...row, daysPresent, daysAbsent, percentage };
};

const blankTeacherRow = () => ({
  staffType: "Teaching", // "Teaching" | "Non-Teaching"
  post: "",
  name: "",
  month: MONTHS[new Date().getMonth()],
  workingDays: "",
  casualLeave: "",
  earnedLeave: "",
  medicalLeave: "",
  maternityLeave: "",
  paternityLeave: "",
  daysPresent: 0,
  daysAbsent: 0,
  percentage: 0,
});

/* ─────────────────────────────────────────────────────────────────────────────
   TEACHER ATTENDANCE SECTION
   - Completely independent from Staff Details
   - Excel upload auto-fills the table
   - Manual add row
   - Auto-calculates Present, Absent, % per teacher
───────────────────────────────────────────────────────────────────────────── */
const TeacherAttendanceSection = ({
  title,
  staffType,
  rows,
  setRows,
  activeMonth,
  setActiveMonth,
}) => {
  const [excelError, setExcelError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newRow, setNewRow] = useState({ ...blankTeacherRow(), staffType, month: activeMonth });

  // sync newRow month when activeMonth changes
  useEffect(() => {
    setNewRow((p) => ({ ...p, month: activeMonth }));
  }, [activeMonth]);

  const filteredRows = rows.filter((r) => r.staffType === staffType && r.month === activeMonth);

  /* ── Field change handler with auto-compute ── */
  const handleFieldChange = (idx, field, value) => {
    setRows((prev) => {
      // idx here is index in the *full* rows array
      const updated = [...prev];
      updated[idx] = computeTeacherRow({ ...updated[idx], [field]: value });
      return updated;
    });
  };

  /* ── Find real index in full rows array ── */
  const fullIndexOf = (filteredIdx) => {
    let count = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].staffType === staffType && rows[i].month === activeMonth) {
        count++;
        if (count === filteredIdx) return i;
      }
    }
    return -1;
  };

  /* ── Add manual row ── */
  const addManualRow = () => {
    if (!newRow.name && !newRow.post) return;
    const computed = computeTeacherRow({ ...newRow, staffType, month: activeMonth });
    setRows((prev) => {
      // check duplicate (same name + month + staffType)
      const idx = prev.findIndex(
        (r) => r.name === computed.name && r.month === computed.month && r.staffType === computed.staffType
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = computed;
        return updated;
      }
      return [...prev, computed];
    });
    setNewRow({ ...blankTeacherRow(), staffType, month: activeMonth });
  };

  /* ── Remove row ── */
  const removeRow = (filteredIdx) => {
    const realIdx = fullIndexOf(filteredIdx);
    if (realIdx === -1) return;
    setRows((prev) => prev.filter((_, i) => i !== realIdx));
  };

  /* ── Download Excel template ── */
  const downloadTemplate = () => {
    const headers = [["Post", "Name", "Month", "Working Days", "Casual Leave", "Earned Leave", "Medical Leave", "Maternity Leave", "Paternity Leave"]];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers);
    ws["!cols"] = [16, 24, 12, 14, 14, 14, 14, 16, 16].map((w) => ({ wch: w }));
    XLSX.utils.book_append_sheet(wb, ws, `${staffType} Attendance`);
    XLSX.writeFile(wb, `${staffType.replace(/\s/g, "_")}_Attendance_Template.xlsx`);
  };

  /* ── Export current month data ── */
  const exportData = () => {
    if (filteredRows.length === 0) { toast.error("No data to export."); return; }
    const exportRows = filteredRows.map((r) => ({
      "Post": r.post,
      "Name": r.name,
      "Month": r.month,
      "Working Days": r.workingDays,
      "Casual Leave": r.casualLeave,
      "Earned Leave": r.earnedLeave,
      "Medical Leave": r.medicalLeave,
      "Maternity Leave": r.maternityLeave,
      "Paternity Leave": r.paternityLeave,
      "Days Present": r.daysPresent,
      "Days Absent": r.daysAbsent,
      "Attendance %": r.percentage,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${staffType.replace(/\s/g, "_")}_${activeMonth}_Attendance.xlsx`);
  };

  /* ── Handle Excel upload — auto-fills table ── */
  const handleExcelUpload = (file) => {
    if (!file) return;
    setExcelError("");
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
       const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
//   reader.readAsArrayBuffer(file);
 

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!raw || raw.length === 0) {
          setExcelError("The uploaded file is empty.");
          setUploading(false);
          return;
        }

        // Normalize header keys
        const normalise = (obj) => {
          const out = {};
          Object.entries(obj).forEach(([k, v]) => {
            out[k.toLowerCase().replace(/[\s_\-]/g, "")] = v;
          });
          return out;
        };

        const parsed = raw.map((row) => {
          const r = normalise(row);
          const base = {
            staffType,
            post: String(r["post"] ?? r["designation"] ?? ""),
            name: String(r["name"] ?? r["staffname"] ?? r["teachername"] ?? ""),
            month: String(r["month"] ?? activeMonth),
            workingDays: r["workingdays"] ?? r["totaldays"] ?? "",
            casualLeave: r["casualleave"] ?? r["cl"] ?? "",
            earnedLeave: r["earnedleave"] ?? r["el"] ?? "",
            medicalLeave: r["medicalleave"] ?? r["ml"] ?? "",
            maternityLeave: r["maternityleave"] ?? r["mat"] ?? "",
            paternityLeave: r["paternityleave"] ?? r["pat"] ?? "",
          };
          return computeTeacherRow(base);
        });

        setRows((prev) => {
          const merged = [...prev.filter((r) => !(r.staffType === staffType && r.month === activeMonth))];
          parsed.forEach((incoming) => {
            const idx = merged.findIndex(
              (x) => x.name === incoming.name && x.month === incoming.month && x.staffType === staffType
            );
            if (idx !== -1) merged[idx] = incoming;
            else merged.push(incoming);
          });
          return merged;
        });

        toast.success(`✅ Imported ${parsed.length} ${staffType} attendance records.`);
      } catch (err) {
        setExcelError("Failed to parse file: " + err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setExcelError("Could not read the file. Please try again.");
      setUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  // Stats
  const totalStaff = filteredRows.length;
  const avgPct = totalStaff > 0
    ? (filteredRows.reduce((s, r) => s + r.percentage, 0) / totalStaff).toFixed(1)
    : null;
  const above75 = filteredRows.filter((r) => r.percentage >= 75).length;
  const below75 = filteredRows.filter((r) => r.percentage < 75 && r.percentage > 0).length;

  const pctColor = (pct) => {
    if (pct >= 90) return { color: "#16a34a", bg: "#dcfce7" };
    if (pct >= 75) return { color: "#0f766e", bg: "#ccfbf1" };
    if (pct >= 50) return { color: "#d97706", bg: "#fef3c7" };
    return { color: "#dc2626", bg: "#fee2e2" };
  };

  const leaveFields = [
    { key: "casualLeave", label: "CL", full: "Casual Leave" },
    { key: "earnedLeave", label: "EL", full: "Earned Leave" },
    { key: "medicalLeave", label: "ML", full: "Medical Leave" },
    { key: "maternityLeave", label: "Mat", full: "Maternity Leave" },
    { key: "paternityLeave", label: "Pat", full: "Paternity Leave" },
  ];

  const monthHolidays = getHolidaysForMonth(activeMonth);
  const headerColor = staffType === "Teaching"
    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
    : "linear-gradient(135deg, #7c3aed, #a78bfa)";

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box sx={{ background: headerColor, borderRadius: 2, px: 3, py: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
            {staffType === "Teaching" ? "👨‍🏫" : "🧹"} {title}
          </Typography>
          <Typography sx={{ color: "#e0f2fe", fontSize: 12 }}>
            Upload Excel or add individually — auto-calculates attendance %
          </Typography>
        </Box>
        {avgPct && (
          <Chip label={`Avg: ${avgPct}%`} sx={{ background: "#ffffff22", color: "#fff", fontWeight: 800, fontSize: 13 }} />
        )}
      </Box>

      {/* Month Selector */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, alignItems: "center" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Month:</Typography>
        {MONTHS.map((m) => (
          <Chip
            key={m}
            label={m}
            size="small"
            onClick={() => setActiveMonth(m)}
            color={activeMonth === m ? "primary" : "default"}
            variant={activeMonth === m ? "filled" : "outlined"}
            sx={{ fontWeight: activeMonth === m ? 700 : 400, cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* Holidays for month */}
      {monthHolidays.length > 0 && (
        <Alert severity="info" sx={{ mb: 2, py: 0.5, "& .MuiAlert-message": { width: "100%" } }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}>🗓️ Assam Govt Holidays in {activeMonth}:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {monthHolidays.map((h, i) => (
              <Chip key={i} label={`${new Date(h.date).getDate()} — ${h.name}`} size="small"
                sx={{ fontSize: 11, background: h.type === "National" ? "#dbeafe" : "#dcfce7", color: h.type === "National" ? "#1d4ed8" : "#16a34a", fontWeight: 600 }} />
            ))}
          </Box>
        </Alert>
      )}

      {/* Stats */}
      {totalStaff > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            { label: "Total Staff", val: totalStaff, color: "#1976d2", icon: "👤" },
            { label: "Avg Attendance", val: `${avgPct}%`, color: "#0f766e", icon: "📊" },
            { label: "≥ 75% (Good)", val: above75, color: "#16a34a", icon: "🟢" },
            { label: "< 75% (Low)", val: below75, color: "#dc2626", icon: "🔴" },
          ].map(({ label, val, color, icon }) => (
            <Grid item xs={6} sm={3} key={label}>
              <Paper elevation={0} sx={{ p: 1.5, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Typography sx={{ fontSize: 18 }}>{icon}</Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color }}>{val}</Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b" }}>{label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Excel Controls */}
      <Box sx={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 2, p: 2, mb: 2, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#0369a1", mr: 1 }}>📁 Excel Import / Export</Typography>
        <Button variant="outlined" size="small" sx={{ borderColor: "#0369a1", color: "#0369a1", fontWeight: 600, fontSize: 12 }} onClick={downloadTemplate}>
          ⬇ Download Template
        </Button>
        <Button variant="contained" size="small" component="label" disabled={uploading}
          sx={{ background: "#0369a1", "&:hover": { background: "#075985" }, fontWeight: 600, fontSize: 12 }}>
          {uploading ? "Importing…" : "📤 Import Excel"}
          <input type="file" hidden accept=".xlsx,.xls" onChange={(e) => handleExcelUpload(e.target.files[0])} />
        </Button>
        {filteredRows.length > 0 && (
          <Button variant="outlined" size="small" sx={{ borderColor: "#0369a1", color: "#0369a1", fontWeight: 600, fontSize: 12 }} onClick={exportData}>
            📥 Export {activeMonth}
          </Button>
        )}
        <Typography sx={{ fontSize: 11, color: "#64748b", ml: "auto", fontStyle: "italic" }}>
          Columns: Post, Name, Month, Working Days, Casual Leave, Earned Leave, Medical Leave, Maternity Leave, Paternity Leave
        </Typography>
      </Box>
      {excelError && <Alert severity="error" sx={{ mb: 2 }}>{excelError}</Alert>}

      {/* Manual Add Row */}
      <Box sx={{ border: "1px dashed #94a3b8", borderRadius: 2, p: 2, mb: 2, background: "#fafafa" }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151", mb: 1.5 }}>✏️ Add Staff Manually</Typography>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={2}>
            <TextField fullWidth size="small" label="Post / Designation" value={newRow.post}
              onChange={(e) => setNewRow((p) => ({ ...p, post: e.target.value }))} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth size="small" label="Staff Name" value={newRow.name}
              onChange={(e) => setNewRow((p) => ({ ...p, name: e.target.value }))} />
          </Grid>
          <Grid item xs={6} sm={1}>
            <TextField fullWidth size="small" label="Working Days" type="number" inputProps={{ min: 0, max: 31 }}
              value={newRow.workingDays} onChange={(e) => setNewRow((p) => computeTeacherRow({ ...p, workingDays: e.target.value }))} />
          </Grid>
          {leaveFields.map(({ key, label, full }) => (
            <Grid item xs={4} sm={1} key={key}>
              <Tooltip title={full}>
                <TextField fullWidth size="small" label={label} type="number" inputProps={{ min: 0 }}
                  value={newRow[key]} onChange={(e) => setNewRow((p) => computeTeacherRow({ ...p, [key]: e.target.value }))} />
              </Tooltip>
            </Grid>
          ))}
          <Grid item xs={6} sm={1}>
            <Button fullWidth variant="contained" size="small" onClick={addManualRow}
              sx={{ background: "#1976d2", "&:hover": { background: "#1565c0" }, height: 40 }}>
              + Add
            </Button>
          </Grid>
        </Grid>
        {/* Live preview of computed values */}
        {(newRow.workingDays || newRow.casualLeave) && (
          <Box sx={{ mt: 1.5, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 12, color: "#16a34a" }}>✅ Present: <strong>{newRow.daysPresent}</strong></Typography>
            <Typography sx={{ fontSize: 12, color: "#dc2626" }}>❌ Absent: <strong>{newRow.daysAbsent}</strong></Typography>
            <Typography sx={{ fontSize: 12, color: "#1976d2" }}>📊 Attendance: <strong>{newRow.percentage}%</strong></Typography>
          </Box>
        )}
      </Box>

      {/* Attendance Table */}
      {filteredRows.length > 0 ? (
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "Post", "Name", "Working Days", "CL", "EL", "ML", "Mat", "Pat", "Days Present", "Days Absent", "Attendance %", "Status", "Action"].map((h) => (
                  <th key={h} style={{ background: staffType === "Teaching" ? "#1976d2" : "#7c3aed", color: "#fff", padding: "8px 6px", fontSize: 11, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)", whiteSpace: "nowrap", textAlign: "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, filteredIdx) => {
                const realIdx = fullIndexOf(filteredIdx);
                const tc = pctColor(r.percentage);
                return (
                  <tr key={filteredIdx} style={{ backgroundColor: filteredIdx % 2 === 0 ? "#f8fafc" : "#fff" }}>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: 12 }}>{filteredIdx + 1}</td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0" }}>
                      <TextField size="small" value={r.post} sx={{ minWidth: 110 }}
                        onChange={(e) => handleFieldChange(realIdx, "post", e.target.value)}
                        inputProps={{ style: { fontSize: 12 } }} />
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0" }}>
                      <TextField size="small" value={r.name} sx={{ minWidth: 130 }}
                        onChange={(e) => handleFieldChange(realIdx, "name", e.target.value)}
                        inputProps={{ style: { fontSize: 12 } }} />
                    </td>
                    <td style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                      <TextField size="small" type="number" value={r.workingDays} sx={{ minWidth: 70 }}
                        inputProps={{ min: 0, max: 31, style: { fontSize: 12, textAlign: "center" } }}
                        onChange={(e) => handleFieldChange(realIdx, "workingDays", e.target.value)} />
                    </td>
                    {leaveFields.map(({ key }) => (
                      <td key={key} style={{ padding: "4px 6px", border: "1px solid #e2e8f0" }}>
                        <TextField size="small" type="number" value={r[key]} sx={{ minWidth: 58 }}
                          inputProps={{ min: 0, style: { fontSize: 12, textAlign: "center" } }}
                          onChange={(e) => handleFieldChange(realIdx, key, e.target.value)} />
                      </td>
                    ))}
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                      <Chip label={r.daysPresent} color="success" size="small" sx={{ fontWeight: 700, minWidth: 36 }} />
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                      <Chip label={r.daysAbsent} color={r.daysAbsent > 0 ? "error" : "success"} size="small" sx={{ fontWeight: 700, minWidth: 36 }} />
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                      <Box sx={{ px: 1.5, py: 0.3, borderRadius: 10, background: tc.bg, color: tc.color, fontSize: 13, fontWeight: 800, display: "inline-block", minWidth: 52, textAlign: "center" }}>
                        {r.percentage}%
                      </Box>
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: 11, whiteSpace: "nowrap" }}>
                      {r.percentage >= 90 ? "🟢 Excellent" : r.percentage >= 75 ? "🔵 Good" : r.percentage >= 50 ? "🟡 Average" : "🔴 Low"}
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                      <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1, py: 0.2, fontSize: 11 }} onClick={() => removeRow(filteredIdx)}>✕</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 5, border: "2px dashed #e2e8f0", borderRadius: 3, color: "#94a3b8" }}>
          <Typography sx={{ fontSize: 32, mb: 1 }}>📋</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>No attendance data for {activeMonth}</Typography>
          <Typography sx={{ fontSize: 12, mt: 0.5 }}>Import an Excel file or add staff manually above.</Typography>
        </Box>
      )}

      {/* Summary Cards */}
      {filteredRows.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151", mb: 1.5 }}>Individual Summary — {activeMonth}</Typography>
          <Grid container spacing={2}>
            {filteredRows.map((r, i) => {
              const tc = pctColor(r.percentage);
              return (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2, borderLeft: `4px solid ${tc.color}` }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2" }}>{r.post || "—"}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{r.name || "—"}</Typography>
                    <Divider sx={{ my: 0.5 }} />
                    <Typography sx={{ fontSize: 12 }}>Working Days: <strong>{r.workingDays || "—"}</strong></Typography>
                    <Typography sx={{ fontSize: 12 }}>Present: <strong style={{ color: "#16a34a" }}>{r.daysPresent}</strong> | Absent: <strong style={{ color: "#dc2626" }}>{r.daysAbsent}</strong></Typography>
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${Math.min(r.percentage, 100)}%`, background: tc.color, borderRadius: 3, transition: "width 0.3s" }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: tc.color, minWidth: 44 }}>{r.percentage}%</Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   STUDENT ATTENDANCE SECTION (CLASS-WISE with class average %)
───────────────────────────────────────────────────────────────────────────── */
const StudentAttendanceSection = ({
  studentAttendanceData,
  setStudentAttendanceData,
  studentAttendanceMonth,
  setStudentAttendanceMonth,
  handleStudentExcelUpload,
  downloadStudentAttendanceTemplate,
  exportStudentAttendance,
  studentExcelError,
  studentExcelUploading,
}) => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [filterClass, setFilterClass] = useState("All");
  const [newRow, setNewRow] = useState({
    rollNo: "", name: "", class: "", section: "",
    month: studentAttendanceMonth, workingDays: "", daysPresent: "",
    daysAbsent: 0, percentage: 0,
  });

  // Sync month in newRow
  useEffect(() => {
    setNewRow((p) => ({ ...p, month: studentAttendanceMonth }));
  }, [studentAttendanceMonth]);

  const computeStudentRow = (row) => {
    const wd = parseFloat(row.workingDays) || 0;
    const dp = parseFloat(row.daysPresent) || 0;
    const da = wd > 0 ? Math.max(0, wd - dp) : 0;
    const pct = wd > 0 ? parseFloat(((dp / wd) * 100).toFixed(1)) : 0;
    return { ...row, daysAbsent: da, percentage: pct };
  };

  // All classes available in filtered-by-month data
  const allClasses = [...new Set(
    studentAttendanceData.filter((r) => !studentAttendanceMonth || r.month === studentAttendanceMonth).map((r) => r.class).filter(Boolean)
  )].sort();

  const filteredData = studentAttendanceData.filter((r) => {
    const monthOk = !studentAttendanceMonth || r.month === studentAttendanceMonth;
    const classOk = filterClass === "All" || r.class === filterClass;
    return monthOk && classOk;
  });

  // Class-wise averages
  const classAverages = {};
  allClasses.forEach((cls) => {
    const classRecords = studentAttendanceData.filter((r) => r.class === cls && (!studentAttendanceMonth || r.month === studentAttendanceMonth));
    if (classRecords.length > 0) {
      const avg = classRecords.reduce((s, r) => s + r.percentage, 0) / classRecords.length;
      classAverages[cls] = parseFloat(avg.toFixed(1));
    }
  });

  const addManualRow = () => {
    if (!newRow.rollNo && !newRow.name) return;
    const computed = computeStudentRow({ ...newRow, month: studentAttendanceMonth });
    setStudentAttendanceData((prev) => {
      const idx = prev.findIndex((x) => x.rollNo === computed.rollNo && x.month === computed.month);
      const updated = [...prev];
      if (idx !== -1) updated[idx] = computed;
      else updated.push(computed);
      return updated;
    });
    setNewRow({ rollNo: "", name: "", class: "", section: "", month: studentAttendanceMonth, workingDays: "", daysPresent: "", daysAbsent: 0, percentage: 0 });
  };

  const removeRow = (rollNo, month) => {
    setStudentAttendanceData((prev) => prev.filter((r) => !(r.rollNo === rollNo && r.month === month)));
  };

  const totalStudents = filteredData.length;
  const avgAttendance = totalStudents > 0
    ? (filteredData.reduce((s, r) => s + r.percentage, 0) / totalStudents).toFixed(1)
    : null;
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
      {/* Header */}
      <Box sx={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)", borderRadius: 2, px: 3, py: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🎓 Student Attendance &amp; Performance</Typography>
          <Typography sx={{ color: "#ccfbf1", fontSize: 12 }}>Class-wise monthly attendance with Excel import/export</Typography>
        </Box>
        {avgAttendance && <Chip label={`Overall Avg: ${avgAttendance}%`} sx={{ background: "#ffffff22", color: "#fff", fontWeight: 800, fontSize: 13 }} />}
      </Box>

      {/* Tab Switcher */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {[{ id: "attendance", label: "📋 Attendance" }, { id: "classwise", label: "🏫 Class-wise Summary" }, { id: "performance", label: "📊 Performance" }].map((tab) => (
          <Button key={tab.id} variant={activeTab === tab.id ? "contained" : "outlined"} size="small" onClick={() => setActiveTab(tab.id)}
            sx={{ borderRadius: 2, fontWeight: 600, ...(activeTab === tab.id ? { background: "#0f766e", "&:hover": { background: "#0d5f58" } } : { borderColor: "#0f766e", color: "#0f766e" }) }}>
            {tab.label}
          </Button>
        ))}
      </Box>

      {/* Month Selector */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, alignItems: "center" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Month:</Typography>
        {MONTHS.map((m) => (
          <Chip key={m} label={m} size="small" onClick={() => setStudentAttendanceMonth(m)}
            color={studentAttendanceMonth === m ? "success" : "default"}
            variant={studentAttendanceMonth === m ? "filled" : "outlined"}
            sx={{ fontWeight: studentAttendanceMonth === m ? 700 : 400, cursor: "pointer" }} />
        ))}
      </Box>

      {/* Holidays */}
      {monthHolidays.length > 0 && (
        <Alert severity="info" sx={{ mb: 2, fontSize: 12, py: 0.5, "& .MuiAlert-message": { width: "100%" } }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.5 }}>Holidays in {studentAttendanceMonth}:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {monthHolidays.map((h, i) => (
              <Chip key={i} label={`${new Date(h.date).getDate()} — ${h.name}`} size="small"
                sx={{ fontSize: 11, background: h.type === "National" ? "#dbeafe" : "#dcfce7", color: h.type === "National" ? "#1d4ed8" : "#16a34a", fontWeight: 600 }} />
            ))}
          </Box>
        </Alert>
      )}

      {activeTab === "attendance" && (
        <>
          {/* Stats */}
          {totalStudents > 0 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                { label: "Total Students", val: totalStudents, color: "#1976d2", icon: "👨‍🎓" },
                { label: "Avg Attendance", val: `${avgAttendance}%`, color: "#0f766e", icon: "📊" },
                { label: "≥ 75% (Good)", val: above75, color: "#16a34a", icon: "🟢" },
                { label: "< 50% (Low)", val: below50, color: "#dc2626", icon: "🔴" },
              ].map(({ label, val, color, icon }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                    <Typography sx={{ fontSize: 18 }}>{icon}</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color }}>{val}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>{label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Excel Controls */}
          <Box sx={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 2, p: 2, mb: 2, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#166534", mr: 1 }}>📁 Excel Import / Export (Class-wise)</Typography>
            <Button variant="outlined" size="small" sx={{ borderColor: "#16a34a", color: "#16a34a", fontWeight: 600, fontSize: 12 }} onClick={downloadStudentAttendanceTemplate}>
              ⬇ Download Template
            </Button>
            <Button variant="contained" size="small" component="label" disabled={studentExcelUploading}
              sx={{ background: "#16a34a", "&:hover": { background: "#14532d" }, fontWeight: 600, fontSize: 12 }}>
              {studentExcelUploading ? "Importing…" : "📤 Import Excel"}
              <input type="file" hidden accept=".xlsx,.xls" onChange={(e) => handleStudentExcelUpload(e.target.files[0])} />
            </Button>
            {filteredData.length > 0 && (
              <Button variant="outlined" size="small" sx={{ borderColor: "#0f766e", color: "#0f766e", fontWeight: 600, fontSize: 12 }} onClick={exportStudentAttendance}>
                📥 Export {studentAttendanceMonth}
              </Button>
            )}
            <Typography sx={{ fontSize: 11, color: "#64748b", ml: "auto", fontStyle: "italic" }}>
              Columns: Roll No, Name, Class, Section, Month, Working Days, Days Present
            </Typography>
          </Box>
          {studentExcelError && <Alert severity="error" sx={{ mb: 2 }}>{studentExcelError}</Alert>}

          {/* Class filter */}
          {allClasses.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, alignItems: "center" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Filter by Class:</Typography>
              {["All", ...allClasses].map((cls) => (
                <Chip key={cls} label={cls === "All" ? "All Classes" : `Class ${cls}`} size="small"
                  onClick={() => setFilterClass(cls)}
                  color={filterClass === cls ? "success" : "default"}
                  variant={filterClass === cls ? "filled" : "outlined"}
                  sx={{ fontWeight: filterClass === cls ? 700 : 400, cursor: "pointer" }} />
              ))}
            </Box>
          )}

          {/* Manual Add Row */}
          <Box sx={{ border: "1px dashed #94a3b8", borderRadius: 2, p: 2, mb: 2, background: "#fafafa" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#374151", mb: 1.5 }}>✏️ Add Student Manually</Typography>
            <Grid container spacing={1.5} alignItems="center">
              {[
                { key: "rollNo", label: "Roll No", xs: 6, sm: 2 },
                { key: "name", label: "Name", xs: 12, sm: 3 },
                { key: "class", label: "Class", xs: 4, sm: 1 },
                { key: "section", label: "Section", xs: 4, sm: 1 },
                { key: "workingDays", label: "Working Days", xs: 4, sm: 2, type: "number" },
                { key: "daysPresent", label: "Days Present", xs: 6, sm: 2, type: "number" },
              ].map(({ key, label, xs, sm, type = "text" }) => (
                <Grid item xs={xs} sm={sm} key={key}>
                  <TextField fullWidth size="small" label={label} type={type}
                    value={newRow[key]}
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
              <Box sx={{ mt: 1.5, display: "flex", gap: 2 }}>
                <Typography sx={{ fontSize: 12, color: "#dc2626" }}>❌ Absent: <strong>{newRow.daysAbsent}</strong></Typography>
                <Typography sx={{ fontSize: 12, color: "#1976d2" }}>📊 Attendance: <strong>{newRow.percentage}%</strong></Typography>
              </Box>
            )}
          </Box>

          {/* Attendance Table */}
          {filteredData.length > 0 ? (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["#", "Roll No", "Name", "Class", "Sec", "Working Days", "Present", "Absent", "Attendance %", "Status", "Action"].map((h) => (
                      <th key={h} style={{ background: "#0f766e", color: "#fff", padding: "8px 10px", fontSize: 12, fontWeight: 700, border: "1px solid #0d5f58", whiteSpace: "nowrap", textAlign: "center" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((r, i) => {
                    const tc = attColor(r.percentage);
                    return (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f0fdfa" : "#fff" }}>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center", fontSize: 12 }}>{i + 1}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", fontSize: 12, fontWeight: 600 }}>{r.rollNo}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", fontSize: 13, fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", fontSize: 12, textAlign: "center" }}>{r.class}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", fontSize: 12, textAlign: "center" }}>{r.section}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", fontSize: 12, textAlign: "center" }}>{r.workingDays}</td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center" }}>
                          <Chip label={r.daysPresent} color="success" size="small" sx={{ fontWeight: 700, minWidth: 36 }} />
                        </td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center" }}>
                          <Chip label={r.daysAbsent} color={r.daysAbsent > 0 ? "error" : "success"} size="small" sx={{ fontWeight: 700, minWidth: 36 }} />
                        </td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center" }}>
                          <Box sx={{ px: 1.5, py: 0.3, borderRadius: 10, background: tc.bg, color: tc.color, fontSize: 13, fontWeight: 800, display: "inline-block" }}>{r.percentage}%</Box>
                        </td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center", fontSize: 12 }}>
                          {r.percentage >= 75 ? "🟢 Good" : r.percentage >= 50 ? "🟡 Average" : "🔴 Low"}
                        </td>
                        <td style={{ padding: "6px 10px", border: "1px solid #d1fae5", textAlign: "center" }}>
                          <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1, py: 0.2, fontSize: 11 }} onClick={() => removeRow(r.rollNo, r.month)}>✕</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 5, border: "2px dashed #e2e8f0", borderRadius: 3, color: "#94a3b8" }}>
              <Typography sx={{ fontSize: 32, mb: 1 }}>📋</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>No student attendance for {studentAttendanceMonth}</Typography>
              <Typography sx={{ fontSize: 12, mt: 0.5 }}>Import an Excel file or add students manually above.</Typography>
            </Box>
          )}
        </>
      )}

      {/* ── CLASS-WISE SUMMARY TAB ── */}
      {activeTab === "classwise" && (
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#0f766e", fontSize: 14, mb: 2 }}>
            🏫 Class-wise Average Attendance — {studentAttendanceMonth}
          </Typography>
          {allClasses.length === 0 ? (
            <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No data available. Add student attendance records first.</Typography>
          ) : (
            <Grid container spacing={2}>
              {allClasses.map((cls) => {
                const classRecords = studentAttendanceData.filter((r) => r.class === cls && (!studentAttendanceMonth || r.month === studentAttendanceMonth));
                const avg = classAverages[cls] || 0;
                const sections = [...new Set(classRecords.map((r) => r.section).filter(Boolean))];
                const good = classRecords.filter((r) => r.percentage >= 75).length;
                const low = classRecords.filter((r) => r.percentage < 50).length;
                const tc = attColor(avg);

                // Section-wise breakdown
                const sectionBreakdown = sections.map((sec) => {
                  const secRecs = classRecords.filter((r) => r.section === sec);
                  const secAvg = secRecs.length > 0
                    ? (secRecs.reduce((s, r) => s + r.percentage, 0) / secRecs.length).toFixed(1)
                    : 0;
                  return { sec, count: secRecs.length, avg: parseFloat(secAvg) };
                });

                return (
                  <Grid item xs={12} sm={6} md={4} key={cls}>
                    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, borderTop: `4px solid ${tc.color}` }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: 800, color: "#1e3a5f", fontSize: 16 }}>Class {cls}</Typography>
                        <Box sx={{ px: 2, py: 0.5, borderRadius: 10, background: tc.bg, color: tc.color, fontSize: 16, fontWeight: 800 }}>{avg}%</Box>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>Total Students: <strong>{classRecords.length}</strong></Typography>

                      {/* Progress bar */}
                      <Box sx={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", mb: 1.5 }}>
                        <Box sx={{ height: "100%", width: `${Math.min(avg, 100)}%`, background: tc.color, borderRadius: 4, transition: "width 0.4s" }} />
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                        <Chip label={`🟢 ${good} ≥75%`} size="small" sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: 11 }} />
                        <Chip label={`🔴 ${low} <50%`} size="small" sx={{ background: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: 11 }} />
                      </Box>

                      {/* Section breakdown */}
                      {sectionBreakdown.length > 0 && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid #e2e8f0" }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#374151", mb: 1 }}>Section-wise:</Typography>
                          {sectionBreakdown.map(({ sec, count, avg: sAvg }) => {
                            const stc = attColor(sAvg);
                            return (
                              <Box key={sec} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                <Typography sx={{ fontSize: 12, color: "#374151" }}>Section {sec} ({count} students)</Typography>
                                <Box sx={{ px: 1, py: 0.2, borderRadius: 8, background: stc.bg, color: stc.color, fontSize: 11, fontWeight: 700 }}>{sAvg}%</Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Overall class comparison bar chart */}
          {allClasses.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f766e", fontSize: 14, mb: 1.5 }}>📊 Class-wise Comparison</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: 160, background: "#f0fdfa", border: "1px solid #a7f3d0", borderRadius: 2, px: 3, py: 2, overflowX: "auto" }}>
                {allClasses.map((cls) => {
                  const avg = classAverages[cls] || 0;
                  const tc = attColor(avg);
                  const maxAvg = Math.max(...Object.values(classAverages), 1);
                  return (
                    <Tooltip key={cls} title={`Class ${cls}: ${avg}%`} arrow>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 50, flex: 1 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: tc.color, mb: 0.5 }}>{avg}%</Typography>
                        <Box sx={{ width: "100%", height: `${(avg / maxAvg) * 100}px`, background: `linear-gradient(to top, ${tc.color}, ${tc.bg})`, borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.4s" }} />
                        <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5 }}>Cls {cls}</Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* ── PERFORMANCE TAB ── */}
      {activeTab === "performance" && (
        <Box>
          {/* Monthly trend */}
          <Typography sx={{ fontWeight: 700, color: "#0f766e", fontSize: 14, mb: 1.5 }}>📈 Monthly Average Attendance Trend</Typography>
          {(() => {
            const monthlyTrend = MONTHS.map((m) => {
              const monthRecords = studentAttendanceData.filter((r) => r.month === m);
              if (monthRecords.length === 0) return { month: m, avg: null };
              const avg = monthRecords.reduce((s, r) => s + r.percentage, 0) / monthRecords.length;
              return { month: m, avg: parseFloat(avg.toFixed(1)) };
            });
            const maxAvg = Math.max(...monthlyTrend.filter((m) => m.avg !== null).map((m) => m.avg), 1);
            return (
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 140, background: "#f0fdfa", border: "1px solid #a7f3d0", borderRadius: 2, px: 2, py: 2, overflowX: "auto", mb: 3 }}>
                {monthlyTrend.map(({ month, avg }) => (
                  <Tooltip key={month} title={avg !== null ? `${avg}%` : "No data"} arrow>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40, flex: 1 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 700, color: avg >= 75 ? "#16a34a" : avg >= 50 ? "#d97706" : avg !== null ? "#dc2626" : "#d1d5db", mb: 0.5 }}>{avg !== null ? `${avg}%` : "—"}</Typography>
                      <Box sx={{ width: "100%", height: avg !== null ? `${(avg / maxAvg) * 90}px` : "4px", background: avg >= 75 ? "linear-gradient(to top, #16a34a, #4ade80)" : avg >= 50 ? "linear-gradient(to top, #d97706, #fbbf24)" : avg !== null ? "linear-gradient(to top, #dc2626, #f87171)" : "#e2e8f0", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                      <Typography sx={{ fontSize: 9, color: "#64748b", mt: 0.5, textAlign: "center" }}>{month.slice(0, 3)}</Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            );
          })()}

          {/* Low attendance alert */}
          {studentAttendanceData.filter((r) => r.percentage < 75).length > 0 && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>⚠️ Students Below 75% Attendance (Action Required)</Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Roll No", "Name", "Class", "Month", "Attendance %"].map((h) => (
                        <th key={h} style={{ padding: "4px 8px", background: "#fef3c7", fontSize: 11, fontWeight: 700, border: "1px solid #fde68a", textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendanceData.filter((r) => r.percentage < 75).sort((a, b) => a.percentage - b.percentage).slice(0, 10).map((r, i) => (
                      <tr key={i} style={{ backgroundColor: r.percentage < 50 ? "#fee2e2" : "#fffbeb" }}>
                        <td style={{ padding: "4px 8px", border: "1px solid #fde68a", fontSize: 12 }}>{r.rollNo}</td>
                        <td style={{ padding: "4px 8px", border: "1px solid #fde68a", fontSize: 12, fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: "4px 8px", border: "1px solid #fde68a", fontSize: 12 }}>{r.class} - {r.section}</td>
                        <td style={{ padding: "4px 8px", border: "1px solid #fde68a", fontSize: 12 }}>{r.month}</td>
                        <td style={{ padding: "4px 8px", border: "1px solid #fde68a", fontSize: 12, fontWeight: 700, color: r.percentage < 50 ? "#dc2626" : "#d97706" }}>{r.percentage}%</td>
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
   MAIN EMRS FORM
───────────────────────────────────────────────────────────────────────────── */
const EMRSForm = ({ addSubmittedForm }) => {
  const { user } = useAuth();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (file) => {
    if (!file) return;
    setUploadedImage(file);
    setValue("emrsImage", file);
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [safetyCompliance, setSafetyCompliance] = useState({
    totalFireExtinguishers: "",
    functionalFireExtinguishers: "",
    electricalSafetyInspection: "No",
    fireSafetyDrillConducted: "No",
  });

  const handleFundsChange = (field, value) => {
    setFinancialData((prev) => {
      const updated = { ...prev, [field]: value };
      const allocated = parseFloat(field === "totalFundsAllocated" ? value : prev.totalFundsAllocated);
      const utilized = parseFloat(field === "totalFundsUtilized" ? value : prev.totalFundsUtilized);
      if (!isNaN(allocated) && allocated > 0 && !isNaN(utilized) && utilized >= 0) {
        const pct = (utilized / allocated) * 100;
        updated.utilizationPercentage = parseFloat(pct.toFixed(2));
        if (pct >= 95) updated.fundUtilMarksObtained = 5;
        else if (pct >= 70) updated.fundUtilMarksObtained = 3;
        else if (pct >= 50) updated.fundUtilMarksObtained = 1;
        else updated.fundUtilMarksObtained = 0;
      } else {
        updated.utilizationPercentage = "";
        updated.fundUtilMarksObtained = 0;
      }
      return updated;
    });
  };

  const STEPS = [
    { label: "School Details", icon: "🏫" },
    { label: "Infrastructure", icon: "🔬" },
    { label: "Construction", icon: "🏗️" },
    { label: "Hostel", icon: "🏠" },
    { label: "Enrollment", icon: "🎓" },
    { label: "Extra Curricular", icon: "🎭" },
    { label: "Hospitalization", icon: "🏥" },
    { label: "Staff Details", icon: "👨‍🏫" },
    { label: "Attendance", icon: "📅" },
    { label: "Operational Cost", icon: "💰" },
    { label: "Financial & Procurement Compliance", icon: "📊" },
    { label: "EMRS Image Upload", icon: "📸" },
     { label: "Preview & Submit", icon: "👁️" },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyAttendance, setMonthlyAttendance] = useState([
    { month: "", workingDays: "", totalStudents: "", totalPresent: "" },
  ]);
  const [staffRows, setStaffRows] = useState([]);
  const [staffIndex, setStaffIndex] = useState(0);
  const [attendance, setAttendance] = useState({
    workingDays: "", casual: "", earned: "", medical: "", maternity: "", paternity: "", holidays: "", present: 0, absent: 0,
  });
  const [reservationRows, setReservationRows] = useState([{ name: "", class: "", section: "", category: "" }]);

  const { control, handleSubmit, setValue, watch, register, trigger } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      EMRScode: "", EMRSid: "", udaisecode: "", schoolname: "", schooltype: "", Affiliation: "",
      principalAvailable: "", NameofthePrincipal: "", contactno: "", emailid: "",
      state: "Assam", pincode: "", district: "", block: "", gramPanchayat: "", village: "",
    },
  });

  useEffect(() => {
    if (!user || user.role !== "school") return;
    setValue("EMRScode", user.schoolCode || "");
    setValue("schoolname", user.schoolName || "");
    setValue("state", user.state || "Assam");
    setValue("pincode", user.pincode || "");
    setValue("district", user.district || "");
    setValue("block", user.block || "");
    setValue("gramPanchayat", user.gramPanchayat || "");
    setValue("village", user.village || "");
    setValue("NameofthePrincipal", user.principal || "");
    setValue("principalAvailable", user.principal ? "Yes" : "");
    setValue("contactno", user.contact || "");
    setValue("emailid", user.email || "");
  }, [user, setValue]);

  const physicsLabFunctional = watch("physicsLabFunctional");
  const chemistryLabFunctional = watch("chemistryLabFunctional");
  const biologyLabFunctional = watch("biologyLabFunctional");
  const computerLabFunctional = watch("computerLabFunctional");
  const mathLabFunctional = watch("mathLabFunctional");
  const skillLabFunctional = watch("skillLabFunctional");

  useEffect(() => {
    const yesCount = [physicsLabFunctional, chemistryLabFunctional, biologyLabFunctional, computerLabFunctional, mathLabFunctional, skillLabFunctional].filter((val) => val === "Yes").length;
    let marks = 0;
    if (yesCount === 6) marks = 5;
    else if (yesCount >= 3) marks = 3;
    else if (yesCount >= 1) marks = 1;
    setValue("marksLabFunctional", marks);
  }, [physicsLabFunctional, chemistryLabFunctional, biologyLabFunctional, computerLabFunctional, mathLabFunctional, skillLabFunctional, setValue]);

  const [enrollmentRows, setEnrollmentRows] = useState([{
    academicYear: "", class: "", section: "", sanctionedCapacity: "", currentEnrollment: "",
    categoryBreakdown: { ST: "", PVTG: "", "DNT/NT/SNT": "", Orphan: "", Divyang: "" },
    boardClass: "", appeared: "", passed: "", passPercent: "", marks: "", stream: "", distinctions: "", topScorer: "", topScore: "",
    monthlyAttendance: [],
    dropouts: [{ studentName: "", rollNo: "", reason: "", guardianName: "", guardianContactNo: "", pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "" }],
    migrations: [{ studentName: "", migratedFrom: "", transferredTo: "", reason: "" }],
    achievements: [{ studentName: "", eventName: "", level: "", recognition: "" }],
  }]);

  const [extraCurricularRows, setExtraCurricularRows] = useState([{
    academicYear: "", initiativeName: "", collaboratingPartner: "", areasOfDevelopment: "", description: "", targetStudents: "", status: "",
  }]);

  const blankEyeEntry = () => ({ eyeSpecialistName: "", eyeCheckupDate: "", eyeClass: "", eyeSection: "", eyeStudentsScreened: "", eyeStudentsWithProblem: "", eyeNeedsSpectacle: "", eyeNeedsHigherInvestigation: "" });
  const blankEarEntry = () => ({ earSpecialistName: "", earCheckupDate: "", earClass: "", earSection: "", earStudentsScreened: "", earStudentsWithProblem: "", earNeedsEquipment: "" });
  const blankNurseEntry = () => ({ nurseName: "", nurseQualification: "", nurseRegNo: "", nurseContact: "", nurseShift: "", nurseJoiningDate: "", activities: [] });
  const blankActivity = () => ({ activityType: "", activityDesc: "", activityDateTime: "", remarks: "" });
  const blankVisitLog = () => ({ visitDate: "", actualVisitTime: "", visitStatus: "", remarks: "" });

  const addEyeRow = (index) => { const u = [...hospitalizationRows]; u[index].eyeEntries = [...(u[index].eyeEntries || []), blankEyeEntry()]; setHospitalizationRows(u); };
  const addEarRow = (index) => { const u = [...hospitalizationRows]; u[index].earEntries = [...(u[index].earEntries || []), blankEarEntry()]; setHospitalizationRows(u); };

  const [eyeDateErrors, setEyeDateErrors] = useState({});
  const [earDateErrors, setEarDateErrors] = useState({});

  const emptyHospitalizationRow = () => ({
    hospitalEmpanelled: "", privateHospital: "", empanellementValidity: "", empanelmentDepartment: "", doctorName: "", treatmentDetails: "",
    studentName: "", rollNo: "", class: "", section: "", guardianName: "", guardianContact: "", admissionDate: "", dischargeDate: "",
    reasonForHospitalization: "", estimatedCost: "", amountClaimed: "", claimStatus: "",
    "Annual Health Check Conducted": "", "Part-Time Doctor Engaged": "", "Medical Register Maintained": "", "Sickle Cell Screening Conducted": "", "ABHA ID Created": "", "Eye Checkup Conducted": "", "Ear Checkup Conducted": "",
    marksHealth: "", eyeCheckupConducted: "", eyeEntries: [blankEyeEntry()], earCheckupConducted: "", earEntries: [blankEarEntry()], nurseEntries: [blankNurseEntry()],
    visitingDoctorName: "", visitingDoctorSpecialization: "", visitingDoctorRegNo: "", visitingDoctorContact: "", scheduledVisitTime: "", doctorVisitLogs: [blankVisitLog()],
    counsellorName: "", counsellorQualification: "", counsellorRegNo: "", counsellorContact: "", counsellorAvailableDays: [], counsellorSessionType: "", counsellorSessionsConducted: "", counsellorStudentsCounselled: "",
  });

  const calculateHealthMarks = (rowData) => {
    const conditions = ["Annual Health Check Conducted", "Part-Time Doctor Engaged", "Medical Register Maintained", "Sickle Cell Screening Conducted", "Eye Checkup Conducted", "Ear Checkup Conducted"];
    const yesCount = conditions.filter((c) => rowData[c] === "Yes").length;
    if (yesCount === 7) return 9; if (yesCount >= 5) return 7; if (yesCount >= 3) return 5; if (yesCount >= 1) return 3; return 0;
  };

  const validateBiAnnualDate = (newDate, entries, currentIndex, dateField) => {
    if (!newDate || !dayjs(newDate).isValid()) return null;
    const newDayjs = dayjs(newDate);
    for (let i = 0; i < entries.length; i++) {
      if (i === currentIndex) continue;
      const otherDate = entries[i][dateField];
      if (!otherDate) continue;
      const otherDayjs = dayjs(otherDate);
      const diffMonths = Math.abs(newDayjs.diff(otherDayjs, "month", true));
      if (diffMonths < 6 || diffMonths > 6) {
        return `Date must be exactly 6 months apart from entry #${i + 1} (${otherDayjs.format("DD MMM YYYY")}). Current gap: ${diffMonths.toFixed(1)} months.`;
      }
    }
    return null;
  };

  const [hospitalizationRows, setHospitalizationRows] = useState([emptyHospitalizationRow()]);

  const [teachingRows, setteachingRows] = useState([{
    post: "", staffName: "", name: "", dob: "", doj: "", email: "", contactNumber: "", contact: "", total: "", filled: "", vacant: "",
    academicQualifications: [{ post: "", staffname: " ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
    professionalQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
    tetQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
    monthlyAttendance: [],
  }]);

  const [recurringBreakup, setRecurringBreakup] = useState([
    { sno: "1", component: "Staff Salary (53.85%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "2", component: "Direct Expenditure on Students (23.78%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3a", component: "Operational Expenditure & Co-Curricular (13.62%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "3b", component: "Maintenance & Repair of Buildings (4.75%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "4", component: "Administrative Expense of State Society (1.91%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
    { sno: "5", component: "Capital Expenditure (2.09%)", colA: "", colC: "", colD: "", colE: "", remarks: "" },
  ]);

  const handleBreakupChange = (index, field, value) => {
    const updated = [...recurringBreakup]; updated[index] = { ...updated[index], [field]: value }; setRecurringBreakup(updated);
  };

  const [nonTeachingRows, setnonTeachingRows] = useState([{
    post: "", name: "", dob: "", doj: "", email: "", contact: "", total: "", filled: "", vacant: "",
    academicQualifications: [{ post: "", staffname: " ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" }],
    professionalQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
    tetQualifications: [{ post: "", staffname: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" }],
    monthlyAttendance: [],
  }]);

  const [operationalCostRows, setOperationalCostRows] = useState([{ year: "", month: "", costType: "", amount: "" }]);

  const [messData, setMessData] = useState({
    year: "2026", month: "March", purchaseDate: "", purchasedFrom: "", billNo: "", paymentMethod: "",
    items: [{ category: "", name: "", quantity: "", unit: "", price: "", total: 0 }],
    weeklyMenuDisplayed: "", messInspectionRegister: "", foodStockRegister: "", foodComplaintRegister: "", messCleanlinessDaily: "",
  });

  const [financialData, setFinancialData] = useState({
    academicYear: "", totalFundsAllocated: "", totalFundsUtilized: "", utilizationPercentage: 0, fundUtilMarksObtained: 0,
    auditConducted: "", totalProcurements: 0, procurementsGeM: 0, gemProcurementPercentage: 0, gemMarksObtained: 0,
  });

  const [procurements, setProcurements] = useState([]);
  const [procurementDialogOpen, setProcurementDialogOpen] = useState(false);
  const [currentProcurement, setCurrentProcurement] = useState({ type: "", description: "", totalNumber: "", orderDate: "", value: "", vendor: "", throughGem: "" });

  const totalProcurements = procurements.reduce((sum, p) => sum + Number(p.totalNumber || 0), 0);
  const totalThroughGem = procurements.reduce((sum, p) => sum + Number(p.throughGem || 0), 0);
  const gemPercentage = totalProcurements > 0 ? ((totalThroughGem / totalProcurements) * 100).toFixed(2) : "0.00";
  const getGemMarks = (pct) => { const p = Number(pct); if (p >= 100) return 5; if (p >= 75) return 4; if (p >= 50) return 3; if (p >= 25) return 1; return 0; };
  const gemMarks = getGemMarks(gemPercentage);

  const [constructionRows, setConstructionRows] = useState({
    school: [
      { component: "Classrooms", units: "6 rooms", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Teachers Staff Room", units: "2 rooms", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Student Lab", units: "2 labs", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Library", units: "1 library", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Science Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Biology Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Chemistry Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Physics Lab", units: "1 lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Mathematics Lab", units: "1 Lab", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Auditorium", units: "1 hall", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Infirmary", units: "1 room", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    residence: [
      { component: "Boys Hostel", units: "50 beds", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Girls Hostel", units: "50 beds", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water System", units: "2 tanks", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Warden Office", units: "1 office", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Recreation Area", units: "1 area", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Laundry Area", units: "1 area", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Kitchen", units: "1 kitchen", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Staff Housing", units: "10 units", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    outdoor: [
      { component: "Compound Wall", units: "500 m", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Garden", units: "2000 sqm", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Worker Toilets", units: "4 units", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Parking", units: "500 sqm", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
    utilities: [
      { component: "Electrical System", units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Transformer Installed", units: "1 unit", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "↳ Digiset Installed", units: "1 unit", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Water Tanks", units: "2 tanks", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Sewage System", units: "1 plant", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Rainwater Harvest", units: "1 system", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
      { component: "Security Cabin", units: "1 cabin", status: "Not Started", progress: 0, startDate: "", endDate: "", assignedTo: "", budget: "", remarks: "" },
    ],
  });

  /* ─────────────────────────────────────────────────────────────────
     INDEPENDENT ATTENDANCE STATE (decoupled from Staff Details)
  ───────────────────────────────────────────────────────────────── */
  // Single shared array for ALL staff attendance rows (Teaching + Non-Teaching)
  // staffType field distinguishes them
  const [staffAttendanceRows, setStaffAttendanceRows] = useState([]);
  const [teachingAttMonth, setTeachingAttMonth] = useState(MONTHS[new Date().getMonth()]);
  const [nonTeachingAttMonth, setNonTeachingAttMonth] = useState(MONTHS[new Date().getMonth()]);

  /* ─────────────────────────────────────────────────────────────────
     STUDENT ATTENDANCE STATE
  ───────────────────────────────────────────────────────────────── */
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [studentAttendanceMonth, setStudentAttendanceMonth] = useState(MONTHS[new Date().getMonth()]);
  const [studentExcelError, setStudentExcelError] = useState("");
  const [studentExcelUploading, setStudentExcelUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  const handleStudentExcelUpload_FIXED = (file) => {
  if (!file) return;
  setStudentExcelError("");
  setStudentExcelUploading(true);
 
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });
 
      if (!raw || raw.length === 0) {
        setStudentExcelError("The uploaded file appears to be empty.");
        setStudentExcelUploading(false);
        return;
      }
 
      // Normalize column header keys
      const normalise = (obj) => {
        const out = {};
        Object.entries(obj).forEach(([k, v]) => {
          out[k.toLowerCase().replace(/[\s_\-]/g, "")] = v;
        });
        return out;
      };
 
      // Convert any month format → canonical MONTHS[] entry
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
 
      const parsed = raw.map((row) => {
        const r = normalise(row);
        const wd  = parseFloat(r["workingdays"] ?? r["totaldays"] ?? "") || 0;
        const dp  = parseFloat(r["dayspresent"] ?? r["present"] ?? "") || 0;
        const da  = wd > 0 ? Math.max(0, wd - dp) : 0;
        const pct = wd > 0 ? parseFloat(((dp / wd) * 100).toFixed(1)) : 0;
 
        const rawMonth  = r["month"] ?? "";
        const normMonth = normalizeMonth(rawMonth) || studentAttendanceMonth;
 
        return {
          rollNo:      String(r["rollno"] ?? r["roll"] ?? r["rollnumber"] ?? "").trim(),
          name:        String(r["name"]   ?? r["studentname"] ?? "").trim(),
          class:       String(r["class"]  ?? r["std"] ?? r["grade"] ?? "").trim(),
          section:     String(r["section"] ?? "").trim(),
          month:       normMonth,
          workingDays: wd,
          daysPresent: dp,
          daysAbsent:  da,
          percentage:  pct,
        };
      });
 
      setStudentAttendanceData((prev) => {
        const merged = [...prev];
        parsed.forEach((incoming) => {
          const idx = merged.findIndex(
            (x) =>
              String(x.rollNo).trim() === String(incoming.rollNo).trim() &&
              x.month === incoming.month
          );
          if (idx !== -1) merged[idx] = incoming;
          else merged.push(incoming);
        });
        return merged;
      });
 
      toast.success(`✅ Imported ${parsed.length} student attendance records.`);
    } catch (err) {
      setStudentExcelError("Failed to parse file: " + err.message);
    } finally {
      setStudentExcelUploading(false);
    }
  };
 
  reader.onerror = () => {
    setStudentExcelError("Could not read the file.");
    setStudentExcelUploading(false);
  };
 
  // Must use readAsArrayBuffer (not readAsBinaryString)
  reader.readAsArrayBuffer(file);
};
 
 


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...messData.items];
    if (["quantity", "price"].includes(field)) value = Math.max(0, value);
    updatedItems[index][field] = value;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    updatedItems[index].total = qty * price;
    setMessData({ ...messData, items: updatedItems });
  };

  const addItem = () => setMessData({ ...messData, items: [...messData.items, { category: "", name: "", quantity: "", price: "", total: 0 }] });
  const removeItem = (index) => setMessData({ ...messData, items: messData.items.filter((_, i) => i !== index) });
  const calculateGrandTotal = () => messData.items.reduce((sum, item) => sum + (item.total || 0), 0);

  const prepareBasicDetails = (data) => ({
    EMRScode: data.EMRScode?.trim(), EMRSid: data.EMRSid?.trim(), schoolname: data.schoolname?.trim(), schooltype: data.schooltype?.trim(),
    affiliation: data.affiliation?.trim() || data.Affiliation?.trim(), principalName: data.principalName?.trim() || data.NameofthePrincipal?.trim(),
    contactno: data.contactno?.trim(), email: data.email?.trim() || data.emailid?.trim(),
    ...((() => { const udise = toOptionalNumber(data.udaisecode); return (udise !== undefined && String(udise).length === 11) ? { udaisecode: udise } : {}; })()),
  });

  const prepareLocationDetails = (data) => ({
    pincode: data.pincode || "", state: data.state || "", district: data.district || "", block: data.block || "",
    grampanchayat: data.gramPanchayat || data.grampanchayat || "", village: data.village || "",
  });

  const prepareInfrastructureDetails = (data) => ({
    totalClassrooms: toSafeNumber(data.totalClassrooms), classroomWithSmartClass: toSafeNumber(data.classroomWithSmartClass),
    classroomWithProjector: toSafeNumber(data.classroomWithProjector), scienceLab: data.scienceLab || "", biologyLab: data.biologyLab || "",
    chemistryLab: data.chemistryLab || "", physicsLab: data.physicsLab || "", computerLab: data.computerLab || "",
    internetComputerLab: data.internetComputerLab || "", library: data.library || "", booksInLibrary: toSafeNumber(data.booksInLibrary),
    playground: data.playground || "", playgroundArea: toSafeNumber(data.playgroundArea), auditorium: data.Auditorium || "",
    auditoriumCapacity: toSafeNumber(data.auditoriumCapacity), medicalRoom: data["Medical Room"] || "",
    totalFireExtinguishers: toSafeNumber(data.totalFireExtinguishers), functionalFireExtinguishers: toSafeNumber(data.functionalFireExtinguishers),
    electricalSafetyInspection: data.electricalSafetyInspection || "", fireSafetyDrill: data.fireSafetyDrill || "",
  });

  const prepareConstructionDetails = (data, constructionRows) => ({
    projectStartDate: data.projectStartDate || "", expectedEndDate: data.projectEndDate || "",
    totalBudget: toSafeNumber(data.totalProjectBudget),
    school: sanitizeConstructionComponents(constructionRows.school),
    residence: sanitizeConstructionComponents(constructionRows.residence),
    outdoor: sanitizeConstructionComponents(constructionRows.outdoor),
    utilities: sanitizeConstructionComponents(constructionRows.utilities),
  });

  const prepareHostelAdministration = (data) => ({
    boysHostel: {
      capacity: toSafeNumber(data.boysHostelCapacity), bedsAvailable: toSafeNumber(data.boysBedsAvailable),
      currentOccupancy: toSafeNumber(data.boysCurrentOccupancy), cctvInstalled: data.boysCCTVInstalled || "",
      noOfCCTV: toSafeNumber(data.boysNoOfCCTV), securityAgencyName: data.boysSecurityAgencyName || null,
      securityAgencyContact: data.boysSecurityAgencyContact || null,
      warden: { name: data.boysWardenName, email: data.boysWardenEmail, contact: data.boysWardenContact },
    },
    girlsHostel: {
      capacity: toSafeNumber(data.girlsHostelCapacity), bedsAvailable: toSafeNumber(data.girlsBedsAvailable),
      currentOccupancy: toSafeNumber(data.girlsCurrentOccupancy), cctvInstalled: data.girlsCCTVInstalled || "",
      noOfCCTV: toSafeNumber(data.girlsNoOfCCTV), securityAgencyName: data.girlsSecurityAgencyName || null,
      securityAgencyContact: data.girlsSecurityAgencyContact || null,
      warden: { name: data.girlsWardenName, email: data.girlsWardenEmail, contact: data.girlsWardenContact },
    },
  });

  const prepareMessCompliance = (messData) => ({
    messCompliance: {
      weeklyMenuDisplayed: messData.weeklyMenuDisplayed, messInspectionRegister: messData.messInspectionRegister,
      foodStockRegister: messData.foodStockRegister, foodComplaintRegister: messData.foodComplaintRegister, messCleanlinessDaily: messData.messCleanlinessDaily,
    },
  });

  const resolveCredential = () => (!user || user.role !== "school") ? null : user;

  const passingYears = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i));

  const renderQualificationTables = (staffRows, setStaffRows, staffIndex, showTET = true) => {
    const row = staffRows[staffIndex];
    const qThStyle = { backgroundColor: "#1976d2", color: "#fff", padding: "8px 6px", textAlign: "center", fontSize: "12px", fontWeight: 600, border: "1px solid #1565c0", whiteSpace: "nowrap" };
    const qTdStyle = { padding: "3px", border: "1px solid #cbd5e1" };
    const qTdCenterStyle = { textAlign: "center", padding: "6px", border: "1px solid #cbd5e1", fontSize: "13px" };

    const updateField = (qualType, qIndex, field, value) => {
      const u = [...staffRows]; u[staffIndex][qualType][qIndex][field] = value; setStaffRows(u);
    };

    const ActionButtons = ({ qualType, qIndex, emptyObj }) => (
      <Box display="flex" gap={0.5} justifyContent="center">
        <Button variant="contained" size="small" sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
          onClick={() => { const u = [...staffRows]; u[staffIndex][qualType].splice(qIndex + 1, 0, { ...emptyObj }); setStaffRows(u); }}>+</Button>
        <Button variant="outlined" size="small" sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: "13px", borderColor: "#1976d2", color: "#1976d2" }}
          onClick={() => { const u = [...staffRows]; u[staffIndex][qualType][qIndex] = { ...emptyObj }; setStaffRows(u); }}>↺</Button>
      </Box>
    );

    const emptyAcademic = { post: "", name: " ", qualification: "", course: "", registrationNo: "", rollNo: "", college: "", marksObtained: "", university: "", passingYear: "" };
    const emptyTET = { post: "", name: " ", qualification: "", registrationNo: "", rollNo: "", examConductedBy: "", passingYear: "", marksObtained: "", affiliationBody: "" };

    return (
      <Box mt={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>Academic Qualification</Typography>
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["S.No", "Post", "Name", "Qualification", "Course", "College", "University", "Passing Year", "Action"].map((h) => (<th key={h} style={qThStyle}>{h}</th>))}</tr>
            </thead>
            <tbody>
              {row.academicQualifications.map((q, qIndex) => (
                <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <td style={qTdCenterStyle}>{qIndex + 1}</td>
                  <td style={{ ...qTdStyle, minWidth: 120 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>{row.post || "—"}</Typography></td>
                  <td style={{ ...qTdStyle, minWidth: 130 }}><Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>{row.name || row.staffName || "—"}</Typography></td>
                  <td style={qTdStyle}><TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("academicQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 110 }}>{qualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></td>
                  <td style={qTdStyle}><TextField fullWidth size="small" value={q.course} onChange={(e) => updateField("academicQualifications", qIndex, "course", e.target.value)} sx={{ minWidth: 90 }} /></td>
                  <td style={qTdStyle}><TextField fullWidth size="small" value={q.college} onChange={(e) => updateField("academicQualifications", qIndex, "college", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={qTdStyle}><TextField fullWidth size="small" value={q.university} onChange={(e) => updateField("academicQualifications", qIndex, "university", e.target.value)} sx={{ minWidth: 120 }} /></td>
                  <td style={qTdStyle}><TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("academicQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>{passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}</TextField></td>
                  <td style={qTdCenterStyle}><ActionButtons qualType="academicQualifications" qIndex={qIndex} emptyObj={emptyAcademic} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {showTET && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>TET Qualification</Typography>
            <Box sx={{ overflowX: "auto", mb: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["S.No", "Post", "Name", "Qualification", "Passing Year", "Action"].map((h) => (<th key={h} style={qThStyle}>{h}</th>))}</tr></thead>
                <tbody>
                  {row.tetQualifications.map((q, qIndex) => (
                    <tr key={qIndex} style={{ backgroundColor: qIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                      <td style={qTdCenterStyle}>{qIndex + 1}</td>
                      <td style={{ ...qTdStyle, minWidth: 120 }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#1976d2", px: 1, py: 0.4, borderRadius: 1, textAlign: "center", whiteSpace: "nowrap" }}>{row.post || "—"}</Typography></td>
                      <td style={{ ...qTdStyle, minWidth: 130 }}><Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", px: 1, whiteSpace: "nowrap" }}>{row.name || row.staffName || "—"}</Typography></td>
                      <td style={qTdStyle}><TextField select fullWidth size="small" value={q.qualification} onChange={(e) => updateField("tetQualifications", qIndex, "qualification", e.target.value)} sx={{ minWidth: 130 }}>{tetQualificationOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField></td>
                      <td style={qTdStyle}><TextField select fullWidth size="small" value={q.passingYear} onChange={(e) => updateField("tetQualifications", qIndex, "passingYear", e.target.value)} sx={{ minWidth: 100 }}>{passingYears.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}</TextField></td>
                      <td style={qTdCenterStyle}><ActionButtons qualType="tetQualifications" qIndex={qIndex} emptyObj={emptyTET} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </>
        )}
      </Box>
    );
  };

  const syncInfraToConstruction = (fieldName, value) => {
    const map = { scienceLab: { cat: "school", component: "Science Lab" }, library: { cat: "school", component: "Library" }, Auditorium: { cat: "school", component: "Auditorium" }, "Medical Room": { cat: "school", component: "Infirmary" } };
    if (map[fieldName] && value === "Yes") {
      const { cat, component } = map[fieldName];
      setConstructionRows((prev) => ({ ...prev, [cat]: prev[cat].map((r) => r.component === component && r.status === "Not Started" ? { ...r, status: "In Progress" } : r) }));
    }
  };

  const onPincodeChange = async (pincode) => {
    if (!pincode || String(pincode).length !== 6) return;
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setValue("district", po.District || ""); setValue("block", po.Block || ""); setValue("gramPanchayat", po.Name || ""); setValue("village", po.Division || "");
      } else { setValue("district", ""); setValue("block", ""); setValue("gramPanchayat", ""); setValue("village", ""); }
    } catch (error) { console.error("Pincode lookup failed:", error); }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const loadingToast = toast.loading("Submitting EMRS data...");

    try {
      const payload = {
        userId: "1",
        ...prepareBasicDetails(data),
        ...prepareLocationDetails(data),
        ...prepareInfrastructureDetails(data),
        constructionStatus: prepareConstructionDetails(data, constructionRows),
        ...prepareHostelAdministration(data),
        ...prepareMessCompliance(data),
        classStrength: enrollmentRows.map((row) => ({
          academicYear: row.academicYear, class: row.class, section: row.section,
          sanctionedCapacity: toSafeNumber(row.sanctionedCapacity), currentEnrollment: toSafeNumber(row.currentEnrollment),
          categoryBreakdown: row.categoryBreakdown || {},
          academicPerformance: { appeared: toSafeNumber(row.appeared), passed: toSafeNumber(row.passed), passPercent: row.passPercent || "", above75: toSafeNumber(row.above75), below50: toSafeNumber(row.below50), stream: row.stream || "", distinctions: toSafeNumber(row.distinctions), topScorer: row.topScorer || "", topScore: toSafeNumber(row.topScore) },
          dropouts: row.dropouts.map((d) => ({ rollNo: d.rollNo, studentName: d.studentName?.trim(), reason: d.reason?.trim(), guardianContactNo: d.guardianContactNo })),
          migrations: row.migrations.map((m) => ({ studentName: m.studentName?.trim(), migratedFrom: m.migratedFrom?.trim(), transferredTo: m.transferredTo?.trim(), reason: m.reason?.trim() })),
          achievements: row.achievements.map((a) => ({ studentName: a.studentName?.trim(), eventName: a.eventName?.trim(), level: a.level, recognition: a.recognition?.trim() })),
        })),
        extraCurricular: extraCurricularRows.map((item) => ({ academicYear: item.academicYear, initiativeName: item.initiativeName?.trim(), collaboratingPartner: item.collaboratingPartner?.trim(), areasOfDevelopment: item.areasOfDevelopment ? [item.areasOfDevelopment] : [], description: item.description?.trim(), targetStudents: item.targetStudents?.trim(), status: item.status })),
        hospitalization: hospitalizationRows.map((item) => ({ studentName: item.studentName?.trim(), rollNo: item.rollNo, class: item.class, section: item.section, admissionDate: item.admissionDate, dischargeDate: item.dischargeDate, reasonForHospitalization: item.reasonForHospitalization?.trim(), hospitalEmpanelled: item.hospitalEmpanelled?.trim(), empanellementValidity: item.empanellementValidity, treatmentDetails: item.treatmentDetails?.trim(), doctorName: item.doctorName?.trim(), estimatedCost: toSafeNumber(item.estimatedCost), amountClaimed: toSafeNumber(item.amountClaimed), claimStatus: item.claimStatus, guardianName: item.guardianName?.trim(), guardianContact: item.guardianContact })),
        teachingStaff: teachingRows.map((staff) => ({ post: staff.post, name: (staff.name || staff.staffName)?.trim(), dob: staff.dob, doj: staff.doj, email: staff.email?.trim(), contact: staff.contact || staff.contactNumber, total: toSafeNumber(staff.total), filled: toSafeNumber(staff.filled), vacant: toSafeNumber(staff.total) - toSafeNumber(staff.filled), academicQualifications: staff.academicQualifications, professionalQualifications: staff.professionalQualifications, tetQualifications: staff.tetQualifications })),
        nonTeachingStaff: nonTeachingRows.map((staff) => ({ post: staff.post, name: staff.name?.trim(), dob: staff.dob, doj: staff.doj, email: staff.email?.trim(), contact: staff.contact, total: toSafeNumber(staff.total), filled: toSafeNumber(staff.filled), vacant: toSafeNumber(staff.total) - toSafeNumber(staff.filled), academicQualifications: staff.academicQualifications, professionalQualifications: staff.professionalQualifications })),
        // Independent attendance — stored separately
        teachingStaffAttendance: staffAttendanceRows.filter((r) => r.staffType === "Teaching"),
        nonTeachingStaffAttendance: staffAttendanceRows.filter((r) => r.staffType === "Non-Teaching"),
        studentAttendance: studentAttendanceData,
        operationalCost: operationalCostRows.map((row) => ({ year: row.year, month: row.month, costType: row.costType, amount: toSafeNumber(row.amount) })),
      };

      const cred = resolveCredential();
      if (cred) { payload.username = cred.username; payload.loginId = cred.username; payload.schoolCode = cred.schoolCode; payload.EMRScode = cred.schoolCode; payload.schoolname = payload.schoolname || cred.schoolName; payload.district = payload.district || cred.district; payload.block = payload.block || cred.block; }
      else if (user) { payload.username = String(user.username || user.loginId || user.id || ""); payload.loginId = payload.username; }

      let submittedId = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch("http://localhost:5000/api/emrs/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
        clearTimeout(timeoutId);
        const contentType = response.headers.get("content-type");
        let result = {};
        if (contentType && contentType.includes("application/json")) result = await response.json();
        if (response.ok) submittedId = result.data?._id || result._id;
        else submittedId = `local_${Date.now()}`;
      } catch (fetchError) { submittedId = `local_${Date.now()}`; }

      try {
  // FIX: always write BOTH EMRScode and schoolCode so filterFormsForUser
  // can match the record regardless of which field it checks.
  const credSchoolCode =
    (user?.role === "school" ? user?.schoolCode : null) ||
    payload.EMRScode ||
    "";
 
  const recordToSave = {
    ...payload,
    _id:         submittedId || `local_${Date.now()}`,
    EMRScode:    credSchoolCode || payload.EMRScode || "",
    schoolCode:  credSchoolCode || payload.EMRScode || "",   // ← NEW: mirror field
    createdAt:   new Date().toISOString(),
    submittedAt: new Date().toISOString(),
  };
 
  const existing = JSON.parse(
    localStorage.getItem("emrs_submitted_forms") || "[]"
  );
 
  // Match priority:
  //   1. Exact _id (for server records being updated)
  //   2. Same EMRScode / schoolCode
  //   3. Same username / loginId
  const idx = existing.findIndex((f) => {
    // 1. exact server _id (skip local_ ids to avoid collisions)
    if (
      recordToSave._id &&
      !String(recordToSave._id).startsWith("local_") &&
      f._id === recordToSave._id
    )
      return true;
 
    // 2. same school code
    const recCode = String(credSchoolCode || "").toLowerCase();
    if (recCode) {
      const fCode = String(f.EMRScode || f.schoolCode || "").toLowerCase();
      if (fCode && fCode === recCode) return true;
    }
 
    // 3. same username / loginId
    const recUser = String(payload.username || "").toLowerCase();
    if (recUser) {
      const fUser = String(f.username || f.loginId || "").toLowerCase();
      if (fUser && fUser === recUser) return true;
    }
 
    return false;
  });
 
  if (idx !== -1) {
    existing[idx] = recordToSave; // update existing record
  } else {
    existing.push(recordToSave);  // insert new record
  }
 
  localStorage.setItem("emrs_submitted_forms", JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent("emrs-form-submitted"));
} catch (storageError) {
  console.warn("localStorage save failed:", storageError.message);
}
      toast.dismiss(loadingToast);
      toast.success("✅ EMRS Form Submitted Successfully!");
      if (addSubmittedForm) addSubmittedForm({ id: submittedId, schoolname: payload.schoolname, EMRScode: payload.EMRScode, district: payload.district, submittedAt: new Date().toLocaleString(), payload });
      navigate("/emrs/dashboard");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("❌ Submission failed: " + error.message);
      console.error("Submit error:", error);
    } finally { setLoading(false); }
  };

  return (
    <Container sx={{ mt: 4, mb: 4, backgroundColor: "#f1f5f9", padding: 3, borderRadius: 3 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" fontWeight="bold" gutterBottom>EMRS</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>Create and manage EMRS details</Typography>

      {/* ===== STEPPER ===== */}
      <Box sx={{ overflowX: "auto", pb: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 700 }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 72 }}>
                <Box onClick={() => i < currentStep && setCurrentStep(i)}
                  sx={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#e2e8f0", color: i <= currentStep ? "#fff" : "#94a3b8", cursor: i < currentStep ? "pointer" : "default", fontWeight: 700, transition: "all 0.3s", boxShadow: i === currentStep ? "0 0 0 4px #bbdefb" : "none" }}>
                  {i < currentStep ? "✓" : step.icon}
                </Box>
                <Typography sx={{ fontSize: 10, mt: 0.5, fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? "#1976d2" : i < currentStep ? "#4caf50" : "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>{step.label}</Typography>
              </Box>
              {i < STEPS.length - 1 && (<Box sx={{ flex: 1, height: 3, mx: 0.5, background: i < currentStep ? "#4caf50" : "#e2e8f0", borderRadius: 2, transition: "background 0.3s", minWidth: 10 }} />)}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Card>
        <Box sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", padding: 2, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>EMRS Details Form</Typography>
        </Box>
        <Divider />
        <CardContent sx={{ backgroundColor: "#f8fafc", padding: 4, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}>

            {currentStep === 0 && <SchoolDetails control={control} watch={watch} setValue={setValue} emrsBasicFields={emrsBasicFields} onPincodeChange={onPincodeChange} />}
            {currentStep === 1 && <InfrastructureDetails control={control} watch={watch} syncInfraToConstruction={syncInfraToConstruction} />}
            {currentStep === 2 && <ConstructionDetails control={control} constructionRows={constructionRows} setConstructionRows={setConstructionRows} />}
            {currentStep === 3 && <HostelDetails control={control} watch={watch} messData={messData} setMessData={setMessData} addItem={addItem} removeItem={removeItem} handleItemChange={handleItemChange} calculateGrandTotal={calculateGrandTotal} />}
            {currentStep === 4 && <Enrollment enrollmentRows={enrollmentRows} setEnrollmentRows={setEnrollmentRows} />}
            {currentStep === 5 && <ExtraCurricular extraCurricularRows={extraCurricularRows} setExtraCurricularRows={setExtraCurricularRows} control={control} watch={watch} />}
            {currentStep === 6 && (
              <HospitalizationSection
                hospitalizationRows={hospitalizationRows} setHospitalizationRows={setHospitalizationRows}
                eyeDateErrors={eyeDateErrors} setEyeDateErrors={setEyeDateErrors}
                earDateErrors={earDateErrors} setEarDateErrors={setEarDateErrors}
                emptyHospitalizationRow={emptyHospitalizationRow} calculateHealthMarks={calculateHealthMarks}
                validateBiAnnualDate={validateBiAnnualDate} addEyeRow={addEyeRow} addEarRow={addEarRow}
                blankNurseEntry={blankNurseEntry} blankActivity={blankActivity} blankVisitLog={blankVisitLog}
              />
            )}

            {/* ── Step 7: Staff Details ── */}
            {currentStep === 7 && (
              <>
                {/* ══════════ TEACHING STAFF ══════════ */}
                <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>Teaching Staff Details</Typography>
                <Box sx={{ border: "1px solid #bfdbfe", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#eff6ff" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1d4ed8", mb: 1.5 }}>Sanctioned Strength</Typography>
                  <Grid container spacing={2}>
                    {teachingStaffSummaryFields.filter((f) => ["total", "filled", "vacant"].includes(f.name)).map((field) => (
                      <Grid item xs={12} sm={4} key={field.name}>
                        <TextField fullWidth size="small" type={field.type || "text"} label={field.label}
                          value={field.name === "vacant" ? Number(teachingRows[0]?.total || 0) - Number(teachingRows[0]?.filled || 0) || "" : teachingRows[0]?.[field.name] ?? ""}
                          inputProps={{ min: 0 }} InputProps={{ readOnly: field.readOnly }}
                          onChange={(e) => { const u = [...teachingRows]; if (!u.length) return; u[0][field.name] = e.target.value; setteachingRows(u); }} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {teachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}>👨‍🏫 Teaching Staff #{index + 1}</Typography>
                      {teachingRows.length > 1 && <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1.5, fontSize: 12 }} onClick={() => setteachingRows((prev) => prev.filter((_, i) => i !== index))}>Remove</Button>}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Staff Details</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {teachingStaffSummaryFields.filter((f) => !["total", "filled", "vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={6} md={4} key={field.name}>
                            {field.type === "select" ? (
                              <TextField select fullWidth size="small" label={field.label} value={row[field.name] ?? ""} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: true }}
                                onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }}>
                                <MenuItem value="">Select</MenuItem>
                                {field.options?.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                              </TextField>
                            ) : (
                              <TextField fullWidth size="small" type={field.type || "text"} label={field.label} value={row[field.name] ?? ""} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
                                onChange={(e) => { const u = [...teachingRows]; u[index][field.name] = e.target.value; setteachingRows(u); }} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Educational Qualification</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                      {renderQualificationTables(teachingRows, setteachingRows, index)}
                    </Box>
                  </Box>
                ))}
                <Box mb={4}>
                  <Button variant="outlined" onClick={() => setteachingRows((prev) => [...prev, { post: "", name: "", dob: "", doj: "", email: "", contact: "", academicQualifications: [{ qualification: "", course: "", college: "", university: "", passingYear: "" }], tetQualifications: [{ qualification: "", passingYear: "" }], monthlyAttendance: [] }])}>
                    + Add Teaching Staff Post
                  </Button>
                </Box>

                {/* ══════════ NON-TEACHING STAFF ══════════ */}
                <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>Non-Teaching Staff Details</Typography>
                <Box sx={{ border: "1px solid #bfdbfe", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#eff6ff" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1d4ed8", mb: 1.5 }}>Sanctioned Strength</Typography>
                  <Grid container spacing={2}>
                    {nonTeachingStaffDetailFields.filter((f) => ["total", "filled", "vacant"].includes(f.name)).map((field) => (
                      <Grid item xs={12} sm={4} key={field.name}>
                        <TextField fullWidth size="small" type={field.type || "text"} label={field.label}
                          value={field.name === "vacant" ? Number(nonTeachingRows[0]?.total || 0) - Number(nonTeachingRows[0]?.filled || 0) || "" : nonTeachingRows[0]?.[field.name] ?? ""}
                          InputProps={{ readOnly: field.readOnly }}
                          onChange={(e) => { const u = [...nonTeachingRows]; if (!u.length) return; u[0][field.name] = e.target.value; setnonTeachingRows(u); }} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {nonTeachingRows.map((row, index) => (
                  <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, p: 3, mb: 3, backgroundColor: "#fff" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}>🧹 Non-Teaching Staff #{index + 1}</Typography>
                      {nonTeachingRows.length > 1 && <Button size="small" color="error" variant="outlined" sx={{ minWidth: 0, px: 1.5, fontSize: 12 }} onClick={() => setnonTeachingRows((prev) => prev.filter((_, i) => i !== index))}>Remove</Button>}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Staff Details</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 2, backgroundColor: "#f8fafc" }}>
                      <Grid container spacing={2}>
                        {nonTeachingStaffDetailFields.filter((f) => !["total", "filled", "vacant"].includes(f.name)).map((field) => (
                          <Grid item xs={12} sm={6} md={4} key={field.name}>
                            {field.type === "select" ? (
                              <TextField select fullWidth size="small" label={field.label} value={row[field.name] ?? ""} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: true }}
                                onChange={(e) => { const u = [...nonTeachingRows]; u[index][field.name] = e.target.value; setnonTeachingRows(u); }}>
                                <MenuItem value="">Select</MenuItem>
                                {field.options?.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                              </TextField>
                            ) : (
                              <TextField fullWidth size="small" type={field.type || "text"} label={field.label} value={row[field.name] ?? ""} InputProps={{ readOnly: field.readOnly }} InputLabelProps={{ shrink: field.type === "date" || undefined }}
                                onChange={(e) => { const u = [...nonTeachingRows]; u[index][field.name] = e.target.value; setnonTeachingRows(u); }} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Educational Qualification</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, backgroundColor: "#f8fafc" }}>
                      {renderQualificationTables(nonTeachingRows, setnonTeachingRows, index, false)}
                    </Box>
                  </Box>
                ))}
                <Box mb={4}>
                  <Button variant="outlined" onClick={() => setnonTeachingRows((prev) => [...prev, { post: "", name: "", dob: "", doj: "", email: "", contact: "", academicQualifications: [{ qualification: "", course: "", college: "", university: "", passingYear: "" }], monthlyAttendance: [] }])}>
                    + Add Non-Teaching Staff Post
                  </Button>
                </Box>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════
                ── Step 8: Attendance — FULLY DECOUPLED ──
            ═══════════════════════════════════════════════════════════ */}
           {currentStep === 8 && (
  <Attendance
    staffAttendanceRows={staffAttendanceRows}
    setStaffAttendanceRows={setStaffAttendanceRows}
    teachingAttMonth={teachingAttMonth}
    setTeachingAttMonth={setTeachingAttMonth}
    nonTeachingAttMonth={nonTeachingAttMonth}
    setNonTeachingAttMonth={setNonTeachingAttMonth}
    studentAttendanceData={studentAttendanceData}
    setStudentAttendanceData={setStudentAttendanceData}
    studentAttendanceMonth={studentAttendanceMonth}
    setStudentAttendanceMonth={setStudentAttendanceMonth}
    
  />
)}

            {currentStep === 9 && <OperationalCost operationalCostRows={operationalCostRows} setOperationalCostRows={setOperationalCostRows} />}
            {/* ── STEP 10: Financial & Procurement ── */}           
{currentStep === 10 && (
  <FinancialProcurement
    procurements={procurements}
    setProcurements={setProcurements}
    procurementDialogOpen={procurementDialogOpen}
    setProcurementDialogOpen={setProcurementDialogOpen}
    currentProcurement={currentProcurement}
    setCurrentProcurement={setCurrentProcurement}
    financialData={financialData}
    handleFundsChange={handleFundsChange}
    recurringBreakup={recurringBreakup}
    handleBreakupChange={handleBreakupChange}
    gemMarks={gemMarks}
    getGemMarks={getGemMarks}
  />
)}
            
          {currentStep === 11 && (
  <EMRSImageUpload
    uploadedImages={uploadedImages}
    setUploadedImages={setUploadedImages}
  />
)}

{currentStep === 12 && (
  <EMRSFormPreview
    formValues={watch()}
    enrollmentRows={enrollmentRows}
    teachingRows={teachingRows}
    nonTeachingRows={nonTeachingRows}
    constructionRows={constructionRows}
    hospitalizationRows={hospitalizationRows}
    extraCurricularRows={extraCurricularRows}
    operationalCostRows={operationalCostRows}
    staffAttendanceRows={staffAttendanceRows}
    studentAttendanceData={studentAttendanceData}
    uploadedImages={uploadedImages}
    procurements={procurements}
    financialData={financialData}
    recurringBreakup={recurringBreakup}
  />
)}

            {/* Navigation */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} pt={3} sx={{ borderTop: "1px solid #e2e8f0" }}>
              <Button variant="outlined" onClick={handleBack} disabled={currentStep === 0} sx={{ minWidth: 120 }}>← Back</Button>
              <Typography sx={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Step {currentStep + 1} of {STEPS.length}</Typography>
              {currentStep < STEPS.length - 1 && (
                <Button variant="contained" onClick={handleNext} sx={{ minWidth: 150, background: "linear-gradient(to right, #1976d2, #42a5f5)" }}>
                  Save &amp; Next →
                </Button>
              )}
              {currentStep === STEPS.length - 1 && (
                <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 150, background: "linear-gradient(to right, #16a34a, #4ade80)", color: "#fff" }}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "✅ Submit"}
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Select Image Option</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Button variant="outlined" component="label">
            📷 Capture Photo
            <input type="file" hidden accept="image/*" capture="environment" onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }} />
          </Button>
          <Button variant="outlined" component="label">
            🖼 Upload From Device
            <input type="file" hidden accept="image/*" onChange={(e) => { handleImageUpload(e.target.files[0]); setOpenImageDialog(false); }} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EMRSForm;