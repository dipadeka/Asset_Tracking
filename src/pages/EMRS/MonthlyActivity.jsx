// src/pages/EMRS/MonthlyActivity.jsx
//
// Self-contained version: the storage helpers and the "history" view that
// used to live in separate files (utils/monthlyActivityStore.js and
// Steps/MonthlyActivityHistory.jsx) are now inlined right here, so there
// is nothing extra to create — this ONE file is a full drop-in replacement.
//
// Visual theme: warm terracotta / ochre / clay palette, diamond motifs,
// and a carved-wood display font for headings. All original functionality
// is preserved.
//
// THIS REVISION
// ─────────────────────
// • FIX: exported Operational Cost PDFs were showing a stray "1" right
//   before every amount (e.g. "'30,000" instead of "₹30,000"). This
//   wasn't actually a "1" — it was the ₹ (rupee) symbol failing to
//   render, because jsPDF's default core font (Helvetica) has no glyph
//   for ₹ and silently swaps in a mismatched character instead. PDFs now
//   format amounts as "Rs. 30,000" (plain ASCII, renders correctly in
//   every PDF viewer) while the on-screen UI and Excel exports keep using
//   the real ₹ symbol, since browsers and Excel render it fine.
// • Removed the triangular zig-zag divider pattern. Every place that used
//   to show the woven/triangle strip (top & bottom of panels, under the
//   page header) now shows a single clean line instead — same accent
//   color, just simplified.
// • Draft persistence. If the user is filling out a Monthly Activity
//   (Attendance / Saksham Saturday / Operational Cost) and gets logged
//   out — or just closes the tab — before finishing, their progress is
//   auto-saved (per logged-in user) to localStorage. The next time they
//   log back in and open this page, the form is restored to the exact
//   step and data they left off at, and the "New Monthly Activity" tab
//   shows a small draft indicator dot so it's obvious there's unfinished
//   work waiting, even before opening the tab.
// • Operational Cost and Saksham Saturday can now each be exported
//   individually (Excel + PDF) per submitted month, exactly like Staff
//   and Student attendance already could.
// • The Saksham Saturday step is fully lifted into this page's state
//   instead of living only inside the child component. That means:
//     - "Students Participated" can never go negative (also enforced at
//       the input layer in Steps/Attendance.jsx).
//     - A submitted month now keeps its full Saksham Saturday report —
//       every activity, theme, resource person, students participated,
//       learning outcomes — not just a plain "Completed" flag.
//     - Photos and report files uploaded in the Post-Activity Report
//       table are kept (as data URLs) and actually shown — as real
//       thumbnails in the history view, and embedded as images in the
//       exported PDF, instead of the PDF only ever showing "Completed".
//
// DEPENDENCIES TO INSTALL (if not already present in the project):
//   npm install xlsx jspdf jspdf-autotable

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  StepConnector,
  stepConnectorClasses,
  Stack,
  Tabs,
  Tab,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  GlobalStyles,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";
import PaidIcon from "@mui/icons-material/Paid";
import InboxIcon from "@mui/icons-material/Inbox";
import CheckIcon from "@mui/icons-material/Check";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import toast from "react-hot-toast";
import Attendance, { SakshamSaturdayReport } from "./Steps/Attendance";
import OperationalCost from "./Steps/OperationalCost";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

/* ────────────────────────────────────────────────────────────────────────
   Tribal palette
   ──────────────────────────────────────────────────────────────────────── */

const PAL = {
  sand: "#F4E9D7",
  sandDark: "#EADCC0",
  clay: "#B4451F",
  clayDark: "#8C3416",
  ochre: "#DDA23A",
  ochreLight: "#EFC777",
  brown: "#5B3A24",
  brownDark: "#3A2415",
  cream: "#FBF4E8",
  ink: "#2E1D10",
};

/* ────────────────────────────────────────────────────────────────────────
   Saksham Saturday — default rows
   Kept here (mirroring the defaults inside Steps/Attendance.jsx) so this
   page can lift the Saksham Saturday planning/report state up to itself.
   Lifting it means a submitted month keeps the FULL report — activities,
   themes, resource persons, students participated, photos, report files —
   not just a boolean "completed" flag.
   ──────────────────────────────────────────────────────────────────────── */

const DEFAULT_SAKSHAM_PRE_ROWS = [
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
];

const DEFAULT_SAKSHAM_POST_ROWS = [
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
];

// Deep-clones the default Saksham Saturday rows so every reset/restore gets
// its own independent copy instead of several form instances sharing (and
// accidentally mutating) the same objects.
const cloneSakshamRows = (rows) => JSON.parse(JSON.stringify(rows));

// A Saksham Saturday activity row counts as "recorded" once it has an
// activity name, so the Not filled/Completed status and every summary
// reflect real user input rather than the pre-seeded example row.
const isRecordedSakshamRow = (row) =>
  Boolean(
    (row.activity || "").trim() ||
    (row.photos && row.photos.length) ||
    row.reportFile
  );

/* ────────────────────────────────────────────────────────────────────────
   Storage helpers (previously utils/monthlyActivityStore.js)
   Namespaced per logged-in user, so every login/role keeps its own history.
   ──────────────────────────────────────────────────────────────────────── */

const STORAGE_PREFIX = "emrs_monthly_activity__";
// Separate namespace for the auto-saved, not-yet-submitted draft, so a
// draft never gets confused with a real, completed submission.
const DRAFT_STORAGE_PREFIX = "emrs_monthly_activity_draft__";

const getCurrentUserId = () => {
  const candidateKeys = ["userId", "user_id", "username", "user", "authUser", "emrsUser"];
  for (const key of candidateKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const id = parsed?.id || parsed?.userId || parsed?.username || parsed?.email;
      if (id) return String(id);
    } catch {
      return raw;
    }
  }
  return "guest";
};

const getStorageKey = (userId) => `${STORAGE_PREFIX}${userId || getCurrentUserId()}`;
const getDraftKey = (userId) => `${DRAFT_STORAGE_PREFIX}${userId || getCurrentUserId()}`;

const readAll = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (userId, list) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
  return list;
};

const getSubmissions = (userId) =>
  readAll(userId).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

const saveSubmission = (submission, userId) => {
  const existing = readAll(userId);
  const filtered = existing.filter(
    (s) => !(s.month === submission.month && s.year === submission.year)
  );
  const entry = {
    id: `${submission.year}-${submission.month}`,
    submittedAt: new Date().toISOString(),
    ...submission,
  };
  return writeAll(userId, [...filtered, entry]);
};

const deleteSubmissionEntry = (id, userId) => {
  const existing = readAll(userId);
  return writeAll(userId, existing.filter((s) => s.id !== id));
};

/* ── Draft (in-progress, not-yet-submitted) persistence ──
   Lets a partially-filled Monthly Activity survive a logout / tab close
   and resume automatically, with a visible indicator in the tab bar. */
