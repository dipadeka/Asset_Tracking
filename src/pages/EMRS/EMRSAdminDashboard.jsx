// src/pages/EMRS/EMRSAdminDashboard.jsx
// ─────────────────────────────────────────────────────────────
//  Admin view — 17 school sidebar tabs, full form detail view
//  Route: /dashboard/admin   |   role = "admin"
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { SCHOOL_CREDENTIALS } from "./Schoolcredentials";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  LinearProgress,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConstructionIcon from "@mui/icons-material/Construction";
import HotelIcon from "@mui/icons-material/Hotel";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsIcon from "@mui/icons-material/Sports";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate } from "react-router-dom";

// ── Physical construction progress per school (from PPT) ────
//    Key = schoolCode from SCHOOL_CREDENTIALS
const PHYSICAL_PROGRESS = {
  "EMRS-AS-01": { pct: 100,  label: "100% — Ph-I completed, Ph-II under progress",  status: "functional", since: "AY2025-26" },
  "EMRS-AS-02": { pct: 100,  label: "100% — Ph-I completed, Ph-II under progress",  status: "functional", since: "AY2025-26" },
  "EMRS-AS-03": { pct: 100,  label: "100% — Ph-I completed, Ph-II under progress",  status: "functional", since: "AY2025-26" },
  "EMRS-AS-04": { pct: 100,   label: "100% — Ph-I completed, Ph-II 30%  progress",   status: "functional", since: "AY2025-26" },
  "EMRS-AS-05": { pct: 100,  label: "100% — Ph-I completed, Ph-II not yet approved",  status: "functional", since: "AY2025-26" },
  "EMRS-AS-06": { pct: 100, label: "100% — Ph-I completed, Ph-II under progress",   status: "functional",   from: "AY2026-27" },
  "EMRS-AS-07": { pct: 17,  label: "17% — Tender in process",                       status: "upcoming",   since: null },
  "EMRS-AS-08": { pct: 43.50,   label: "43.5% - Subjuidice at Gauhati High Court",  status: "upcoming",   since: null },
  "EMRS-AS-09": { pct: 100,    label: "100% — Ph-I completed, Ph-II not yet approved",  status: "upcoming",   since: null },
  "EMRS-AS-10": { pct: 65,  label: "100%",       status: "Construction in progress", since: "null" },
  "EMRS-AS-11": { pct: 5,  label: "5%", status: "Construction in progress", since: "null" },
  "EMRS-AS-12": { pct: 45,   label: "45% — Construction in progress",                status: "upcoming",   since: null },
  "EMRS-AS-13": { pct: 35,   label: "35% — Construction in progress",                status: "upcoming",   since: null },
  "EMRS-AS-14": { pct: 20,   label: "20% — Construction in progress",                status: "upcoming",   since: null },
  "EMRS-AS-15": { pct: 100,  label: "100% — Ph-I completed",                         status: "upcoming",   since: "AY2026-27" },
  "EMRS-AS-16": { pct: 25,   label: "25% — Tender in process",                       status: "upcoming",   since: null },
  "EMRS-AS-17": { pct: 0,    label: "0% — DPR under preparation",                    status: "upcoming",   since: null },
};

// ── Shared style tokens ─────────────────────────────────────
const thSx = {
  background: "linear-gradient(135deg, #1565c0, #1976d2)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 11,
  py: 1.2,
  px: 1.5,
  whiteSpace: "nowrap",
};
const tdSx = { py: 0.9, px: 1.5, fontSize: 12 };

// ── Sub-tab config inside the detail panel ──────────────────
const DETAIL_TABS = [
  { label: "Basic Info",        icon: <SchoolIcon sx={{ fontSize: 16 }} /> },
  { label: "Infrastructure",    icon: <DashboardIcon sx={{ fontSize: 16 }} /> },
  { label: "Construction",      icon: <ConstructionIcon sx={{ fontSize: 16 }} /> },
  { label: "Hostel",            icon: <HotelIcon sx={{ fontSize: 16 }} /> },
  { label: "Enrollment",        icon: <GroupsIcon sx={{ fontSize: 16 }} /> },
  { label: "Extra Curricular",  icon: <SportsIcon sx={{ fontSize: 16 }} /> },
  { label: "Hospitalization",   icon: <LocalHospitalIcon sx={{ fontSize: 16 }} /> },
  { label: "Staff",             icon: <PeopleIcon sx={{ fontSize: 16 }} /> },
  { label: "Attendance",        icon: <CalendarMonthIcon sx={{ fontSize: 16 }} /> },
  { label: "Operational Cost",  icon: <AttachMoneyIcon sx={{ fontSize: 16 }} /> },
  { label: "Financial",         icon: <AccountBalanceIcon sx={{ fontSize: 16 }} /> },
  { label: "Images",            icon: <PhotoLibraryIcon sx={{ fontSize: 16 }} /> },
];

// ── Small helpers ───────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <Typography
    variant="subtitle2"
    sx={{
      fontWeight: 700,
      color: "#fff",
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      px: 2, py: 0.9,
      borderRadius: 1.5,
      mb: 1.5, mt: 2,
      fontSize: 13,
      display: "flex", alignItems: "center", gap: 1,
    }}
  >
    {children}
  </Typography>
);

