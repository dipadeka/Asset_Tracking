import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/* ── small helpers ── */
const Field = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>
      {value || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>—</span>}
    </Typography>
  </Box>
);

const SectionHeader = ({ emoji, title, color = "#1976d2" }) => (
  <Box
    sx={{
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      px: 3,
      py: 1.5,
      borderRadius: 2,
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Typography sx={{ fontSize: 22 }}>{emoji}</Typography>
    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{title}</Typography>
  </Box>
);

const PreviewAccordion = ({ emoji, title, color, children, defaultExpanded = false }) => (
  <Accordion
    defaultExpanded={defaultExpanded}
    sx={{ mb: 2, borderRadius: "12px !important", overflow: "hidden", "&::before": { display: "none" } }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
      sx={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff" }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
        {emoji} {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 3, background: "#f8fafc" }}>{children}</AccordionDetails>
  </Accordion>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PREVIEW COMPONENT
───────────────────────────────────────────────────────────── */
const EMRSFormPreview = ({
  formValues = {},
  enrollmentRows = [],
  teachingRows = [],
  nonTeachingRows = [],
  constructionRows = {},
  hospitalizationRows = [],
  extraCurricularRows = [],
  operationalCostRows = [],
  staffAttendanceRows = [],
  studentAttendanceData = [],
  uploadedImages = {},
  procurements = [],
  financialData = {},
  recurringBreakup = [],
}) => {
  const totalImages = Object.values(uploadedImages).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  /* quick stat chips at top */
  const stats = [
    { label: "Teaching Staff", value: teachingRows.length, icon: "👨‍🏫" },
    { label: "Non-Teaching", value: nonTeachingRows.length, icon: "🧹" },
    { label: "Enrollment Records", value: enrollmentRows.length, icon: "🎓" },
    { label: "Student Attendance", value: studentAttendanceData.length, icon: "📋" },
    { label: "Procurements", value: procurements.length, icon: "📦" },
    { label: "Photos Uploaded", value: totalImages, icon: "📸" },
  ];

  return (
    <Box>
      {/* ── Top Banner ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
          borderRadius: 3,
          px: 3,
          py: 3,
          mb: 3,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 36, mb: 0.5 }}>👁️</Typography>
        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>
          EMRS Form Preview
        </Typography>
        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
          Review all entered data before final submission
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
          ⚠️ Please review all sections carefully before clicking Submit.
        </Typography>
        Once submitted, the form will be recorded and sent to the EMRS portal.
      </Alert>

      {/* ── Quick Stats ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map(({ label, value, icon }) => (
          <Grid item xs={6} sm={4} md={2} key={label}>
            <Paper
              elevation={0}
              sx={{ p: 2, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 2 }}
            >
              <Typography sx={{ fontSize: 22 }}>{icon}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#1976d2" }}>{value}</Typography>
              <Typography sx={{ fontSize: 11, color: "#64748b" }}>{label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ══════════════ 1. SCHOOL DETAILS ══════════════ */}
      <PreviewAccordion emoji="🏫" title="School Details" color="#1976d2" defaultExpanded>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}><Field label="EMRS Code" value={formValues.EMRScode} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="EMRS ID" value={formValues.EMRSid} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="UDISE Code" value={formValues.udaisecode} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="School Name" value={formValues.schoolname} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="School Type" value={formValues.schooltype} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Affiliation" value={formValues.Affiliation} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Principal" value={formValues.NameofthePrincipal} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Contact" value={formValues.contactno} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Email" value={formValues.emailid} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="State" value={formValues.state} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="District" value={formValues.district} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Block" value={formValues.block} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Gram Panchayat" value={formValues.gramPanchayat} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Village" value={formValues.village} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Pincode" value={formValues.pincode} /></Grid>
        </Grid>
      </PreviewAccordion>

      {/* ══════════════ 2. INFRASTRUCTURE ══════════════ */}
      <PreviewAccordion emoji="🔬" title="Infrastructure Details" color="#0f766e">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}><Field label="Total Classrooms" value={formValues.totalClassrooms} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Smart Classrooms" value={formValues.classroomWithSmartClass} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Classrooms with Projector" value={formValues.classroomWithProjector} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Science Lab" value={formValues.scienceLab} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Biology Lab" value={formValues.biologyLab} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Chemistry Lab" value={formValues.chemistryLab} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Physics Lab" value={formValues.physicsLab} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Computer Lab" value={formValues.computerLab} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Library" value={formValues.library} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Books in Library" value={formValues.booksInLibrary} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Playground" value={formValues.playground} /></Grid>
          <Grid item xs={12} sm={6} md={4}><Field label="Auditorium" value={formValues.Auditorium} /></Grid>
        </Grid>
      </PreviewAccordion>

      {/* ══════════════ 3. CONSTRUCTION ══════════════ */}
      <PreviewAccordion emoji="🏗️" title="Construction Status" color="#7c3aed">
        {Object.entries(constructionRows).map(([category, rows]) =>
          rows && rows.length > 0 ? (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#7c3aed", mb: 1, textTransform: "capitalize" }}>
                {category}
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "#f1f5f9" }}>
                      {["Component", "Status", "Progress %", "Start Date", "End Date"].map((h) => (
                        <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ fontSize: 12 }}>{r.component}</TableCell>
                        <TableCell>
                          <Chip
                            label={r.status}
                            size="small"
                            sx={{
                              fontSize: 10,
                              background:
                                r.status === "Completed" ? "#dcfce7" :
                                r.status === "In Progress" ? "#fef3c7" : "#f1f5f9",
                              color:
                                r.status === "Completed" ? "#16a34a" :
                                r.status === "In Progress" ? "#d97706" : "#64748b",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{r.progress || 0}%</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{r.startDate || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{r.endDate || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : null
        )}
      </PreviewAccordion>

      {/* ══════════════ 4. ENROLLMENT ══════════════ */}
      <PreviewAccordion emoji="🎓" title="Enrollment Data" color="#0369a1">
        {enrollmentRows.length === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No enrollment records added.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  {["Academic Year", "Class", "Section", "Sanctioned", "Enrolled"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollmentRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: 12 }}>{r.academicYear || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.class || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.section || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.sanctionedCapacity || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.currentEnrollment || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PreviewAccordion>

      {/* ══════════════ 5. STAFF ══════════════ */}
      <PreviewAccordion emoji="👨‍🏫" title="Teaching Staff" color="#1976d2">
        {teachingRows.length === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No teaching staff added.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  {["#", "Post", "Name", "DOB", "Date of Joining", "Contact"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {teachingRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: 12 }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.post || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{r.name || r.staffName || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.dob || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.doj || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.contact || r.contactNumber || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PreviewAccordion>

      <PreviewAccordion emoji="🧹" title="Non-Teaching Staff" color="#7c3aed">
        {nonTeachingRows.length === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No non-teaching staff added.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  {["#", "Post", "Name", "DOB", "Date of Joining", "Contact"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {nonTeachingRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: 12 }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.post || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{r.name || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.dob || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.doj || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.contact || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PreviewAccordion>

      {/* ══════════════ 6. ATTENDANCE ══════════════ */}
      <PreviewAccordion emoji="📅" title="Staff Attendance Summary" color="#374151">
        {staffAttendanceRows.length === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No staff attendance records.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  {["#", "Type", "Post", "Name", "Month", "Working Days", "Present", "Absent", "Attendance %"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {staffAttendanceRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: 12 }}>{i + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.staffType === "Teaching" ? "🏫 T" : "🧹 NT"}
                        size="small"
                        sx={{
                          fontSize: 10,
                          background: r.staffType === "Teaching" ? "#dbeafe" : "#ede9fe",
                          color: r.staffType === "Teaching" ? "#1d4ed8" : "#7c3aed",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.post || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{r.name || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.month || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center" }}>{r.workingDays || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center", color: "#16a34a", fontWeight: 700 }}>{r.daysPresent}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center", color: "#dc2626", fontWeight: 700 }}>{r.daysAbsent}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center" }}>
                      <Box
                        sx={{
                          px: 1.5, py: 0.2, borderRadius: 10, display: "inline-block", fontWeight: 700,
                          background: r.percentage >= 75 ? "#dcfce7" : r.percentage >= 50 ? "#fef3c7" : "#fee2e2",
                          color: r.percentage >= 75 ? "#16a34a" : r.percentage >= 50 ? "#d97706" : "#dc2626",
                        }}
                      >
                        {r.percentage}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PreviewAccordion>

      <PreviewAccordion emoji="🎓" title="Student Attendance Summary" color="#0f766e">
        {studentAttendanceData.length === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No student attendance records.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  {["Roll No", "Name", "Class", "Section", "Month", "Working Days", "Present", "Absent", "Attendance %"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentAttendanceData.slice(0, 20).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: 12 }}>{r.rollNo}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>{r.name}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.class}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.section}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{r.month}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center" }}>{r.workingDays}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center", color: "#16a34a", fontWeight: 700 }}>{r.daysPresent}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center", color: "#dc2626", fontWeight: 700 }}>{r.daysAbsent}</TableCell>
                    <TableCell sx={{ fontSize: 12, textAlign: "center" }}>
                      <Box
                        sx={{
                          px: 1, py: 0.2, borderRadius: 10, display: "inline-block", fontWeight: 700, fontSize: 11,
                          background: r.percentage >= 75 ? "#dcfce7" : r.percentage >= 50 ? "#fef3c7" : "#fee2e2",
                          color: r.percentage >= 75 ? "#16a34a" : r.percentage >= 50 ? "#d97706" : "#dc2626",
                        }}
                      >
                        {r.percentage}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {studentAttendanceData.length > 20 && (
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                  Showing 20 of {studentAttendanceData.length} records
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}
      </PreviewAccordion>

      {/* ══════════════ 7. FINANCIAL ══════════════ */}
      <PreviewAccordion emoji="📊" title="Financial & Procurement" color="#0369a1">
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}><Field label="Academic Year" value={financialData.academicYear} /></Grid>
          <Grid item xs={12} sm={4}><Field label="Funds Allocated" value={financialData.totalFundsAllocated ? `₹ ${Number(financialData.totalFundsAllocated).toLocaleString("en-IN")}` : ""} /></Grid>
          <Grid item xs={12} sm={4}><Field label="Funds Utilized" value={financialData.totalFundsUtilized ? `₹ ${Number(financialData.totalFundsUtilized).toLocaleString("en-IN")}` : ""} /></Grid>
          <Grid item xs={12} sm={4}><Field label="Utilization %" value={financialData.utilizationPercentage ? `${financialData.utilizationPercentage}%` : ""} /></Grid>
          <Grid item xs={12} sm={4}><Field label="Audit Conducted" value={financialData.auditConducted} /></Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>GeM Procurement %</Typography>
              <Chip
                label={`${financialData.gemProcurementPercentage || 0}%`}
                size="small"
                sx={{ background: "#dbeafe", color: "#1d4ed8", fontWeight: 700 }}
              />
            </Box>
          </Grid>
        </Grid>

        {procurements.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#374151", mb: 1.5 }}>Procurement Records</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: "#f1f5f9" }}>
                    {["#", "Type", "Description", "Qty", "Value", "Vendor", "Through GeM"].map((h) => (
                      <TableCell key={h} sx={{ fontSize: 11, fontWeight: 700 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procurements.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontSize: 12 }}>{i + 1}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{p.type || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{p.description || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{p.totalNumber || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{p.value ? `₹ ${Number(p.value).toLocaleString("en-IN")}` : "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{p.vendor || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        <Chip
                          label={p.throughGem ? `${p.throughGem} via GeM` : "—"}
                          size="small"
                          sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: 10 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </PreviewAccordion>

      {/* ══════════════ 8. UPLOADED IMAGES ══════════════ */}
      <PreviewAccordion emoji="📸" title={`Uploaded Photos (${totalImages})`} color="#0f172a">
        {totalImages === 0 ? (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>No images uploaded.</Typography>
        ) : (
          Object.entries(uploadedImages).map(([category, images]) =>
            images && images.length > 0 ? (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1e3a5f", mb: 1.5, textTransform: "capitalize" }}>
                  📂 {category} ({images.length} image{images.length > 1 ? "s" : ""})
                </Typography>
                <Grid container spacing={1.5}>
                  {images.map((img, idx) => (
                    <Grid item xs={6} sm={3} md={2} key={idx}>
                      <Box
                        component="img"
                        src={img.dataUrl}
                        alt={img.name}
                        sx={{
                          width: "100%",
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Typography sx={{ fontSize: 10, color: "#64748b", mt: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {img.name}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : null
          )
        )}
      </PreviewAccordion>

      {/* ── Final Confirmation ── */}
      <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
          ✅ All sections reviewed — Click <strong>Submit</strong> below to finalize.
        </Typography>
      </Alert>
    </Box>
  );
};

export default EMRSFormPreview;