const readDraft = (userId) => {
  try {
    const raw = localStorage.getItem(getDraftKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeDraft = (userId, draft) => {
  try {
    localStorage.setItem(
      getDraftKey(userId),
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
    );
  } catch (err) {
    console.warn("Could not auto-save monthly activity draft:", err);
  }
};

const clearDraft = (userId) => {
  try {
    localStorage.removeItem(getDraftKey(userId));
  } catch {
    // ignore
  }
};

/* ────────────────────────────────────────────────────────────────────────
   Export helpers — individual & bulk attendance extraction (PDF / Excel)
   These work generically off whatever fields exist on each attendance row,
   so they stay compatible with however Attendance.jsx shapes its objects
   (e.g. { name, designation, daysPresent, ... } or similar).
   ──────────────────────────────────────────────────────────────────────── */

// Lazy-loaded so a missing "xlsx" / "jspdf" / "jspdf-autotable" package
// only breaks the export buttons (with a clear message) instead of
// crashing the entire page at build time.
let _xlsxPromise = null;
const loadXLSX = () => {
  if (!_xlsxPromise) _xlsxPromise = import("xlsx");
  return _xlsxPromise;
};

let _pdfPromise = null;
const loadPDF = () => {
  if (!_pdfPromise) {
    _pdfPromise = Promise.all([import("jspdf"), import("jspdf-autotable")]).then(
      ([jsPDFModule, autoTableModule]) => ({
        jsPDF: jsPDFModule.default,
        autoTable: autoTableModule.default,
      })
    );
  }
  return _pdfPromise;
};

const MISSING_DEPS_MESSAGE =
  "Export needs two packages that aren't installed yet. Run: npm install xlsx jspdf jspdf-autotable, then restart the dev server.";

const NAME_KEYS = [
  "name",
  "teacherName",
  "staffName",
  "employeeName",
  "studentName",
  "studentFullName",
  "fullName",
];

const getRecordName = (row, idx = 0) => {
  for (const key of NAME_KEYS) {
    if (row && row[key]) return String(row[key]);
  }
  return `Record ${idx + 1}`;
};

const slugify = (text) =>
  String(text || "record")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "record";

const humanizeKey = (key) =>
  String(key)
    .replace(/^__/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

// Export ONE person's row (a single teacher or student) as an Excel file
const exportRowToExcel = async (row, { fileName, sheetName = "Record" }) => {
  try {
    const XLSX = await loadXLSX();
    const clean = Object.fromEntries(Object.entries(row || {}).filter(([k]) => !k.startsWith("__")));
    const ws = XLSX.utils.json_to_sheet([clean]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || "Record");
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

// Export ONE person's row as a PDF (field / value table)
const exportRowToPDF = async (row, { title, fileName }) => {
  try {
    const { jsPDF, autoTable } = await loadPDF();
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 16);
    const entries = Object.entries(row || {}).filter(([k]) => !k.startsWith("__"));
    autoTable(doc, {
      startY: 22,
      head: [["Field", "Value"]],
      body: entries.map(([k, v]) => [humanizeKey(k), v === null || v === undefined || v === "" ? "—" : String(v)]),
      headStyles: { fillColor: [180, 69, 31] },
      styles: { fontSize: 9 },
    });
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

// Export MANY rows (e.g. every teacher for a month, or one teacher across
// every submitted month) into a single Excel sheet
const exportRowsToExcel = async (rows, { fileName, sheetName = "Records" }) => {
  try {
    const XLSX = await loadXLSX();
    const clean = rows.map((r) => Object.fromEntries(Object.entries(r || {}).filter(([k]) => !k.startsWith("__"))));
    const ws = XLSX.utils.json_to_sheet(clean);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || "Records");
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

// Export MANY rows into a single PDF table
const exportRowsToPDF = async (rows, { title, fileName }) => {
  try {
    const { jsPDF, autoTable } = await loadPDF();
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 16);
    if (rows.length) {
      const columns = Array.from(
        rows.reduce((set, r) => {
          Object.keys(r || {}).forEach((k) => {
            if (!k.startsWith("__")) set.add(k);
          });
          return set;
        }, new Set())
      );
      autoTable(doc, {
        startY: 22,
        head: [columns.map(humanizeKey)],
        body: rows.map((r) => columns.map((c) => (r[c] === null || r[c] === undefined || r[c] === "" ? "—" : String(r[c])))),
        headStyles: { fillColor: [180, 69, 31] },
        styles: { fontSize: 8 },
      });
    } else {
      doc.setFontSize(11);
      doc.text("No records found.", 14, 26);
    }
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

/* ── Operational Cost export helpers ──
   Exports the operational cost entries recorded for one submitted month. */
const exportOperationalCostToExcel = async (rows, { month, year, fileName }) => {
  try {
    const XLSX = await loadXLSX();
    const cleanRows = (rows || [])
      .filter((r) => r.amount || r.costType || r.month || r.year)
      .map((r) => ({
        Year: r.year || year,
        Month: r.month || month,
        "Cost Type": r.costType || "—",
        Amount: r.amount || 0,
      }));
    const ws = XLSX.utils.json_to_sheet(
      cleanRows.length ? cleanRows : [{ Year: year, Month: month, "Cost Type": "—", Amount: 0 }]
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operational Cost");
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

const exportOperationalCostToPDF = async (rows, { month, year, fileName }) => {
  try {
    const { jsPDF, autoTable } = await loadPDF();
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Operational Cost — ${month} ${year}`, 14, 16);

    const cleanRows = (rows || []).filter((r) => r.amount || r.costType || r.month || r.year);

    if (cleanRows.length) {
      autoTable(doc, {
        startY: 22,
        head: [["Year", "Month", "Cost Type", "Amount"]],
        body: cleanRows.map((r) => [
          r.year || year,
          r.month || month,
          r.costType || "—",
          // PDF text uses "Rs." instead of the ₹ symbol — jsPDF's default
          // core font has no ₹ glyph, so the real symbol renders as a
          // broken/mismatched character (it showed up as a stray "1"
          // right before the amount). currencyPDF() below is ASCII-only
          // and renders correctly in every PDF viewer.
          r.amount ? currencyPDF(r.amount) : "—",
        ]),
        headStyles: { fillColor: [180, 69, 31] },
        styles: { fontSize: 9 },
      });
      const total = cleanRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 32;
      doc.setFontSize(11);
      doc.text(`Total Operational Cost: ${currencyPDF(total)}`, 14, finalY);
    } else {
      doc.setFontSize(11);
      doc.text("No operational cost entries recorded for this month.", 14, 26);
    }
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

/* ── Saksham Saturday export helpers ──
   The stored submission now keeps the FULL pre/post-activity planning and
   report data (not just a completed/not-filled flag), so the export shows
   every activity — theme, class, resource person, students participated,
   learning outcomes — and, for the PDF, the actual uploaded photos
   embedded as images. */
const getSakshamActivityRows = (entry) =>
  (entry.sakshamPostPlanningRows || []).filter(isRecordedSakshamRow);

const exportSakshamToExcel = async (entry, { fileName }) => {
  try {
    const XLSX = await loadXLSX();
    const activityRows = getSakshamActivityRows(entry);
    const sheetRows = activityRows.length
      ? activityRows.map((r) => ({
          "Month / Week": r.monthWeek || "—",
          Class: r.className || "—",
          "Theme Category": r.themeCategory || "—",
          Activity: r.activity || "—",
          "Resource Person": r.resourcePersons || "—",
          "Students Participated": r.studentsParticipated || 0,
          "Learning Objectives": r.learningObjectives || "—",
          "Resources Required": r.resourcesRequired || "—",
          "Pre-Activity Planning": r.preActivityPlanning || "—",
          "Execution During Activity": r.executionDuringActivity || "—",
          "Learning Outcomes / Assessment": r.learningOutcomesAssessment || "—",
          "Photos Uploaded": r.photos?.length ? r.photos.map((p) => p.name).join(", ") : "None",
          "Report File": r.reportFile?.name || "None",
        }))
      : [{ Month: entry.month, Year: entry.year, Status: "Not filled" }];
    const ws = XLSX.utils.json_to_sheet(sheetRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Saksham Saturday");
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

const exportSakshamToPDF = async (entry, { fileName }) => {
  try {
    const { jsPDF, autoTable } = await loadPDF();
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Saksham Saturday — ${entry.month} ${entry.year}`, 14, 16);

    const activityRows = getSakshamActivityRows(entry);

    if (!activityRows.length) {
      doc.setFontSize(11);
      doc.text("No Saksham Saturday activities recorded for this month.", 14, 26);
      doc.save(fileName);
      return;
    }

    // Summary table — one row per activity
    autoTable(doc, {
      startY: 22,
      head: [["Week", "Class", "Theme", "Activity", "Resource Person", "Students", "Photos"]],
      body: activityRows.map((r) => [
        r.monthWeek || "—",
        r.className || "—",
        r.themeCategory || "—",
        r.activity || "—",
        r.resourcePersons || "—",
        String(r.studentsParticipated || 0),
        r.photos?.length ? `${r.photos.length} photo(s)` : "None",
      ]),
      headStyles: { fillColor: [180, 69, 31] },
      styles: { fontSize: 8 },
    });

    // Detail section per activity — learning outcomes text plus the
    // actual uploaded photos, embedded as images (this is what used to
    // be missing: the PDF previously only ever showed "Completed").
    let cursorY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 40;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    activityRows.forEach((r, idx) => {
      if (cursorY > pageHeight - 40) {
        doc.addPage();
        cursorY = 16;
      }
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text(`${idx + 1}. ${r.activity || "Untitled activity"} (${r.monthWeek || "—"})`, 14, cursorY);
      doc.setFont(undefined, "normal");
      cursorY += 6;
      doc.setFontSize(9);

      if (r.learningOutcomesAssessment) {
        const lines = doc.splitTextToSize(`Outcome: ${r.learningOutcomesAssessment}`, pageWidth - 28);
        doc.text(lines, 14, cursorY);
        cursorY += lines.length * 5 + 2;
      }

      if (r.photos && r.photos.length) {
        let x = 14;
        const imgSize = 30;
        r.photos.forEach((p) => {
          if (x + imgSize > pageWidth - 14) {
            x = 14;
            cursorY += imgSize + 4;
          }
          if (cursorY + imgSize > pageHeight - 14) {
            doc.addPage();
            cursorY = 16;
            x = 14;
          }
          try {
            const format = p.dataUrl?.includes("image/png") ? "PNG" : "JPEG";
            doc.addImage(p.dataUrl, format, x, cursorY, imgSize, imgSize);
          } catch {
            // Skip photos that can't be embedded (unsupported format, corrupted data, etc.)
          }
          x += imgSize + 4;
        });
        cursorY += imgSize + 8;
      } else {
        cursorY += 4;
      }
      cursorY += 4;
    });

    doc.save(fileName);
  } catch (err) {
    console.error(err);
    toast.error(MISSING_DEPS_MESSAGE);
  }
};

/* Small reusable pair of Excel / PDF export icon buttons */
const ExportIconButtons = ({ onExcel, onPdf, size = "small" }) => (
  <Stack direction="row" spacing={0.5}>
    <Tooltip title="Export to Excel">
      <IconButton
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          onExcel();
        }}
        sx={{
          color: "#3F7D3A",
          border: `1.5px solid ${PAL.ochre}`,
          "&:hover": { bgcolor: "#E6F0DF", borderColor: "#3F7D3A" },
        }}
      >
        <GridOnIcon fontSize={size} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Export to PDF">
      <IconButton
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          onPdf();
        }}
        sx={{
          color: PAL.clay,
          border: `1.5px solid ${PAL.ochre}`,
          "&:hover": { bgcolor: "#F9E1DC", borderColor: PAL.clay },
        }}
      >
        <PictureAsPdfIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  </Stack>
);

/* ────────────────────────────────────────────────────────────────────────
   Decorative primitives — single-line divider (replaces the old
   triangular zig-zag strip) & diamond motifs
   ──────────────────────────────────────────────────────────────────────── */

// A plain, single accent-colored rule. Same slot/props as the old
// ZigZagDivider (color, height) so every call site below still works,
// but it now renders one clean line instead of a row of triangles.
const ZigZagDivider = ({ color = PAL.clay, height = 14 }) => (
  <Box
    aria-hidden
    sx={{
      width: "100%",
      height: Math.max(2, Math.round(height / 4)),
      backgroundColor: color,
      opacity: 0.9,
    }}
  />
);

const DiamondBullet = ({ size = 10, color = PAL.ochre }) => (
  <Box
    aria-hidden
    sx={{
      width: size,
      height: size,
      bgcolor: color,
      transform: "rotate(45deg)",
      flexShrink: 0,
      borderRadius: "2px",
      boxShadow: `0 0 0 2px ${PAL.cream}`,
    }}
  />
);

const CarvedPanel = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: 18,
  border: `2px solid ${PAL.ochre}`,
  background: PAL.cream,
  boxShadow: "0 6px 0 rgba(91,58,36,0.18), 0 10px 24px rgba(58,36,21,0.12)",
  overflow: "hidden",
}));

/* Custom stepper connector — a dotted "beaded thread" line */
const BeadedConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 3,
    borderStyle: "dashed",
    borderColor: PAL.ochre,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: PAL.clay,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: PAL.clay,
  },
}));