const InfoRow = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box sx={{ background: "#f8fafc", borderRadius: 1.5, px: 1.5, py: 1, border: "1px solid #e8edf5" }}>
      <Typography variant="caption" sx={{ color: "#90a4ae", fontWeight: 700, textTransform: "uppercase", fontSize: 9, letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1a237e", mt: 0.2, fontSize: 13 }}>
        {value || "—"}
      </Typography>
    </Box>
  </Grid>
);

const EmptyState = ({ message }) => (
  <Box sx={{ textAlign: "center", py: 6, color: "#b0bec5" }}>
    <PendingIcon sx={{ fontSize: 48, mb: 1 }} />
    <Typography variant="body2">{message}</Typography>
  </Box>
);

const getSchoolData = (submittedData, school) => {
  if (!submittedData?.length || !school) return null;

  const str = (v) => (v !== undefined && v !== null ? String(v).trim() : "");

  const username   = str(school.username).toLowerCase();
  const codeRaw    = str(school.schoolCode);                          // "EMRS-AS-03"
  const codeNumStr = String(parseInt(codeRaw.split("-").pop(), 10)); // "3"
  const nameLower  = str(school.schoolName).toLowerCase();

  return (
    submittedData.find((d) => {
      // ── 1. username / all possible login-id field names ──────
      const possibleUserFields = [
        d.username, d.loginId, d.login_id, d.userId, d.user_id,
        d.submittedBy, d.submitted_by, d.schoolUsername,
      ];
      if (username && possibleUserFields.some(
        (v) => str(v).toLowerCase() === username
      )) return true;

      // ── 2. Full schoolCode string in any code field ──────────
      const possibleCodeFields = [
        d.schoolCode, d.school_code, d.EMRScode, d.emrsCode,
        d.emrs_code, d.code,
      ];
      if (codeRaw && possibleCodeFields.some(
        (v) => str(v) === codeRaw
      )) return true;

      // ── 3. Numeric code suffix────
      if (codeNumStr && possibleCodeFields.some(
        (v) => v !== undefined && v !== null && str(v) === codeNumStr
      )) return true;

      // ── 4. School name —  ─────────────────
      const possibleNameFields = [
        d.schoolname, d.schoolName, d.school_name, d.name,
      ];
      if (nameLower) {
        // exact
        if (possibleNameFields.some((v) => str(v).toLowerCase() === nameLower)) return true;
        // partial — stored name contains the credential name or vice-versa
        if (possibleNameFields.some((v) => {
          const s = str(v).toLowerCase();
          return s && (s.includes(nameLower) || nameLower.includes(s));
        })) return true;
      }

      return false;
    }) || null
  );
};

// ── Detail Panel (right side) ───────────────────────────────
const SchoolDetailPanel = ({ school, data }) => {
  const [detailTab, setDetailTab] = useState(0);

  // Reset sub-tab when a different school is selected
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setDetailTab(0);
  }, [school?.id]);

  if (!school) return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#b0bec5" }}>
      <SchoolIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#cfd8dc" }}>Select a school</Typography>
      <Typography variant="caption">Click any school from the left panel to view its details</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* School Header */}
      <Box sx={{
        background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #42a5f5 100%)",
        px: 3, py: 2.5,
        borderRadius: "0 12px 0 0",
      }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar sx={{ background: "rgba(255,255,255,0.2)", width: 48, height: 48, fontSize: 22 }}>🏫</Avatar>
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              {school.schoolName}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", display: "block", mt: 0.5 }}>
              {school.district} &nbsp;·&nbsp; {school.block} &nbsp;·&nbsp; {school.schoolCode}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip size="small" label={school.yearOfSanction}
                sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 10 }} />
              <Chip
                size="small"
                icon={data ? <CheckCircleIcon sx={{ fontSize: 12, color: "#a5d6a7 !important" }} /> : <PendingIcon sx={{ fontSize: 12, color: "#ffcc80 !important" }} />}
                label={data ? "Submitted" : "Pending"}
                sx={{
                  background: data ? "rgba(46,125,50,0.3)" : "rgba(230,81,0,0.3)",
                  color: data ? "#a5d6a7" : "#ffcc80",
                  fontWeight: 700, fontSize: 10,
                }}
              />
            </Box>
          </Box>
          {data && (
            <Tooltip title="Export JSON">
              <IconButton
                size="small"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${school.schoolCode}_EMRS.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 1.5, p: 0.6 }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Physical construction progress bar */}
        {(() => {
          const prog = PHYSICAL_PROGRESS[school.schoolCode];
          if (!prog) return null;
          const color = prog.pct === 100 ? "#69f0ae" : prog.pct >= 50 ? "#ffcc80" : "#ef9a9a";
          return (
            <Box sx={{ mt: 2, mb: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
                  🏗️ PHYSICAL CONSTRUCTION PROGRESS
                </Typography>
                <Typography variant="caption" sx={{ color, fontWeight: 800, fontSize: 12 }}>
                  {prog.pct}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={prog.pct}
                sx={{
                  height: 8, borderRadius: 4,
                  background: "rgba(255,255,255,0.15)",
                  "& .MuiLinearProgress-bar": {
                    background: prog.pct === 100
                      ? "linear-gradient(90deg, #43a047, #69f0ae)"
                      : prog.pct >= 50
                      ? "linear-gradient(90deg, #ef6c00, #ffcc80)"
                      : "linear-gradient(90deg, #c62828, #ef9a9a)",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 9, mt: 0.3, display: "block" }}>
                {prog.label}{prog.since ? ` · Functional from ${prog.since}` : ""}
              </Typography>
            </Box>
          );
        })()}

        {/* Quick credentials strip */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
          {[
            { label: "Login ID", value: school.username },
            { label: "Password", value: school.password },
          ].map(({ label, value }) => (
            <Box key={label} sx={{ background: "rgba(255,255,255,0.12)", px: 1.5, py: 0.5, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 700 }}>{label}</Typography>
              <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, display: "block", fontFamily: "monospace", fontSize: 12 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* No data state */}
      {!data ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
          <PendingIcon sx={{ fontSize: 56, color: "#e0e0e0", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#90a4ae" }}>No Form Submitted</Typography>
          <Typography variant="caption" sx={{ color: "#b0bec5", mt: 0.5 }}>
            This school hasn't submitted its EMRS form yet.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Detail Sub-Tabs */}
          <Box sx={{ background: "#fff", borderBottom: "2px solid #e3f2fd" }}>
            <Tabs
              value={detailTab}
              onChange={(_, v) => setDetailTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                "& .MuiTab-root": { fontSize: 11, fontWeight: 600, minHeight: 40, py: 0.5, minWidth: 80 },
                "& .Mui-selected": { color: "#1565c0" },
                "& .MuiTabs-indicator": { background: "#1565c0", height: 3 },
              }}
            >
              {DETAIL_TABS.map((t, i) => (
                <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, background: "#f8fafc" }}>

            {/* ── TAB 0: Basic Info ── */}
            {detailTab === 0 && (
              <Box>
                <SectionTitle>🏫 Basic School Information</SectionTitle>
                <Grid container spacing={1.5}>
                  <InfoRow label="School Name" value={data.schoolname} />
                  <InfoRow label="EMRS Code" value={data.EMRScode} />
                  <InfoRow label="UDISE Code" value={data.udaisecode} />
                  <InfoRow label="School Type" value={data.schooltype} />
                  <InfoRow label="Affiliation" value={data.affiliation} />
                  <InfoRow label="Principal Name" value={data.principalName} />
                  <InfoRow label="Contact" value={data.contactno} />
                  <InfoRow label="Email" value={data.email} />
                  <InfoRow label="State" value={data.state} />
                  <InfoRow label="District" value={data.district} />
                  <InfoRow label="Block" value={data.block} />
                  <InfoRow label="Gram Panchayat" value={data.gramPanchayat} />
                  <InfoRow label="Village" value={data.village} />
                  <InfoRow label="Year of Sanction" value={data.yearOfSanction} />
                  <InfoRow label="Submitted At" value={data.submittedAt ? new Date(data.submittedAt).toLocaleString() : "—"} />
                </Grid>
              </Box>
            )}

            {/* ── TAB 1: Infrastructure ── */}
            {detailTab === 1 && (
              <Box>
                <SectionTitle>🔬 Infrastructure Details</SectionTitle>
                <Grid container spacing={1.5}>
                  <InfoRow label="Total Classrooms" value={data.totalClassrooms} />
                  <InfoRow label="Smart Classrooms" value={data.classroomWithSmartClass} />
                  <InfoRow label="Projector Rooms" value={data.classroomWithProjector} />
                  <InfoRow label="Science Lab" value={data.scienceLab} />
                  <InfoRow label="Biology Lab" value={data.biologyLab} />
                  <InfoRow label="Chemistry Lab" value={data.chemistryLab} />
                  <InfoRow label="Physics Lab" value={data.physicsLab} />
                  <InfoRow label="Computer Lab" value={data.computerLab} />
                  <InfoRow label="Internet in Lab" value={data.internetComputerLab} />
                  <InfoRow label="Library" value={data.library} />
                  <InfoRow label="Books in Library" value={data.booksInLibrary} />
                  <InfoRow label="Playground" value={data.playground} />
                  <InfoRow label="Playground Area (sqm)" value={data.playgroundArea} />
                  <InfoRow label="Auditorium" value={data.auditorium} />
                  <InfoRow label="Auditorium Capacity" value={data.auditoriumCapacity} />
                  <InfoRow label="Medical Room" value={data.medicalRoom} />
                  <InfoRow label="Fire Extinguishers (Total)" value={data.totalFireExtinguishers} />
                  <InfoRow label="Fire Extinguishers (Functional)" value={data.functionalFireExtinguishers} />
                  <InfoRow label="Electrical Safety Inspection" value={data.electricalSafetyInspection} />
                  <InfoRow label="Fire Safety Drill" value={data.fireSafetyDrill} />
                </Grid>
              </Box>
            )}

            {/* ── TAB 2: Construction ── */}
            {detailTab === 2 && (
              <Box>
                <SectionTitle>🏗️ Construction Status</SectionTitle>
                {!data.constructionStatus || Object.keys(data.constructionStatus).length === 0 ? (
                  <EmptyState message="No construction data submitted." />
                ) : (
                  Object.entries(data.constructionStatus).map(([cat, rows]) => {
                    if (!Array.isArray(rows)) return null;
                    return (
                      <Box key={cat} mb={2.5}>
                        <Typography sx={{ fontWeight: 700, color: "#1976d2", mb: 1, textTransform: "capitalize", fontSize: 13 }}>
                          📦 {cat}
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                {["Component","Units","Status","Progress %","Assigned To","Budget","Remarks"].map((h) => (
                                  <TableCell key={h} sx={thSx}>{h}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((r, i) => (
                                <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                                  <TableCell sx={tdSx}>{r.component}</TableCell>
                                  <TableCell sx={tdSx}>{r.units}</TableCell>
                                  <TableCell sx={tdSx}>
                                    <Chip size="small" label={r.status} sx={{
                                      background: r.status === "Completed" ? "#e8f5e9" : r.status === "In Progress" ? "#e3f2fd" : "#fafafa",
                                      color: r.status === "Completed" ? "#2e7d32" : r.status === "In Progress" ? "#1565c0" : "#616161",
                                      fontSize: 10, fontWeight: 700,
                                    }} />
                                  </TableCell>
                                  <TableCell sx={tdSx}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <LinearProgress variant="determinate" value={Number(r.progress) || 0}
                                        sx={{ flex: 1, height: 6, borderRadius: 3, background: "#e0e0e0", "& .MuiLinearProgress-bar": { background: "#1976d2" } }} />
                                      <Typography sx={{ fontSize: 11, fontWeight: 700, minWidth: 28 }}>{r.progress}%</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={tdSx}>{r.assignedTo || "—"}</TableCell>
                                  <TableCell sx={tdSx}>{r.budget ? `₹${Number(r.budget).toLocaleString("en-IN")}` : "—"}</TableCell>
                                  <TableCell sx={tdSx}>{r.remarks || "—"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    );
                  })
                )}
              </Box>
            )}

            {/* ── TAB 3: Hostel ── */}
            {detailTab === 3 && (
              <Box>
                <SectionTitle>🏠 Hostel Administration</SectionTitle>
                <Grid container spacing={2}>
                  {[["Boys Hostel", data.boysHostel], ["Girls Hostel", data.girlsHostel]].map(([label, hostel]) => (
                    <Grid item xs={12} md={6} key={label}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, border: "1px solid #e3f2fd" }}>
                        <Typography sx={{ fontWeight: 700, color: "#1976d2", mb: 1.5, fontSize: 13 }}>{label}</Typography>
                        <Grid container spacing={1}>
                          <InfoRow label="Capacity" value={hostel?.capacity} />
                          <InfoRow label="Beds Available" value={hostel?.bedsAvailable} />
                          <InfoRow label="Current Occupancy" value={hostel?.currentOccupancy} />
                          <InfoRow label="CCTV Installed" value={hostel?.cctvInstalled} />
                          <InfoRow label="No. of CCTV" value={hostel?.noOfCCTV} />
                          <InfoRow label="Warden Name" value={hostel?.warden?.name} />
                          <InfoRow label="Warden Email" value={hostel?.warden?.email} />
                          <InfoRow label="Warden Contact" value={hostel?.warden?.contact} />
                          <InfoRow label="Security Agency" value={hostel?.securityAgencyName} />
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* ── TAB 4: Enrollment ── */}
            {detailTab === 4 && (
              <Box>
                <SectionTitle>🎓 Class Strength & Enrollment</SectionTitle>
                {!(data.classStrength || []).length ? (
                  <EmptyState message="No enrollment data submitted." />
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Year","Class","Section","Sanctioned","Enrolled","ST","PVTG","Orphan","Appeared","Passed","Pass%","Distinctions","Top Scorer","Top Score"].map((h) => (
                            <TableCell key={h} sx={thSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.classStrength.map((row, i) => (
                          <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <TableCell sx={tdSx}>{row.academicYear}</TableCell>
                            <TableCell sx={tdSx}>{row.class}</TableCell>
                            <TableCell sx={tdSx}>{row.section}</TableCell>
                            <TableCell sx={tdSx}>{row.sanctionedCapacity}</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700, color: "#1565c0" }}>{row.currentEnrollment}</TableCell>
                            <TableCell sx={tdSx}>{row.categoryBreakdown?.ST || "—"}</TableCell>
                            <TableCell sx={tdSx}>{row.categoryBreakdown?.PVTG || "—"}</TableCell>
                            <TableCell sx={tdSx}>{row.categoryBreakdown?.Orphan || "—"}</TableCell>
                            <TableCell sx={tdSx}>{row.academicPerformance?.appeared}</TableCell>
                            <TableCell sx={tdSx}>{row.academicPerformance?.passed}</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700, color: "#2e7d32" }}>{row.academicPerformance?.passPercent}%</TableCell>
                            <TableCell sx={tdSx}>{row.academicPerformance?.distinctions}</TableCell>
                            <TableCell sx={tdSx}>{row.academicPerformance?.topScorer}</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{row.academicPerformance?.topScore}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* ── TAB 5: Extra Curricular ── */}
            {detailTab === 5 && (
              <Box>
                <SectionTitle>🎭 Extra Curricular Activities</SectionTitle>
                {!(data.extraCurricular || []).length ? (
                  <EmptyState message="No extra curricular data." />
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Year","Initiative","Partner","Areas","Description","Target Students","Status"].map((h) => (
                            <TableCell key={h} sx={thSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.extraCurricular.map((row, i) => (
                          <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <TableCell sx={tdSx}>{row.academicYear}</TableCell>
                            <TableCell sx={tdSx}>{row.initiativeName}</TableCell>
                            <TableCell sx={tdSx}>{row.collaboratingPartner}</TableCell>
                            <TableCell sx={tdSx}>{(row.areasOfDevelopment || []).join(", ")}</TableCell>
                            <TableCell sx={tdSx}>{row.description}</TableCell>
                            <TableCell sx={tdSx}>{row.targetStudents}</TableCell>
                            <TableCell sx={tdSx}>
                              <Chip size="small" label={row.status} sx={{
                                background: row.status === "Completed" ? "#e8f5e9" : "#e3f2fd",
                                color: row.status === "Completed" ? "#2e7d32" : "#1565c0",
                                fontWeight: 700, fontSize: 10,
                              }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* ── TAB 6: Hospitalization ── */}
            {detailTab === 6 && (
              <Box>
                <SectionTitle>🏥 Hospitalization Cases</SectionTitle>
                {!(data.hospitalization || []).length ? (
                  <EmptyState message="No hospitalization records." />
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Student","Roll No","Class","Section","Admission","Discharge","Reason","Hospital","Doctor","Est. Cost","Claimed","Status"].map((h) => (
                            <TableCell key={h} sx={thSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.hospitalization.map((row, i) => (
                          <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{row.studentName}</TableCell>
                            <TableCell sx={tdSx}>{row.rollNo}</TableCell>
                            <TableCell sx={tdSx}>{row.class}</TableCell>
                            <TableCell sx={tdSx}>{row.section}</TableCell>
                            <TableCell sx={tdSx}>{row.admissionDate}</TableCell>
                            <TableCell sx={tdSx}>{row.dischargeDate}</TableCell>
                            <TableCell sx={tdSx}>{row.reasonForHospitalization}</TableCell>
                            <TableCell sx={tdSx}>{row.hospitalEmpanelled}</TableCell>
                            <TableCell sx={tdSx}>{row.doctorName}</TableCell>
                            <TableCell sx={tdSx}>₹{row.estimatedCost?.toLocaleString("en-IN")}</TableCell>
                            <TableCell sx={tdSx}>₹{row.amountClaimed?.toLocaleString("en-IN")}</TableCell>
                            <TableCell sx={tdSx}>
                              <Chip size="small" label={row.claimStatus} sx={{ fontSize: 10, fontWeight: 700 }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* ── TAB 7: Staff ── */}
            {detailTab === 7 && (
              <Box>
                <SectionTitle>👨‍🏫 Teaching Staff</SectionTitle>
                {!(data.teachingStaff || []).length ? (
                  <EmptyState message="No teaching staff data." />
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Post","Name","DOB","DOJ","Email","Contact","Total","Filled","Vacant"].map((h) => (
                            <TableCell key={h} sx={thSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.teachingStaff.map((s, i) => (
                          <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <TableCell sx={tdSx}><Chip size="small" label={s.post} sx={{ background: "#e3f2fd", color: "#1565c0", fontWeight: 700, fontSize: 10 }} /></TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{s.name}</TableCell>
                            <TableCell sx={tdSx}>{s.dob}</TableCell>
                            <TableCell sx={tdSx}>{s.doj}</TableCell>
                            <TableCell sx={tdSx}>{s.email}</TableCell>
                            <TableCell sx={tdSx}>{s.contact}</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{s.total}</TableCell>
                            <TableCell sx={{ ...tdSx, color: "#2e7d32", fontWeight: 700 }}>{s.filled}</TableCell>
                            <TableCell sx={{ ...tdSx, color: s.vacant > 0 ? "#c62828" : "#2e7d32", fontWeight: 700 }}>{s.vacant}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <SectionTitle>🧹 Non-Teaching Staff</SectionTitle>
                {!(data.nonTeachingStaff || []).length ? (
                  <EmptyState message="No non-teaching staff data." />
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Post","Name","DOB","DOJ","Email","Contact","Total","Filled","Vacant"].map((h) => (
                            <TableCell key={h} sx={thSx}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.nonTeachingStaff.map((s, i) => (
                          <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <TableCell sx={tdSx}><Chip size="small" label={s.post} sx={{ background: "#f3e5f5", color: "#6a1b9a", fontWeight: 700, fontSize: 10 }} /></TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{s.name}</TableCell>
                            <TableCell sx={tdSx}>{s.dob}</TableCell>
                            <TableCell sx={tdSx}>{s.doj}</TableCell>
                            <TableCell sx={tdSx}>{s.email}</TableCell>
                            <TableCell sx={tdSx}>{s.contact}</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 700 }}>{s.total}</TableCell>
                            <TableCell sx={{ ...tdSx, color: "#2e7d32", fontWeight: 700 }}>{s.filled}</TableCell>
                            <TableCell sx={{ ...tdSx, color: s.vacant > 0 ? "#c62828" : "#2e7d32", fontWeight: 700 }}>{s.vacant}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* ── TAB 8: Attendance ── */}
            {detailTab === 8 && (
              <Box>
                <SectionTitle>📅 Staff Monthly Attendance</SectionTitle>
                {!(data.teachingStaff || []).length ? (
                  <EmptyState message="No attendance data." />
                ) : (
                  data.teachingStaff.map((s, si) => (
                    <Box key={si} sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 700, color: "#1976d2", mb: 1, fontSize: 13 }}>
                        {s.post} – {s.name}
                      </Typography>
                      {!(s.monthlyAttendance || []).length ? (
                        <Typography sx={{ color: "#90a4ae", fontSize: 12 }}>No monthly attendance recorded.</Typography>
                      ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                {["Month","Working Days","Present","Absent","CL","EL","ML","Maternity"].map((h) => (
                                  <TableCell key={h} sx={thSx}>{h}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {s.monthlyAttendance.map((att, ai) => (
                                <TableRow key={ai}>
                                  <TableCell sx={tdSx}>{att.month}</TableCell>
                                  <TableCell sx={tdSx}>{att.workingDays}</TableCell>
                                  <TableCell sx={{ ...tdSx, color: "#2e7d32", fontWeight: 700 }}>{att.present}</TableCell>
                                  <TableCell sx={{ ...tdSx, color: "#c62828", fontWeight: 700 }}>{att.absent}</TableCell>
                                  <TableCell sx={tdSx}>{att.cl || "—"}</TableCell>
                                  <TableCell sx={tdSx}>{att.el || "—"}</TableCell>
                                  <TableCell sx={tdSx}>{att.ml || "—"}</TableCell>
                                  <TableCell sx={tdSx}>{att.maternity || "—"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            )}

            {/* ── TAB 9: Operational Cost ── */}
            {detailTab === 9 && (
              <Box>
                <SectionTitle>💰 Operational Cost</SectionTitle>
                {!(data.operationalCost || []).length ? (
                  <EmptyState message="No operational cost data." />
                ) : (
                  <>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {["Year","Month","Cost Type","Amount (₹)"].map((h) => (
                              <TableCell key={h} sx={thSx}>{h}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.operationalCost.map((row, i) => (
                            <TableRow key={i} sx={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                              <TableCell sx={tdSx}>{row.year}</TableCell>
                              <TableCell sx={tdSx}>{row.month}</TableCell>
                              <TableCell sx={tdSx}>{row.costType}</TableCell>
                              <TableCell sx={{ ...tdSx, fontWeight: 700, color: "#1565c0" }}>
                                ₹{Number(row.amount || 0).toLocaleString("en-IN")}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ background: "#e3f2fd" }}>
                            <TableCell colSpan={3} sx={{ ...tdSx, fontWeight: 800 }}>TOTAL</TableCell>
                            <TableCell sx={{ ...tdSx, fontWeight: 800, color: "#0d47a1", fontSize: 14 }}>
                              ₹{data.operationalCost.reduce((s, r) => s + Number(r.amount || 0), 0).toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
            )}

            {/* ── TAB 10: Financial ── */}
            {detailTab === 10 && (
              <Box>
                <SectionTitle>📊 Financial & Procurement Compliance</SectionTitle>
                <Grid container spacing={1.5}>
                  <InfoRow label="Total Funds Allocated" value={data.totalFundsAllocated ? `₹${Number(data.totalFundsAllocated).toLocaleString("en-IN")}` : "—"} />
                  <InfoRow label="Total Funds Utilized" value={data.totalFundsUtilized ? `₹${Number(data.totalFundsUtilized).toLocaleString("en-IN")}` : "—"} />
                  <InfoRow label="Utilization %" value={data.utilizationPercentage ? `${data.utilizationPercentage}%` : "—"} />
                  <InfoRow label="Fund Utilization Marks" value={data.fundUtilMarksObtained} />
                  <InfoRow label="Audit Conducted" value={data.auditConducted} />
                </Grid>
                {data.utilizationPercentage && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#546e7a" }}>FUND UTILIZATION</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Number(data.utilizationPercentage), 100)}
                      sx={{ mt: 0.5, height: 10, borderRadius: 5, background: "#e0e0e0", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #1976d2, #42a5f5)" } }}
                    />
                    <Typography variant="caption" sx={{ color: "#1565c0", fontWeight: 700 }}>{data.utilizationPercentage}% utilized</Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* ── TAB 11: Images ── */}
            {detailTab === 11 && (
              <Box>
                <SectionTitle>🖼️ School Images</SectionTitle>
                {!(data.images || []).length ? (
                  <Box sx={{ textAlign: "center", py: 6, color: "#b0bec5" }}>
                    <PhotoLibraryIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#90a4ae" }}>No Images Uploaded</Typography>
                    <Typography variant="caption" sx={{ color: "#b0bec5" }}>
                      This school hasn't uploaded any images yet.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Category groups */}
                    {(() => {
                      // Group images by category if available, else show flat grid
                      const grouped = (data.images || []).reduce((acc, img) => {
                        const cat = img.category || img.type || "General";
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(img);
                        return acc;
                      }, {});
                      return Object.entries(grouped).map(([cat, imgs]) => (
                        <Box key={cat} sx={{ mb: 3 }}>
                          <Typography sx={{
                            fontWeight: 700, color: "#1976d2", mb: 1.5,
                            fontSize: 13, textTransform: "capitalize",
                            display: "flex", alignItems: "center", gap: 0.8,
                          }}>
                            📁 {cat}
                            <Chip size="small" label={`${imgs.length} photo${imgs.length !== 1 ? "s" : ""}`}
                              sx={{ background: "#e3f2fd", color: "#1565c0", fontWeight: 700, fontSize: 10, height: 18 }} />
                          </Typography>
                          <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: 1.5,
                          }}>
                            {imgs.map((img, i) => (
                              <Box
                                key={i}
                                sx={{
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  border: "1px solid #e3f2fd",
                                  background: "#fff",
                                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                                  cursor: "pointer",
                                  transition: "transform 0.15s, box-shadow 0.15s",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 16px rgba(25,118,210,0.18)",
                                  },
                                }}
                                onClick={() => window.open(img.url || img.src || img.dataUrl, "_blank")}
                              >
                                <Box
                                  component="img"
                                  src={img.url || img.src || img.dataUrl || img.base64}
                                  alt={img.caption || img.name || `Image ${i + 1}`}
                                  sx={{
                                    width: "100%",
                                    height: 140,
                                    objectFit: "cover",
                                    display: "block",
                                    background: "#f0f4f8",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                {/* Fallback if image fails to load */}
                                <Box sx={{
                                  display: "none", width: "100%", height: 140,
                                  alignItems: "center", justifyContent: "center",
                                  background: "#f5f7fa", color: "#b0bec5",
                                  flexDirection: "column", gap: 0.5,
                                }}>
                                  <PhotoLibraryIcon sx={{ fontSize: 32, opacity: 0.4 }} />
                                  <Typography variant="caption" sx={{ fontSize: 10 }}>Image unavailable</Typography>
                                </Box>
                                {(img.caption || img.name) && (
                                  <Box sx={{ px: 1.2, py: 0.8, borderTop: "1px solid #f0f4f8" }}>
                                    <Typography variant="caption" sx={{
                                      fontSize: 11, color: "#546e7a", fontWeight: 600,
                                      display: "block",
                                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                    }}>
                                      {img.caption || img.name}
                                    </Typography>
                                    {img.uploadedAt && (
                                      <Typography variant="caption" sx={{ fontSize: 9, color: "#90a4ae" }}>
                                        {new Date(img.uploadedAt).toLocaleDateString()}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ));
                    })()}
                  </>
                )}
              </Box>
            )}

          </Box>
        </>
      )}
    </Box>
  );
};

// ── School List Item ────────────────────────────────────────
const SchoolListItem = ({ school, index, isSelected, isSubmitted, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 2,
      py: 1.2,
      cursor: "pointer",
      borderLeft: isSelected ? "4px solid #1976d2" : "4px solid transparent",
      background: isSelected ? "linear-gradient(90deg, #e3f2fd, #f0f7ff)" : "transparent",
      "&:hover": { background: isSelected ? "linear-gradient(90deg, #e3f2fd, #f0f7ff)" : "#f5f7fa" },
      transition: "all 0.15s ease",
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    {/* Index badge */}
    <Box sx={{
      minWidth: 24, height: 24, borderRadius: "50%",
      background: isSelected ? "#1976d2" : "#e8edf5",
      color: isSelected ? "#fff" : "#78909c",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 800,
    }}>
      {index + 1}
    </Box>

    {/* Name + district */}
    <Box flex={1} sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{
        fontWeight: 700,
        color: isSelected ? "#0d47a1" : "#37474f",
        display: "block",
        fontSize: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {school.schoolName}
      </Typography>
      <Typography variant="caption" sx={{ color: "#90a4ae", fontSize: 10 }}>
        {school.district}
      </Typography>
    </Box>

    {/* Status dot */}
    <Box sx={{
      width: 8, height: 8, borderRadius: "50%",
      background: isSubmitted ? "#43a047" : "#e0e0e0",
      flexShrink: 0,
    }} />
  </Box>
);

// ── Main Admin Dashboard ─────────────────────────────────────
const EMRSAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [submittedData, setSubmittedData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [search, setSearch] = useState("");

  const loadData = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("emrs_submitted_forms") || "[]");

      // Safe string coerce helper
      const str = (v) => (v !== undefined && v !== null ? String(v).trim() : "");

      // ── Normalize every entry: find its true SCHOOL_CREDENTIALS record
      //    by trying every field the form might have used to store the login id,
      //    then re-stamp all identity fields from the credential record.
      //    This fixes wrong-school-name bugs at the root.
      const normalized = raw.map((entry) => {
        // Collect every possible "who submitted this" value from the entry
        const entryUserCandidates = [
          entry.username, entry.loginId, entry.login_id,
          entry.userId,   entry.user_id, entry.submittedBy,
          entry.submitted_by, entry.schoolUsername,
        ].map((v) => str(v).toLowerCase()).filter(Boolean);

        const entryCodeCandidates = [
          entry.schoolCode, entry.school_code,
          entry.EMRScode,   entry.emrsCode, entry.emrs_code, entry.code,
        ].map((v) => str(v)).filter(Boolean);

        const entryNameCandidates = [
          entry.schoolname, entry.schoolName, entry.school_name, entry.name,
        ].map((v) => str(v).toLowerCase()).filter(Boolean);

        // Find the matching credential
        const cred = SCHOOL_CREDENTIALS.find((s) => {
          const credUser = str(s.username).toLowerCase();
          const credCode = str(s.schoolCode);
          const credCodeNum = String(parseInt(credCode.split("-").pop(), 10));
          const credName = str(s.schoolName).toLowerCase();

          if (credUser && entryUserCandidates.includes(credUser)) return true;
          if (credCode && entryCodeCandidates.includes(credCode)) return true;
          if (credCodeNum && entryCodeCandidates.includes(credCodeNum)) return true;
          if (credName && entryNameCandidates.some(
            (n) => n.includes(credName) || credName.includes(n)
          )) return true;
          return false;
        });

        if (!cred) return entry; // unrecognised entry — leave untouched

        // Stamp the authoritative identity onto the entry
        return {
          ...entry,
          username:   cred.username,   // ensure username is always present
          schoolCode: cred.schoolCode,
          schoolname: cred.schoolName,
          district:   cred.district,
          block:      cred.block,
          EMRScode:   cred.schoolCode,
        };
      });

      localStorage.setItem("emrs_submitted_forms", JSON.stringify(normalized));
      setSubmittedData(normalized);
    } catch {
      setSubmittedData([]);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadData();
    window.addEventListener("emrs-form-submitted", loadData);
    return () => window.removeEventListener("emrs-form-submitted", loadData);
  }, [loadData]);

  // Memoised per-school lookup so it won't be stale after loadData
  const getDataForSchool = useCallback(
    (school) => getSchoolData(submittedData, school),
    [submittedData]
  );

  const submittedCount = SCHOOL_CREDENTIALS.filter((s) => !!getDataForSchool(s)).length;

  const filteredSchools = SCHOOL_CREDENTIALS.filter((s) =>
    s.schoolName.toLowerCase().includes(search.toLowerCase()) ||
    s.district.toLowerCase().includes(search.toLowerCase()) ||
    s.schoolCode.toLowerCase().includes(search.toLowerCase())
  );

  // Keep selectedData in sync whenever submittedData refreshes
  const selectedData = selectedSchool ? getDataForSchool(selectedSchool) : null;

  // ── DEV: log raw localStorage so you can see what fields the form saves ──
  useEffect(() => {
    if (import.meta.env.DEV) {
      try {
        const raw = JSON.parse(localStorage.getItem("emrs_submitted_forms") || "[]");
        console.group("[EMRS Admin] Raw localStorage entries");
        raw.forEach((entry, i) => {
          console.log(
            `Entry ${i + 1}:`,
            "username=", entry.username,
            "| loginId=", entry.loginId,
            "| submittedBy=", entry.submittedBy,
            "| schoolCode=", entry.schoolCode,
            "| EMRScode=", entry.EMRScode,
            "| schoolname=", entry.schoolname,
            "| schoolName=", entry.schoolName,
          );
        });
        console.groupEnd();
      } catch { /* ignore */ }
    }
  }, [submittedData]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f0f4f8", overflow: "hidden" }}>

      {/* ── Top Bar ── */}
      <Box sx={{
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        px: 3, py: 1.5,
        display: "flex", alignItems: "center", gap: 2,
        flexShrink: 0,
        boxShadow: "0 2px 12px rgba(13,71,161,0.3)",
      }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, flex: 1, letterSpacing: 0.5, fontSize: 18 }}>
          🏛️ EMRS Admin Dashboard — Assam
        </Typography>

        {/* Stats chips */}
        {[
          { label: `${submittedCount} Submitted`, color: "#a5d6a7" },
          { label: `${SCHOOL_CREDENTIALS.length - submittedCount} Pending`, color: "#ffcc80" },
        ].map(({ label, color }) => (
          <Chip key={label} label={label} size="small"
            sx={{ background: "rgba(255,255,255,0.15)", color, fontWeight: 700, fontSize: 11 }} />
        ))}
        {/* Physical progress chip — shows selected school progress, else avg */}
        {(() => {
          if (selectedSchool) {
            const prog = PHYSICAL_PROGRESS[selectedSchool.schoolCode];
            const pct  = prog ? prog.pct : null;
            return (
              <Chip
                label={pct !== null ? `Physical Progress: ${pct}%` : "Physical: N/A"}
                size="small"
                sx={{
                  background: pct === 100 ? "rgba(46,125,50,0.35)"
                            : pct >= 50   ? "rgba(245,124,0,0.35)"
                            : "rgba(198,40,40,0.25)",
                  color: pct === 100 ? "#a5d6a7" : pct >= 50 ? "#ffcc80" : "#ef9a9a",
                  fontWeight: 700, fontSize: 11,
                }}
              />
            );
          }
          // No school selected — show average physical progress across all schools
          const vals = Object.values(PHYSICAL_PROGRESS);
          const avg  = Math.round(vals.reduce((s, v) => s + v.pct, 0) / vals.length);
          return (
            <Chip label={`Avg Physical: ${avg}%`} size="small"
              sx={{ background: "rgba(255,255,255,0.15)", color: "#ce93d8", fontWeight: 700, fontSize: 11 }} />
          );
        })()}

        <Chip label={user?.name || "Admin"} size="small"
          sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700 }} />
        <Tooltip title="Logout">
          <IconButton onClick={() => { logout(); navigate("/login"); }}
            sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 1.5, p: 0.6 }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Body: Sidebar + Detail ── */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR: schools ── */}
        <Box sx={{
          width: 260,
          flexShrink: 0,
          background: "#fff",
          borderRight: "1px solid #e8edf5",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        }}>
          {/* Sidebar header */}
          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0", background: "#f8fafc" }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#546e7a", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.8 }}>
              All {SCHOOL_CREDENTIALS.length} EMRS Schools
            </Typography>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#90a4ae" }} /></InputAdornment>,
                sx: { fontSize: 12, borderRadius: 1.5 },
              }}
            />
            {/* Legend */}
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#43a047" }} />
                <Typography variant="caption" sx={{ fontSize: 9, color: "#78909c", fontWeight: 600 }}>Submitted</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#e0e0e0" }} />
                <Typography variant="caption" sx={{ fontSize: 9, color: "#78909c", fontWeight: 600 }}>Pending</Typography>
              </Box>
            </Box>
          </Box>

          {/* School list */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {filteredSchools.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, color: "#b0bec5" }}>
                <Typography variant="caption">No schools found</Typography>
              </Box>
            ) : (
              filteredSchools.map((school) => (
                <SchoolListItem
                  key={school.id}
                  school={school}
                  index={SCHOOL_CREDENTIALS.indexOf(school)}
                  isSelected={selectedSchool?.id === school.id}
                  isSubmitted={!!getDataForSchool(school)}
                  onClick={() => setSelectedSchool(school)}
                />
              ))
            )}
          </Box>

          {/* Sidebar footer: submission progress */}
          <Box sx={{ px: 2, py: 1.5, borderTop: "1px solid #f0f0f0", background: "#f8fafc" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#546e7a", fontSize: 10 }}>SUBMISSION PROGRESS</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#1976d2", fontSize: 10 }}>{submittedCount}/{SCHOOL_CREDENTIALS.length}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(submittedCount / SCHOOL_CREDENTIALS.length) * 100}
              sx={{ height: 6, borderRadius: 3, background: "#e0e0e0", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #1976d2, #42a5f5)" } }}
            />
          </Box>
        </Box>

        {/* ── RIGHT PANEL: Detail view ── */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <SchoolDetailPanel
            school={selectedSchool}
            data={selectedData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EMRSAdminDashboard;