/* Custom step "icon" — a carved diamond badge with the step number */
const StepBadge = styled("div")(({ ownerState }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Poppins', sans-serif",
  fontSize: 15,
  color: ownerState.active || ownerState.completed ? PAL.cream : PAL.brown,
  background: ownerState.completed
    ? `linear-gradient(145deg, ${PAL.clay}, ${PAL.clayDark})`
    : ownerState.active
    ? `linear-gradient(145deg, ${PAL.ochreLight}, ${PAL.ochre})`
    : PAL.sandDark,
  border: `2px solid ${ownerState.active || ownerState.completed ? PAL.clayDark : PAL.ochre}`,
  boxShadow: "0 3px 0 rgba(58,36,21,0.25)",
}));

const TribalStepIcon = (props) => {
  const { active, completed, icon } = props;
  return (
    <StepBadge ownerState={{ active, completed }}>
      {completed ? <CheckIcon fontSize="small" /> : icon}
    </StepBadge>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Attendance records list — shown inside each month's accordion.
   Lists every individual teacher / student row with its own export
   buttons, plus one "export all" pair for the whole section.
   ──────────────────────────────────────────────────────────────────────── */

const AttendanceRecordsList = ({ rows = [], month, year, kind, icon }) => {
  if (!rows.length) return null;

  return (
    <Box sx={{ mt: 2.5 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap={1}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: PAL.clayDark }}>
            {kind} Attendance — Individual Records
          </Typography>
          <Chip
            size="small"
            label={`${rows.length} ${kind === "Staff" ? "teacher" : "student"}${rows.length > 1 ? "s" : ""}`}
            sx={{ bgcolor: PAL.ochreLight, color: PAL.brownDark, fontWeight: 700 }}
          />
        </Stack>
        <Tooltip title={`Export every ${kind.toLowerCase()} record for ${month} ${year}`}>
          <span>
            <ExportIconButtons
              onExcel={() =>
                exportRowsToExcel(rows, {
                  fileName: `${slugify(kind)}_attendance_${slugify(month)}_${year}.xlsx`,
                  sheetName: `${kind} ${month} ${year}`,
                })
              }
              onPdf={() =>
                exportRowsToPDF(rows, {
                  title: `${kind} Attendance — ${month} ${year} (All)`,
                  fileName: `${slugify(kind)}_attendance_${slugify(month)}_${year}.pdf`,
                })
              }
            />
          </span>
        </Tooltip>
      </Stack>

      <Stack
        spacing={1}
        sx={{
          maxHeight: 260,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {rows.map((row, idx) => {
          const label = getRecordName(row, idx);
          return (
            <Stack
              key={idx}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              rowGap={0.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: PAL.sand,
                border: `1px solid ${PAL.ochreLight}`,
              }}
            >
              <Typography variant="body2" fontWeight={700} sx={{ color: PAL.ink }}>
                {label}
              </Typography>
              <ExportIconButtons
                onExcel={() =>
                  exportRowToExcel(row, {
                    fileName: `${slugify(label)}_${slugify(month)}_${year}.xlsx`,
                    sheetName: label,
                  })
                }
                onPdf={() =>
                  exportRowToPDF(row, {
                    title: `${label} — ${kind} Attendance (${month} ${year})`,
                    fileName: `${slugify(label)}_${slugify(month)}_${year}.pdf`,
                  })
                }
              />
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Operational Cost section — shown inside each month's accordion.
   Lists every cost entry recorded for that month plus a running total,
   with an "export all" pair (Excel + PDF) for the whole section.
   ──────────────────────────────────────────────────────────────────────── */

// On-screen / Excel currency formatting — the real ₹ symbol. Browsers and
// Excel both render this correctly.
const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );

// PDF-safe currency formatting — plain ASCII "Rs." prefix instead of the ₹
// symbol. jsPDF's default core font (Helvetica) has no ₹ glyph, so text
// containing the real symbol renders as a broken/mismatched character in
// the exported PDF (it showed up as a stray "1" right before the amount).
// Use this helper anywhere a value is written directly into a PDF via
// doc.text(...) or an autoTable cell.
const currencyPDF = (n) =>
  `Rs. ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(n) || 0)}`;

const OperationalCostSection = ({ rows = [], month, year }) => {
  const cleanRows = (rows || []).filter((r) => r.amount || r.costType || r.month || r.year);
  const total = cleanRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <Box sx={{ mt: 2.5 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap={1}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <PaidIcon fontSize="small" sx={{ color: PAL.clay }} />
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: PAL.clayDark }}>
            Operational Cost — {month} {year}
          </Typography>
          <Chip
            size="small"
            label={`${cleanRows.length} entr${cleanRows.length === 1 ? "y" : "ies"}`}
            sx={{ bgcolor: PAL.ochreLight, color: PAL.brownDark, fontWeight: 700 }}
          />
        </Stack>
        <Tooltip title={`Export operational cost for ${month} ${year}`}>
          <span>
            <ExportIconButtons
              onExcel={() =>
                exportOperationalCostToExcel(rows, {
                  month,
                  year,
                  fileName: `operational_cost_${slugify(month)}_${year}.xlsx`,
                })
              }
              onPdf={() =>
                exportOperationalCostToPDF(rows, {
                  month,
                  year,
                  fileName: `operational_cost_${slugify(month)}_${year}.pdf`,
                })
              }
            />
          </span>
        </Tooltip>
      </Stack>

      {cleanRows.length > 0 ? (
        <Stack spacing={1} sx={{ maxHeight: 220, overflowY: "auto", pr: 0.5 }}>
          {cleanRows.map((row, idx) => (
            <Stack
              key={idx}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              rowGap={0.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: PAL.sand,
                border: `1px solid ${PAL.ochreLight}`,
              }}
            >
              <Typography variant="body2" fontWeight={700} sx={{ color: PAL.ink }}>
                {row.costType || "Untitled"}
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: PAL.clayDark }}>
                {currency(row.amount)}
              </Typography>
            </Stack>
          ))}
          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 0.5 }}>
            <Typography variant="body2" fontWeight={800} sx={{ color: PAL.ink }}>
              Total: {currency(total)}
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.7 }}>
          No operational cost entries recorded for this month.
        </Typography>
      )}
    </Box>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Saksham Saturday section — shown inside each month's accordion.
   Now shows the FULL report for the month: every recorded activity
   (theme, class, resource person, students participated, outcomes) and
   the actual uploaded photos as thumbnails — not just a status chip.
   ──────────────────────────────────────────────────────────────────────── */

const SakshamSaturdaySection = ({ entry }) => {
  const activityRows = getSakshamActivityRows(entry);
  const hasActivity = activityRows.length > 0;
  const totalPhotos = activityRows.reduce((sum, r) => sum + (r.photos?.length || 0), 0);
  const totalStudents = activityRows.reduce((sum, r) => sum + (Number(r.studentsParticipated) || 0), 0);

  return (
    <Box sx={{ mt: 2.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CelebrationIcon fontSize="small" sx={{ color: PAL.clay }} />
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: PAL.clayDark }}>
            Saksham Saturday — {entry.month} {entry.year}
          </Typography>
          <Chip
            size="small"
            label={hasActivity ? `${activityRows.length} activit${activityRows.length > 1 ? "ies" : "y"} recorded` : "Not filled"}
            sx={{
              bgcolor: hasActivity ? "#DCEEDB" : "#F3E3D3",
              color: hasActivity ? "#2E7D32" : PAL.brownDark,
              fontWeight: 700,
            }}
          />
        </Stack>
        <Tooltip title={`Export Saksham Saturday report for ${entry.month} ${entry.year}`}>
          <span>
            <ExportIconButtons
              onExcel={() =>
                exportSakshamToExcel(entry, {
                  fileName: `saksham_saturday_${slugify(entry.month)}_${entry.year}.xlsx`,
                })
              }
              onPdf={() =>
                exportSakshamToPDF(entry, {
                  fileName: `saksham_saturday_${slugify(entry.month)}_${entry.year}.pdf`,
                })
              }
            />
          </span>
        </Tooltip>
      </Stack>

      {hasActivity ? (
        <>
          <Grid container spacing={1.5} sx={{ mt: 0.5, mb: 1.5 }}>
            <Grid item xs={6} sm={4}>
              <SummaryStat icon={<GroupsIcon fontSize="small" />} label="Total students participated" value={totalStudents} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <SummaryStat icon={<GridOnIcon fontSize="small" />} label="Photos uploaded" value={totalPhotos} />
            </Grid>
          </Grid>

          <Stack spacing={1.25} sx={{ maxHeight: 440, overflowY: "auto", pr: 0.5 }}>
            {activityRows.map((row, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 2, borderColor: PAL.ochreLight, bgcolor: PAL.sand }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" rowGap={0.5}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} sx={{ color: PAL.ink }}>
                      {row.activity || "Untitled activity"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: PAL.brown }}>
                      {row.monthWeek || "—"} · Class {row.className || "—"} · {row.themeCategory || "—"}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`${row.studentsParticipated || 0} student${Number(row.studentsParticipated) === 1 ? "" : "s"}`}
                    sx={{ bgcolor: PAL.ochreLight, color: PAL.brownDark, fontWeight: 700 }}
                  />
                </Stack>

                {row.resourcePersons && (
                  <Typography variant="caption" sx={{ display: "block", color: PAL.brown, mt: 0.5 }}>
                    Resource person: {row.resourcePersons}
                  </Typography>
                )}
                {row.learningOutcomesAssessment && (
                  <Typography variant="body2" sx={{ color: PAL.ink, mt: 0.5 }}>
                    {row.learningOutcomesAssessment}
                  </Typography>
                )}

                {row.photos && row.photos.length > 0 && (
                  <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1 }}>
                    {row.photos.map((p, pIdx) => (
                      <Box
                        key={pIdx}
                        component="img"
                        src={p.dataUrl}
                        alt={p.name}
                        sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: 1.5, border: `1px solid ${PAL.ochre}` }}
                      />
                    ))}
                  </Box>
                )}

                {row.reportFile && (
                  <Button
                    size="small"
                    component="a"
                    href={row.reportFile.dataUrl}
                    download={row.reportFile.name}
                    sx={{ mt: 1, color: PAL.clay, textTransform: "none", fontWeight: 700, px: 0 }}
                  >
                    Download report: {row.reportFile.name}
                  </Button>
                )}
              </Paper>
            ))}
          </Stack>
        </>
      ) : (
        <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.7, mt: 1 }}>
          No Saksham Saturday activities recorded for this month.
        </Typography>
      )}
    </Box>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   History view (previously Steps/MonthlyActivityHistory.jsx)
   ──────────────────────────────────────────────────────────────────────── */

const SummaryStat = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: PAL.sand,
        color: PAL.clay,
        border: `1.5px solid ${PAL.ochre}`,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ display: "block", lineHeight: 1.2, color: PAL.brown, opacity: 0.75 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" fontWeight={800} sx={{ color: PAL.ink }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const MonthlyActivityHistory = ({ submissions = [], onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const groupedByYear = useMemo(() => {
    const groups = {};
    submissions.forEach((s) => {
      const year = s.year || "Unknown";
      if (!groups[year]) groups[year] = [];
      groups[year].push(s);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [submissions]);

  if (submissions.length === 0) {
    return (
      <CarvedPanel elevation={0} sx={{ p: 5, textAlign: "center" }}>
        <ZigZagDivider height={10} />
        <Box sx={{ py: 2 }}>
          <InboxIcon sx={{ fontSize: 44, color: PAL.ochre, mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: PAL.brown, fontFamily: "'Poppins', sans-serif", letterSpacing: 0.5 }}>
            No monthly activity submitted yet
          </Typography>
          <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.75, mt: 0.5 }}>
            Once you submit a monthly activity, it will show up here — organized month by month.
          </Typography>
        </Box>
        <ZigZagDivider height={10} />
      </CarvedPanel>
    );
  }

  return (
    <Box>
      {groupedByYear.map(([year, entries]) => (
        <Box key={year} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.75 }}>
            <DiamondBullet />
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: PAL.clayDark, fontFamily: "'Poppins', sans-serif", letterSpacing: 1 }}
            >
              {year}
            </Typography>
            <Divider sx={{ flexGrow: 1, borderColor: PAL.ochre, borderBottomWidth: 2 }} />
            <Chip
              size="small"
              label={`${entries.length} month${entries.length > 1 ? "s" : ""}`}
              sx={{ bgcolor: PAL.ochreLight, color: PAL.brownDark, fontWeight: 700 }}
            />
          </Stack>

          <Stack spacing={1.75}>
            {entries
              .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
              .map((entry) => {
                const panelId = entry.id || `${entry.year}-${entry.month}-${entry.submittedAt}`;
                const totalCost = (entry.operationalCostRows || []).reduce(
                  (sum, r) => sum + (Number(r.amount) || 0),
                  0
                );
                const sakshamActivityCount = getSakshamActivityRows(entry).length;

                return (
                  <Accordion
                    key={panelId}
                    expanded={expanded === panelId}
                    onChange={(_, isOpen) => setExpanded(isOpen ? panelId : false)}
                    elevation={0}
                    disableGutters
                    sx={{
                      border: `2px solid ${PAL.ochre}`,
                      borderRadius: "14px !important",
                      overflow: "hidden",
                      background: PAL.cream,
                      "&:before": { display: "none" },
                      "&:hover": { borderColor: PAL.clay },
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: PAL.clay }} />}
                      sx={{
                        bgcolor: PAL.sand,
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: PAL.clay,
                            color: PAL.cream,
                            border: `2px solid ${PAL.clayDark}`,
                          }}
                        >
                          <EventAvailableIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800} sx={{ color: PAL.ink, fontFamily: "'Poppins', sans-serif" }}>
                            {entry.month} {entry.year}
                          </Typography>
                          <Typography variant="caption" sx={{ color: PAL.brown, opacity: 0.75 }}>
                            Submitted{" "}
                            {new Date(entry.submittedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        size="small"
                        label="Submitted"
                        sx={{ bgcolor: "#E7DCC3", color: PAL.clayDark, fontWeight: 700, border: `1px solid ${PAL.ochre}` }}
                      />
                    </AccordionSummary>

                    <AccordionDetails sx={{ borderTop: `1px dashed ${PAL.ochre}`, pt: 2.5, bgcolor: PAL.cream }}>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<GroupsIcon fontSize="small" />}
                            label="Staff attendance rows"
                            value={(entry.staffAttendanceRows || []).length}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<SchoolIcon fontSize="small" />}
                            label="Student attendance rows"
                            value={(entry.studentAttendanceData || []).length}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<CelebrationIcon fontSize="small" />}
                            label="Saksham Saturday"
                            value={sakshamActivityCount > 0 ? `${sakshamActivityCount} activit${sakshamActivityCount > 1 ? "ies" : "y"}` : "Not filled"}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat icon={<PaidIcon fontSize="small" />} label="Operational cost" value={currency(totalCost)} />
                        </Grid>
                      </Grid>

                      {/* Individual teacher / student export */}
                      <AttendanceRecordsList
                        rows={entry.staffAttendanceRows}
                        month={entry.month}
                        year={entry.year}
                        kind="Staff"
                        icon={<GroupsIcon fontSize="small" sx={{ color: PAL.clay }} />}
                      />
                      <AttendanceRecordsList
                        rows={entry.studentAttendanceData}
                        month={entry.month}
                        year={entry.year}
                        kind="Student"
                        icon={<SchoolIcon fontSize="small" sx={{ color: PAL.clay }} />}
                      />

                      {/* Saksham Saturday — full activity report, photos and
                          all, individually exportable, matching Attendance. */}
                      <SakshamSaturdaySection entry={entry} />

                      <OperationalCostSection
                        rows={entry.operationalCostRows}
                        month={entry.month}
                        year={entry.year}
                      />

                      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2.5 }}>
                        <Tooltip title="Delete this month's record">
                          <IconButton
                            size="small"
                            onClick={() => onDelete && onDelete(panelId)}
                            sx={{
                              color: PAL.clay,
                              border: `1.5px solid ${PAL.ochre}`,
                              "&:hover": { bgcolor: "#F5DCC9", borderColor: PAL.clay },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Teacher & Student Register — admin-wide tracking view.
   Aggregates every submitted month so an admin can pick ANY teacher or
   student and see (and export) their complete attendance history, not
   just what happened in a single month.
   ──────────────────────────────────────────────────────────────────────── */

const buildRegister = (submissions, key) => {
  const map = new Map();
  submissions.forEach((sub) => {
    (sub[key] || []).forEach((row, idx) => {
      const name = getRecordName(row, idx);
      if (!map.has(name)) map.set(name, []);
      map.get(name).push({ ...row, __month: sub.month, __year: sub.year });
    });
  });
  return Array.from(map.entries())
    .map(([name, records]) => ({
      name,
      records: records.sort((a, b) => `${b.__year}-${b.__month}`.localeCompare(`${a.__year}-${a.__month}`)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const TeacherStudentRegister = ({ submissions }) => {
  const [personType, setPersonType] = useState("staff"); // 'staff' | 'student'
  const [selectedName, setSelectedName] = useState(null);
  const [search, setSearch] = useState("");

  const staffRegister = useMemo(() => buildRegister(submissions, "staffAttendanceRows"), [submissions]);
  const studentRegister = useMemo(() => buildRegister(submissions, "studentAttendanceData"), [submissions]);
  const register = personType === "staff" ? staffRegister : studentRegister;

  const filtered = useMemo(
    () => register.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [register, search]
  );

  const selected = register.find((p) => p.name === selectedName);

  useEffect(() => {
    setSelectedName(null);
    setSearch("");
  }, [personType]);

  if (submissions.length === 0) {
    return (
      <CarvedPanel elevation={0} sx={{ p: 5, textAlign: "center" }}>
        <ZigZagDivider height={10} />
        <Box sx={{ py: 2 }}>
          <AssignmentIndIcon sx={{ fontSize: 44, color: PAL.ochre, mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: PAL.brown, fontFamily: "'Poppins', sans-serif", letterSpacing: 0.5 }}>
            Nothing to track yet
          </Typography>
          <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.75, mt: 0.5 }}>
            Once monthly activities are submitted, every teacher and student will appear here with their
            full attendance history, ready to export.
          </Typography>
        </Box>
        <ZigZagDivider height={10} />
      </CarvedPanel>
    );
  }

  return (
    <CarvedPanel elevation={0}>
      <ZigZagDivider color={PAL.ochre} height={10} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }} flexWrap="wrap" rowGap={1}>
          <Chip
            clickable
            icon={<GroupsIcon />}
            label={`Teachers (${staffRegister.length})`}
            onClick={() => setPersonType("staff")}
            sx={{
              fontWeight: 700,
              bgcolor: personType === "staff" ? PAL.clay : PAL.sand,
              color: personType === "staff" ? PAL.cream : PAL.brownDark,
              border: `1.5px solid ${PAL.ochre}`,
              px: 1,
            }}
          />
          <Chip
            clickable
            icon={<SchoolIcon />}
            label={`Students (${studentRegister.length})`}
            onClick={() => setPersonType("student")}
            sx={{
              fontWeight: 700,
              bgcolor: personType === "student" ? PAL.clay : PAL.sand,
              color: personType === "student" ? PAL.cream : PAL.brownDark,
              border: `1.5px solid ${PAL.ochre}`,
              px: 1,
            }}
          />
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder={`Search ${personType === "staff" ? "teacher" : "student"} name...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                mb: 1.5,
                "& .MuiOutlinedInput-root": { bgcolor: PAL.cream },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: PAL.ochre },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PAL.clay },
              }}
            />
            <List
              sx={{
                maxHeight: 440,
                overflowY: "auto",
                border: `1.5px solid ${PAL.ochreLight}`,
                borderRadius: 2,
                bgcolor: PAL.cream,
                p: 0,
              }}
            >
              {filtered.length === 0 && (
                <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.7, p: 2 }}>
                  No matches.
                </Typography>
              )}
              {filtered.map((p) => (
                <ListItemButton
                  key={p.name}
                  selected={selectedName === p.name}
                  onClick={() => setSelectedName(p.name)}
                  sx={{
                    borderBottom: `1px dashed ${PAL.ochreLight}`,
                    "&.Mui-selected": { bgcolor: PAL.sand },
                    "&.Mui-selected:hover": { bgcolor: PAL.sand },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: PAL.clay }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={p.name}
                    secondary={`${p.records.length} month${p.records.length > 1 ? "s" : ""} recorded`}
                    primaryTypographyProps={{ fontWeight: 700, color: PAL.ink, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12, color: PAL.brown }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={8}>
            {selected ? (
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" rowGap={1} sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <AssignmentIndIcon sx={{ color: PAL.clay }} />
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: PAL.ink }}>
                      {selected.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={personType === "staff" ? "Teacher" : "Student"}
                      sx={{ bgcolor: PAL.ochreLight, color: PAL.brownDark, fontWeight: 700 }}
                    />
                  </Stack>
                  <Tooltip title="Export this person's complete attendance history">
                    <span>
                      <ExportIconButtons
                        onExcel={() =>
                          exportRowsToExcel(selected.records, {
                            fileName: `${slugify(selected.name)}_full_attendance_record.xlsx`,
                            sheetName: selected.name,
                          })
                        }
                        onPdf={() =>
                          exportRowsToPDF(selected.records, {
                            title: `${selected.name} — Full Attendance Record`,
                            fileName: `${slugify(selected.name)}_full_attendance_record.pdf`,
                          })
                        }
                      />
                    </span>
                  </Tooltip>
                </Stack>

                <Stack spacing={1.25} sx={{ maxHeight: 480, overflowY: "auto", pr: 0.5 }}>
                  {selected.records.map((rec, idx) => (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        borderColor: PAL.ochreLight,
                        bgcolor: PAL.sand,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: PAL.clayDark }}>
                          {rec.__month} {rec.__year}
                        </Typography>
                        <ExportIconButtons
                          onExcel={() =>
                            exportRowToExcel(rec, {
                              fileName: `${slugify(selected.name)}_${slugify(rec.__month)}_${rec.__year}.xlsx`,
                              sheetName: selected.name,
                            })
                          }
                          onPdf={() =>
                            exportRowToPDF(rec, {
                              title: `${selected.name} — ${rec.__month} ${rec.__year}`,
                              fileName: `${slugify(selected.name)}_${slugify(rec.__month)}_${rec.__year}.pdf`,
                            })
                          }
                        />
                      </Stack>
                      <Grid container spacing={1}>
                        {Object.entries(rec)
                          .filter(([k]) => !k.startsWith("__"))
                          .map(([k, v]) => (
                            <Grid item xs={6} sm={4} key={k}>
                              <Typography variant="caption" sx={{ color: PAL.brown, opacity: 0.7, display: "block" }}>
                                {humanizeKey(k)}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: PAL.ink }}>
                                {v === null || v === undefined || v === "" ? "—" : String(v)}
                              </Typography>
                            </Grid>
                          ))}
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  minHeight: 260,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: `1.5px dashed ${PAL.ochre}`,
                  borderRadius: 2,
                  color: PAL.brown,
                  opacity: 0.85,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <PersonIcon sx={{ fontSize: 36, mb: 1, color: PAL.ochre }} />
                <Typography variant="body2" fontWeight={600}>
                  Select a {personType === "staff" ? "teacher" : "student"} on the left to view and export
                  their complete attendance record across every submitted month.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <ZigZagDivider color={PAL.ochre} height={10} />
    </CarvedPanel>
  );
};

/* ────────────────────────────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────────────────────────────── */

const MonthlyActivity = () => {
  const steps = [
    { label: "Attendance" },
    { label: "Saksham Saturday" },
    { label: "Operational Cost" },
  ];

  const [activeTab, setActiveTab] = useState("form");
  const [activeStep, setActiveStep] = useState(0);

  const userId = useMemo(() => getCurrentUserId(), []);

  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    setSubmissions(getSubmissions(userId));
  }, [userId]);

  const [reportingMonth, setReportingMonth] = useState(MONTHS[new Date().getMonth()]);
  const [reportingYear, setReportingYear] = useState(currentYear);

  const [staffAttendanceRows, setStaffAttendanceRows] = useState([]);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [sakshamPrePlanningRows, setSakshamPrePlanningRows] = useState(() => cloneSakshamRows(DEFAULT_SAKSHAM_PRE_ROWS));
  const [sakshamPostPlanningRows, setSakshamPostPlanningRows] = useState(() => cloneSakshamRows(DEFAULT_SAKSHAM_POST_ROWS));
  const [operationalCostRows, setOperationalCostRows] = useState([
    { year: "", month: "", costType: "", amount: "" },
  ]);

  const alreadySubmittedThisMonth = submissions.some(
    (s) => s.month === reportingMonth && s.year === reportingYear
  );

  /* ─────────────────────────────────────────────────────────────────
     DRAFT PERSISTENCE — auto-save the in-progress Monthly Activity
     (whichever of the 3 steps the user is on) so that if they get
     logged out — or just close the tab — before submitting, the next
     time they log back in and open this page everything is restored
     exactly as they left it, and the "New Monthly Activity" tab shows
     a small dot indicator so it's obvious there's unfinished work.
  ───────────────────────────────────────────────────────────────── */
  const [hasDraft, setHasDraft] = useState(false);
  const draftRestoreAttemptedRef = useRef(false);

  // Restore a previously saved draft once, on mount / when the user changes.
  useEffect(() => {
    draftRestoreAttemptedRef.current = false;
    const draft = readDraft(userId);
    if (draft) {
      setReportingMonth(draft.reportingMonth || MONTHS[new Date().getMonth()]);
      setReportingYear(draft.reportingYear || currentYear);
      setActiveStep(draft.activeStep || 0);
      setStaffAttendanceRows(draft.staffAttendanceRows || []);
      setStudentAttendanceData(draft.studentAttendanceData || []);
      setSakshamPrePlanningRows(
        draft.sakshamPrePlanningRows && draft.sakshamPrePlanningRows.length
          ? draft.sakshamPrePlanningRows
          : cloneSakshamRows(DEFAULT_SAKSHAM_PRE_ROWS)
      );
      setSakshamPostPlanningRows(
        draft.sakshamPostPlanningRows && draft.sakshamPostPlanningRows.length
          ? draft.sakshamPostPlanningRows
          : cloneSakshamRows(DEFAULT_SAKSHAM_POST_ROWS)
      );
      setOperationalCostRows(
        draft.operationalCostRows && draft.operationalCostRows.length
          ? draft.operationalCostRows
          : [{ year: "", month: "", costType: "", amount: "" }]
      );
      setActiveTab("form");
      setHasDraft(true);
      toast.success(
        `Resumed your unfinished monthly activity for ${draft.reportingMonth || ""} ${draft.reportingYear || ""} (Step ${(draft.activeStep || 0) + 1} of ${steps.length}).`
      );
    } else {
      setHasDraft(false);
    }
    draftRestoreAttemptedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Auto-save (debounced) whenever the in-progress form actually has
  // something in it. If the user hasn't touched anything yet (still on
  // step 0 with everything blank, and the Saksham Saturday tables still
  // match their pre-seeded example row) we don't bother writing a draft,
  // and we clean up any stale empty draft.
  useEffect(() => {
    if (!draftRestoreAttemptedRef.current) return;

    const sakshamChanged =
      JSON.stringify(sakshamPrePlanningRows) !== JSON.stringify(DEFAULT_SAKSHAM_PRE_ROWS) ||
      JSON.stringify(sakshamPostPlanningRows) !== JSON.stringify(DEFAULT_SAKSHAM_POST_ROWS);

    const hasProgress =
      activeStep > 0 ||
      staffAttendanceRows.length > 0 ||
      studentAttendanceData.length > 0 ||
      sakshamChanged ||
      operationalCostRows.some((r) => r.amount || r.costType || r.month || r.year);

    const t = setTimeout(() => {
      if (hasProgress) {
        writeDraft(userId, {
          reportingMonth,
          reportingYear,
          activeStep,
          staffAttendanceRows,
          studentAttendanceData,
          sakshamPrePlanningRows,
          sakshamPostPlanningRows,
          operationalCostRows,
        });
        setHasDraft(true);
      } else {
        clearDraft(userId);
        setHasDraft(false);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [
    userId,
    reportingMonth,
    reportingYear,
    activeStep,
    staffAttendanceRows,
    studentAttendanceData,
    sakshamPrePlanningRows,
    sakshamPostPlanningRows,
    operationalCostRows,
  ]);

  const resetForm = () => {
    setActiveStep(0);
    setStaffAttendanceRows([]);
    setStudentAttendanceData([]);
    setSakshamPrePlanningRows(cloneSakshamRows(DEFAULT_SAKSHAM_PRE_ROWS));
    setSakshamPostPlanningRows(cloneSakshamRows(DEFAULT_SAKSHAM_POST_ROWS));
    setOperationalCostRows([{ year: "", month: "", costType: "", amount: "" }]);
  };

  const discardDraftAndReset = () => {
    resetForm();
    clearDraft(userId);
    setHasDraft(false);
    toast.success("Draft discarded — starting a fresh monthly activity.");
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const submission = {
        month: reportingMonth,
        year: reportingYear,
        staffAttendanceRows,
        studentAttendanceData,
        sakshamPrePlanningRows,
        sakshamPostPlanningRows,
        // Kept for backward-compatibility with any older submissions that
        // only ever stored this boolean; now derived from real activity data.
        sakshamCompleted: sakshamPostPlanningRows.some(isRecordedSakshamRow),
        operationalCostRows,
      };

      saveSubmission(submission, userId);
      setSubmissions(getSubmissions(userId));

      // The activity was submitted successfully — the in-progress draft
      // is no longer needed, so remove it right away (this also makes
      // the draft dot on the "New Monthly Activity" tab disappear).
      clearDraft(userId);
      setHasDraft(false);

      toast.success(
        alreadySubmittedThisMonth
          ? `Updated the record for ${reportingMonth} ${reportingYear}.`
          : `Monthly activity for ${reportingMonth} ${reportingYear} submitted successfully.`
      );

      resetForm();
      setActiveTab("history");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleDelete = (id) => {
    deleteSubmissionEntry(id, userId);
    setSubmissions(getSubmissions(userId));
    toast.success("Record deleted.");
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Attendance
            staffAttendanceRows={staffAttendanceRows}
            setStaffAttendanceRows={setStaffAttendanceRows}
            teachingAttMonth={reportingMonth}
            setTeachingAttMonth={setReportingMonth}
            nonTeachingAttMonth={reportingMonth}
            setNonTeachingAttMonth={setReportingMonth}
            studentAttendanceData={studentAttendanceData}
            setStudentAttendanceData={setStudentAttendanceData}
            studentAttendanceMonth={reportingMonth}
            setStudentAttendanceMonth={setReportingMonth}
            showSakshamSaturday={false}
          />
        );
      case 1:
        return (
          <SakshamSaturdayReport
            prePlanningRows={sakshamPrePlanningRows}
            setPrePlanningRows={setSakshamPrePlanningRows}
            postPlanningRows={sakshamPostPlanningRows}
            setPostPlanningRows={setSakshamPostPlanningRows}
          />
        );
      case 2:
        return (
          <OperationalCost
            operationalCostRows={operationalCostRows}
            setOperationalCostRows={setOperationalCostRows}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100%",
        background: `
          radial-gradient(circle at 1px 1px, rgba(180,69,31,0.07) 1px, transparent 0) 0 0/22px 22px,
          ${PAL.sand}
        `,
      }}
    >
      <GlobalStyles
        styles={`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap');
        `}
      />

      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
          <DiamondBullet size={12} color={PAL.clay} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: PAL.clayDark,
              letterSpacing: 0.2,
            }}
          >
            Monthly Activity
          </Typography>
          <DiamondBullet size={12} color={PAL.clay} />
        </Stack>
        <Typography variant="body2" sx={{ color: PAL.brown, opacity: 0.8, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
          Complete the monthly attendance, Saksham Saturday and operational cost details step by step —
          then find every past submission below, organized month by month, or track any individual
          teacher or student in the Register tab.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ZigZagDivider />
        </Box>
      </Box>

      {/* Tabs — the "New Monthly Activity" tab shows a small dot badge
          whenever there's unfinished draft work waiting, so the "bar"
          itself signals incomplete progress even before opening it. */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          minHeight: 44,
          "& .MuiTabs-indicator": { backgroundColor: PAL.clay, height: 3, borderRadius: 2 },
          "& .MuiTab-root": {
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            color: PAL.brown,
            opacity: 0.7,
            minHeight: 44,
          },
          "& .Mui-selected": { color: `${PAL.clayDark} !important`, opacity: 1 },
        }}
      >
        <Tab
          value="form"
          label={
            hasDraft ? (
              <Badge
                variant="dot"
                sx={{ "& .MuiBadge-badge": { bgcolor: PAL.clay, right: -8, top: 2 } }}
              >
                <span style={{ paddingRight: 6 }}>New Monthly Activity</span>
              </Badge>
            ) : (
              "New Monthly Activity"
            )
          }
        />
        <Tab
          value="history"
          label={
            <Badge
              badgeContent={submissions.length}
              sx={{
                "& .MuiBadge-badge": { right: -14, top: 2, bgcolor: PAL.clay, color: PAL.cream, fontWeight: 700 },
              }}
            >
              <span>Submitted Activities</span>
            </Badge>
          }
        />
        <Tab label="Teacher & Student Register" value="register" />
      </Tabs>

      {activeTab === "form" ? (
        <CarvedPanel elevation={0}>
          <ZigZagDivider color={PAL.ochre} height={10} />
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {hasDraft && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ sm: "center" }}
                justifyContent="space-between"
                sx={{
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: 2.5,
                  background: "#F5DCC9",
                  border: `1.5px dashed ${PAL.clay}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <EditNoteIcon sx={{ color: PAL.clayDark }} fontSize="small" />
                  <Typography variant="body2" sx={{ color: PAL.brownDark, fontWeight: 700 }}>
                    Continuing your unfinished draft — progress is saved automatically as you go.
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  onClick={discardDraftAndReset}
                  sx={{
                    color: PAL.clayDark,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#EFC777" },
                  }}
                >
                  Discard draft &amp; start over
                </Button>
              </Stack>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2.5,
                background: PAL.sand,
                border: `1.5px dashed ${PAL.ochre}`,
              }}
              alignItems={{ sm: "center" }}
            >
              <Typography
                variant="body2"
                sx={{ whiteSpace: "nowrap", color: PAL.brownDark, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
              >
                Reporting period
              </Typography>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="reporting-month-label">Month</InputLabel>
                <Select
                  labelId="reporting-month-label"
                  label="Month"
                  value={reportingMonth}
                  onChange={(e) => setReportingMonth(e.target.value)}
                  sx={{
                    bgcolor: PAL.cream,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: PAL.ochre },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PAL.clay },
                  }}
                >
                  {MONTHS.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="reporting-year-label">Year</InputLabel>
                <Select
                  labelId="reporting-year-label"
                  label="Year"
                  value={reportingYear}
                  onChange={(e) => setReportingYear(e.target.value)}
                  sx={{
                    bgcolor: PAL.cream,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: PAL.ochre },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PAL.clay },
                  }}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {alreadySubmittedThisMonth && (
                <Chip
                  size="small"
                  label="A record already exists for this month — submitting will update it."
                  sx={{
                    bgcolor: "#F5DCC9",
                    color: PAL.clayDark,
                    fontWeight: 700,
                    border: `1px solid ${PAL.ochre}`,
                    height: "auto",
                    py: 0.5,
                    "& .MuiChip-label": { whiteSpace: "normal" },
                  }}
                />
              )}
            </Stack>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<BeadedConnector />}
              sx={{ mb: 4 }}
            >
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={TribalStepIcon}
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        color: PAL.brown,
                        mt: 0.75,
                      },
                      "& .MuiStepLabel-label.Mui-active": { color: PAL.clayDark },
                      "& .MuiStepLabel-label.Mui-completed": { color: PAL.clay },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
              <DiamondBullet size={9} />
              <Typography variant="h6" fontWeight={800} sx={{ color: PAL.ink, fontFamily: "'Poppins', sans-serif" }}>
                {steps[activeStep].label}
              </Typography>
            </Stack>

            <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

            <Divider sx={{ mb: 2.5, borderColor: PAL.ochre, borderStyle: "dashed" }} />

            <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  borderColor: PAL.ochre,
                  color: PAL.brownDark,
                  fontWeight: 700,
                  borderRadius: 2.5,
                  borderWidth: 2,
                  "&:hover": { borderColor: PAL.clay, borderWidth: 2, bgcolor: PAL.sand },
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: `linear-gradient(145deg, ${PAL.clay}, ${PAL.clayDark})`,
                  color: PAL.cream,
                  fontWeight: 700,
                  borderRadius: 2.5,
                  boxShadow: "0 4px 0 rgba(58,36,21,0.35)",
                  px: 3,
                  "&:hover": { background: `linear-gradient(145deg, ${PAL.clayDark}, ${PAL.clayDark})` },
                }}
              >
                {activeStep === steps.length - 1 ? "Submit Monthly Activity" : "Next"}
              </Button>
            </Stack>
          </Box>
          <ZigZagDivider color={PAL.ochre} height={10} />
        </CarvedPanel>
      ) : activeTab === "history" ? (
        <MonthlyActivityHistory submissions={submissions} onDelete={handleDelete} />
      ) : (
        <TeacherStudentRegister submissions={submissions} />
      )}
    </Box>
  );
};

export default MonthlyActivity;