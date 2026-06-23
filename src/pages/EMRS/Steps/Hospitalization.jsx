import React from "react";
import {
  Box, Grid, Typography, TextField, MenuItem, Button,
  IconButton, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const HospitalizationSection = ({
  hospitalizationRows,
  setHospitalizationRows,
  eyeDateErrors,
  setEyeDateErrors,
  earDateErrors,
  setEarDateErrors,
  emptyHospitalizationRow,
  calculateHealthMarks,
  validateBiAnnualDate,
  addEyeRow,
  addEarRow,
  blankNurseEntry,
  blankActivity,
  blankVisitLog,
}) => {
  return (
    <>
      {/* ================= HOSPITALIZATION SECTION ================= */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)", color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2 }}>
            Hospitalization Details
          </Typography>
        </Grid>
      </Grid>

      {hospitalizationRows.map((row, index) => (
        <Box key={index} sx={{ border: "1px solid #cbd5e1", borderRadius: 2, padding: 3, mb: 2, backgroundColor: "#fff" }}>

          {/* ── HOSPITAL INFO ── */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Hospital Details</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Nearest Government Hospital" fullWidth size="small" value={row.hospitalEmpanelled}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].hospitalEmpanelled = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Private Hospital Engaged With (if any)" fullWidth size="small" value={row.privateHospital || ""}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].privateHospital = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Department" fullWidth size="small" sx={{ minWidth: 220 }} value={row.empanelmentDepartment || ""}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].empanelmentDepartment = e.target.value; setHospitalizationRows(u); }}>
                {["General Medicine","General Surgery","Ophthalmology (Eyes)","ENT (Ear, Nose & Throat)","Orthopaedics","Paediatrics","Dermatology (Skin)","Dental","Gynaecology","Cardiology","Neurology","Psychiatry / Mental Health","Pulmonology (Lungs)","Gastroenterology","Nephrology (Kidney)","Urology","Oncology (Cancer)","Endocrinology","Haematology (Blood)","Emergency / Trauma","Physiotherapy","Radiology / Imaging","Pathology / Lab","Other"]
                  .map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          {/* ── STUDENT INFO ── */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Student Information</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Student Name" fullWidth size="small" value={row.studentName}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].studentName = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Roll No" fullWidth size="small" value={row.rollNo}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].rollNo = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField select label="Class" fullWidth size="small" sx={{ minWidth: 220 }} value={row.class}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].class = e.target.value; setHospitalizationRows(u); }}>
                {["6","7","8","9","10","11","12"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField select label="Section" fullWidth size="small" sx={{ minWidth: 220 }} value={row.section}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].section = e.target.value; setHospitalizationRows(u); }}>
                {["A","B","C"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Guardian Name" fullWidth size="small" value={row.guardianName}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].guardianName = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Guardian Contact" fullWidth size="small" value={row.guardianContact}
                inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) e.preventDefault(); }}
                error={row.guardianContact && row.guardianContact.toString().length !== 10}
                helperText={row.guardianContact && row.guardianContact.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].guardianContact = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
          </Grid>

          {/* ── ADMISSION INFO ── */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Admission & Treatment Details</Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Date of Admission" fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={row.admissionDate}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].admissionDate = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Date of Discharge" fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={row.dischargeDate}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].dischargeDate = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Reason for Hospitalization" fullWidth size="small" multiline rows={3} value={row.reasonForHospitalization}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].reasonForHospitalization = e.target.value; setHospitalizationRows(u); }} />
            </Grid>
          </Grid>

          {/* ── CLAIM INFO ── */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>Cost & Claim Details</Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Estimated Cost (₹)" fullWidth size="small" type="number" value={row.estimatedCost} inputProps={{ min: 0 }}
                onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].estimatedCost = e.target.value; setHospitalizationRows(u); } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Amount Claimed (₹)" fullWidth size="small" type="number" value={row.amountClaimed} inputProps={{ min: 0 }}
                onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].amountClaimed = e.target.value; setHospitalizationRows(u); } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Claim Status" fullWidth size="small" sx={{ minWidth: 220 }} value={row.claimStatus}
                onChange={(e) => { const u = [...hospitalizationRows]; u[index].claimStatus = e.target.value; setHospitalizationRows(u); }}>
                {["Pending","Submitted","Approved","Rejected","Partially Approved"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          {/* ── Add Case Button ── */}
          <Box mb={4}>
            <Button variant="outlined" onClick={() => setHospitalizationRows([...hospitalizationRows, emptyHospitalizationRow()])}>
              + Add Hospitalization Case
            </Button>
          </Box>

          {/* ── HEALTH MONITORING & MEDICAL COMPLIANCE ── */}
          <Box sx={{ border: "1px solid #dce3f0", borderRadius: 2, overflow: "hidden", mb: 3 }}>
            <Box sx={{ background: "#1a56a0", px: 2.5, py: 1.2 }}>
              <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Health Monitoring &amp; Medical Compliance
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: "flex", gap: 3, flexWrap: "wrap" }}>

              {/* LEFT — dropdowns + marks */}
              <Box sx={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 1.5 }}>

                {/* ── All dropdowns except Sickle Cell ── */}
                {[
                  "Annual Health Check Conducted",
                  "Part-Time Doctor Engaged",
                  "Medical Register Maintained",
                ].map((label, idx) => (
                  <TextField key={idx} select fullWidth size="small" label={label} value={row[label] || ""}
                    onChange={(e) => {
                      const u = [...hospitalizationRows];
                      u[index][label] = e.target.value;
                      u[index].marksHealth = calculateHealthMarks(u[index]);
                      setHospitalizationRows(u);
                    }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                ))}

                {/* ── SICKLE CELL SCREENING ── */}
                <TextField
                  select fullWidth size="small"
                  label="Sickle Cell Screening Conducted"
                  value={row["Sickle Cell Screening Conducted"] || ""}
                  onChange={(e) => {
                    const u = [...hospitalizationRows];
                    u[index]["Sickle Cell Screening Conducted"] = e.target.value;
                    u[index].marksHealth = calculateHealthMarks(u[index]);
                    setHospitalizationRows(u);
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>

                {/* ── SICKLE CELL DETAILS — shown when Yes ── */}
                {row["Sickle Cell Screening Conducted"] === "Yes" && (
                  <Box sx={{ border: "1.5px solid #1a56a0", borderRadius: 1.5, overflow: "hidden", mt: 0.5 }}>
                    <Box sx={{ background: "#1a56a0", px: 2, py: 0.8 }}>
                      <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🧬 Sickle Cell Screening Details
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, background: "#f7faff", display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Grid container spacing={2}>

                        {/* Screening Date */}
                        <Grid item xs={12} sm={6}>
                          <TextField label="Screening Date" fullWidth size="small" type="date"
                            InputLabelProps={{ shrink: true }}
                            value={row.sickleCellScreeningDate || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellScreeningDate = e.target.value; setHospitalizationRows(u); }} />
                        </Grid>

                        {/* Conducted By */}
                        <Grid item xs={12} sm={6}>
                          <TextField select label="Conducted By" fullWidth size="small"
                            value={row.sickleCellConductedBy || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellConductedBy = e.target.value; setHospitalizationRows(u); }}>
                            {["Government Hospital Team","Mobile Health Unit","ASHA / ANM Worker","NGO / External Agency","School Medical Staff","Other"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                          </TextField>
                        </Grid>

                        {/* Total Students Screened */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField label="Total Students Screened" fullWidth size="small" type="number" inputProps={{ min: 0 }}
                            onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                            value={row.sickleCellTotalScreened || ""}
                            onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].sickleCellTotalScreened = e.target.value; setHospitalizationRows(u); } }} />
                        </Grid>

                        {/* Positive Cases */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField label="Positive Cases Detected" fullWidth size="small" type="number" inputProps={{ min: 0 }}
                            onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                            value={row.sickleCellPositiveCases || ""}
                            onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].sickleCellPositiveCases = e.target.value; setHospitalizationRows(u); } }} />
                        </Grid>

                        {/* Referred for Further Treatment */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField label="Students Referred for Treatment" fullWidth size="small" type="number" inputProps={{ min: 0 }}
                            onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                            value={row.sickleCellReferred || ""}
                            onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].sickleCellReferred = e.target.value; setHospitalizationRows(u); } }} />
                        </Grid>

                        {/* Prevention Counselling Done */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField select label="Prevention Counselling Done" fullWidth size="small" sx={{ minWidth: 220 }}
                            value={row.sickleCellCounsellingDone || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellCounsellingDone = e.target.value; setHospitalizationRows(u); }}>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        </Grid>

                        {/* Awareness Program Conducted */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField select label="Awareness Program Conducted" fullWidth size="small" sx={{ minWidth: 220 }}
                            value={row.sickleCellAwarenessProgram || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellAwarenessProgram = e.target.value; setHospitalizationRows(u); }}>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        </Grid>

                        {/* Follow-up Status */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField select label="Follow-up Status" fullWidth size="small" sx={{ minWidth: 220 }}
                            value={row.sickleCellFollowUpStatus || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellFollowUpStatus = e.target.value; setHospitalizationRows(u); }}>
                            {["Completed","Ongoing","Pending","Not Required"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </TextField>
                        </Grid>

                        {/* Remarks */}
                        <Grid item xs={12}>
                          <TextField label="Remarks / Additional Notes" fullWidth size="small" multiline rows={2}
                            value={row.sickleCellRemarks || ""}
                            onChange={(e) => { const u = [...hospitalizationRows]; u[index].sickleCellRemarks = e.target.value; setHospitalizationRows(u); }} />
                        </Grid>

                      </Grid>
                    </Box>
                  </Box>
                )}

                {/* ── Remaining dropdowns ── */}
                {[
                  "Eye Checkup Conducted",
                  "Ear Checkup Conducted",
                ].map((label, idx) => (
                  <TextField key={idx} select fullWidth size="small" label={label} value={row[label] || ""}
                    onChange={(e) => {
                      const u = [...hospitalizationRows];
                      u[index][label] = e.target.value;
                      u[index].marksHealth = calculateHealthMarks(u[index]);
                      setHospitalizationRows(u);
                    }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                ))}

                {/* Marks Box */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f7faff", border: "1px solid #c8d4e8", borderRadius: 1.5, px: 2, py: 1.2 }}>
                  <Typography sx={{ fontSize: "0.72rem", color: "#5a6a85", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Marks Obtained (out of 7)
                  </Typography>
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: 500, color: row.marksHealth === 7 ? "#b8860b" : row.marksHealth === 5 ? "#155724" : row.marksHealth === 3 ? "#856404" : row.marksHealth === 1 ? "#7d3c0c" : row.marksHealth === 0 ? "#721c24" : "#1a1a2e" }}>
                    {row.marksHealth !== undefined && row.marksHealth !== null ? row.marksHealth : "—"}
                  </Typography>
                </Box>
              </Box>

              {/* RIGHT — criteria table */}
              <Box sx={{ minWidth: 300, flex: "0 0 340px", border: "1.5px solid #1a56a0", borderRadius: 1.5, overflow: "hidden" }}>
                <Box sx={{ background: "#1a56a0", px: 2, py: 0.9, display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.68rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Compliance Status</Typography>
                  <Typography sx={{ color: "#fff", fontSize: "0.68rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Marks</Typography>
                </Box>
                {[
                  
                  { status: "5 or 6 conditions fulfilled",  marks: 7, bg: "#d4edda", color: "#155724", border: "#b8dfc4" },
                  { status: "3 or 4 conditions fulfilled",  marks: 5, bg: "#fff3cd", color: "#856404", border: "#f0d78c" },
                  { status: "1 or 2 conditions fulfilled",  marks: 3, bg: "#fde8d8", color: "#7d3c0c", border: "#f0c09a" },
                  { status: "No condition fulfilled",       marks: 0, bg: "#f8d7da", color: "#721c24", border: "#f0b8bd" },
                ].map((r, i) => (
                  <Box key={r.status} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderTop: "0.5px solid #dce3f0", borderLeft: row.marksHealth === r.marks ? "3px solid #1a56a0" : "3px solid transparent", background: row.marksHealth === r.marks ? "#e8f0fb" : i % 2 === 0 ? "#f7faff" : "#fff" }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "#1a1a2e" }}>{r.status}</Typography>
                    <Box sx={{ background: r.bg, color: r.color, border: `0.5px solid ${r.border}`, borderRadius: "3px", px: 1.5, py: 0.2, fontSize: "0.75rem", fontWeight: 500, minWidth: 28, textAlign: "center" }}>{r.marks}</Box>
                  </Box>
                ))}
                <Box sx={{ background: "#e8f0fb", borderTop: "1px solid #c8d4e8", px: 2, py: 0.7, textAlign: "right" }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#0c447c" }}>Total: out of 7 marks</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── EYE & EAR HEALTH ── */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#1a56a0", textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "1px solid #c8d4e8", pb: 0.5 }}>
                👁 Eye Health Details
              </Typography>
              {(row.eyeEntries || []).map((eye, ei) => (
                <Box key={ei} sx={{ border: "1px solid #e3eaf5", borderRadius: 1.5, p: 2, background: "#f7faff", position: "relative" }}>
                  {(row.eyeEntries || []).length > 0 && (
                    <IconButton size="small" sx={{ position: "absolute", top: 6, right: 6, color: "#c62828" }}
                      onClick={() => {
                        const u = [...hospitalizationRows];
                        u[index].eyeEntries = u[index].eyeEntries.filter((_, i) => i !== ei);
                        setHospitalizationRows(u);
                        const errKey = `${index}-${ei}`;
                        setEyeDateErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; });
                      }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Eye Specialist Name" fullWidth size="small" value={eye.eyeSpecialistName || ""}
                        onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].eyeEntries[ei].eyeSpecialistName = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DesktopDatePicker label="Checkup Date (Bi-Annual)" value={eye.eyeCheckupDate ? dayjs(eye.eyeCheckupDate) : null} format="DD/MM/YYYY"
                        onChange={(newVal) => {
                          const formatted = newVal && newVal.isValid() ? newVal.format("YYYY-MM-DD") : "";
                          const u = [...hospitalizationRows];
                          const errKey = `${index}-${ei}`;
                          const error = formatted ? validateBiAnnualDate(formatted, u[index].eyeEntries, ei, "eyeCheckupDate") : null;
                          if (error) { setEyeDateErrors((prev) => ({ ...prev, [errKey]: error })); }
                          else { setEyeDateErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; }); }
                          u[index].eyeEntries[ei].eyeCheckupDate = formatted;
                          setHospitalizationRows(u);
                        }}
                        slotProps={{ textField: { fullWidth: true, size: "small", error: !!eyeDateErrors[`${index}-${ei}`], helperText: eyeDateErrors[`${index}-${ei}`] ? `⚠️ ${eyeDateErrors[`${index}-${ei}`]}` : "Must be 6+ months from other entries", FormHelperTextProps: { sx: { color: eyeDateErrors[`${index}-${ei}`] ? "#c62828" : "#888", fontSize: "0.68rem" } } } }} />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField select label="Class" fullWidth size="small" sx={{ minWidth: 220 }} value={eye.eyeClass || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].eyeEntries[ei].eyeClass = e.target.value; setHospitalizationRows(u); }}>
                        {["6","7","8","9","10","11","12"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField select label="Section" fullWidth size="small" sx={{ minWidth: 220 }} value={eye.eyeSection || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].eyeEntries[ei].eyeSection = e.target.value; setHospitalizationRows(u); }}>
                        {["A","B","C"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </TextField>
                    </Grid>
                    {[
                      { label: "No. of Students Screened", field: "eyeStudentsScreened" },
                      { label: "No. of Students with Eye Problem", field: "eyeStudentsWithProblem" },
                      { label: "No. of Students requiring Spectacle", field: "eyeNeedsSpectacle" },
                      { label: "No. of Students requiring Higher Investigation/Treatment", field: "eyeNeedsHigherInvestigation" },
                    ].map(({ label, field }) => (
                      <Grid item xs={12} sm={6} md={3} key={field}>
                        <TextField label={label} fullWidth size="small" type="number" inputProps={{ min: 0 }}
                          onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                          value={eye[field] || ""}
                          onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].eyeEntries[ei][field] = e.target.value; setHospitalizationRows(u); } }} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
              <Button variant="outlined" size="small" sx={{ alignSelf: "flex-start" }} onClick={() => addEyeRow(index)}>+ Add Eye Entry</Button>

              {/* Ear Header */}
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#1a56a0", textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "1px solid #c8d4e8", pb: 0.5, mt: 1 }}>
                👂 Ear Health Details
              </Typography>
              {(row.earEntries || []).map((ear, eri) => (
                <Box key={eri} sx={{ border: "1px solid #e3eaf5", borderRadius: 1.5, p: 2, background: "#f7faff", position: "relative" }}>
                  {(row.earEntries || []).length > 0 && (
                    <IconButton size="small" sx={{ position: "absolute", top: 6, right: 6, color: "#c62828" }}
                      onClick={() => {
                        const u = [...hospitalizationRows];
                        u[index].earEntries = u[index].earEntries.filter((_, i) => i !== eri);
                        setHospitalizationRows(u);
                        const errKey = `${index}-${eri}`;
                        setEarDateErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; });
                      }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Ear Specialist Name" fullWidth size="small" value={ear.earSpecialistName || ""}
                        onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].earEntries[eri].earSpecialistName = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DesktopDatePicker label="Checkup Date (Bi-Annual)" value={ear.earCheckupDate ? dayjs(ear.earCheckupDate) : null} format="DD/MM/YYYY"
                        onChange={(newVal) => {
                          const formatted = newVal && newVal.isValid() ? newVal.format("YYYY-MM-DD") : "";
                          const u = [...hospitalizationRows];
                          const errKey = `${index}-${eri}`;
                          const error = formatted ? validateBiAnnualDate(formatted, u[index].earEntries, eri, "earCheckupDate") : null;
                          if (error) { setEarDateErrors((prev) => ({ ...prev, [errKey]: error })); }
                          else { setEarDateErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; }); }
                          u[index].earEntries[eri].earCheckupDate = formatted;
                          setHospitalizationRows(u);
                        }}
                        slotProps={{ textField: { fullWidth: true, size: "small", error: !!earDateErrors[`${index}-${eri}`], helperText: earDateErrors[`${index}-${eri}`] ? `⚠️ ${earDateErrors[`${index}-${eri}`]}` : "Must be 6+ months from other entries", FormHelperTextProps: { sx: { color: earDateErrors[`${index}-${eri}`] ? "#c62828" : "#888", fontSize: "0.68rem" } } } }} />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField select label="Class" fullWidth size="small" sx={{ minWidth: 220 }} value={ear.earClass || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].earEntries[eri].earClass = e.target.value; setHospitalizationRows(u); }}>
                        {["6","7","8","9","10","11","12"].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField select label="Section" fullWidth size="small" sx={{ minWidth: 220 }} value={ear.earSection || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].earEntries[eri].earSection = e.target.value; setHospitalizationRows(u); }}>
                        {["A","B","C"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </TextField>
                    </Grid>
                    {[
                      { label: "No. of Students Screened", field: "earStudentsScreened" },
                      { label: "No. of Students with Ear Problem", field: "earStudentsWithProblem" },
                      { label: "No. of Students requiring Ear Equipment", field: "earNeedsEquipment" },
                    ].map(({ label, field }) => (
                      <Grid item xs={12} sm={6} md={4} key={field}>
                        <TextField label={label} fullWidth size="small" type="number" inputProps={{ min: 0 }}
                          onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                          value={ear[field] || ""}
                          onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].earEntries[eri][field] = e.target.value; setHospitalizationRows(u); } }} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
              <Button variant="outlined" size="small" sx={{ alignSelf: "flex-start" }} onClick={() => addEarRow(index)}>+ Add Ear Entry</Button>
            </Box>
          </LocalizationProvider>

          {/* ── MEDICAL STAFF DETAILS ── */}
          <Box sx={{ border: "1px solid #dce3f0", borderRadius: 2, overflow: "hidden", mb: 3 }}>
            <Box sx={{ background: "linear-gradient(to right, #0d47a1, #1976d2)", px: 2.5, py: 1.4 }}>
              <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                🏥 Medical Staff Details
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>

              {/* Staff Nurse */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d47a1", textTransform: "uppercase", letterSpacing: "0.5px", borderLeft: "3px solid #1976d2", pl: 1 }}>
                  🩺 Staff Nurse Details (24×7 Duty)
                </Typography>
                <Button size="small" variant="outlined" startIcon={<AddCircleOutlineIcon />}
                  onClick={() => { const u = [...hospitalizationRows]; u[index].nurseEntries = [...(u[index].nurseEntries || []), blankNurseEntry()]; setHospitalizationRows(u); }}>
                  Add Nurse Details
                </Button>
              </Box>

              {(row.nurseEntries || []).map((nurse, ni) => (
                <Box key={ni} sx={{ border: "1px solid #e3eaf5", borderRadius: 1.5, p: 2, mb: 1.5, background: "#f7faff", position: "relative" }}>
                  {(row.nurseEntries || []).length > 1 && (
                    <IconButton size="small" sx={{ position: "absolute", top: 6, right: 6, color: "#c62828" }}
                      onClick={() => { const u = [...hospitalizationRows]; u[index].nurseEntries = u[index].nurseEntries.filter((_, i) => i !== ni); setHospitalizationRows(u); }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Nurse Full Name" fullWidth size="small" value={nurse.nurseName}
                        onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].nurseName = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select label="Qualification" fullWidth size="small" sx={{ minWidth: 220 }} value={nurse.nurseQualification}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].nurseQualification = e.target.value; setHospitalizationRows(u); }}>
                        {["GNM (General Nursing & Midwifery)","ANM (Auxiliary Nurse Midwife)","B.Sc Nursing","M.Sc Nursing","Post Basic B.Sc Nursing","Other"].map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                      </TextField>
                    </Grid>
                   
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Contact Number" fullWidth size="small" sx={{ minWidth: 220 }} value={nurse.nurseContact}
                        inputProps={{ maxLength: 10, inputMode: "numeric" }}
                        onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) e.preventDefault(); }}
                        error={nurse.nurseContact && nurse.nurseContact.length !== 10}
                        helperText={nurse.nurseContact && nurse.nurseContact.length !== 10 ? "Must be 10 digits" : ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].nurseContact = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
</Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Date of Joining" fullWidth size="small" type="date" InputLabelProps={{ shrink: true }} value={nurse.nurseJoiningDate}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].nurseJoiningDate = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                  </Grid>

                  {/* Activity Tracking */}
                  <Box mt={2} sx={{ border: "1px solid #bbdefb", borderRadius: 1.5, p: 1.5, background: "#f0f7ff" }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#1565c0", textTransform: "uppercase", letterSpacing: "0.4px", borderLeft: "3px solid #42a5f5", pl: 1, mb: 1.5 }}>
                      📋 Nurse Activity Tracking
                    </Typography>
                    {(nurse.activities || []).map((act, ai) => (
                      <Box key={ai} sx={{ border: "1px dashed #90caf9", p: 2, mb: 1, borderRadius: 1, background: "#eef6ff", position: "relative" }}>
                        {(nurse.activities || []).length > 1 && (
                          <IconButton size="small" sx={{ position: "absolute", top: 6, right: 6, color: "#c62828" }}
                            onClick={() => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities = u[index].nurseEntries[ni].activities.filter((_, i) => i !== ai); setHospitalizationRows(u); }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField select label="Activity Type" fullWidth size="small" sx={{ minWidth: 220 }} value={act.activityType}
                              onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities[ai].activityType = e.target.value; setHospitalizationRows(u); }}>
                              {["Patient Care","Medication","Ward Round","Emergency Support","Documentation"].map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Activity Description" fullWidth size="small" value={act.activityDesc}
                              onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities[ai].activityDesc = e.target.value; setHospitalizationRows(u); }} />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField type="datetime-local" label="Date & Time" fullWidth size="small" InputLabelProps={{ shrink: true }} value={act.activityDateTime}
                              onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities[ai].activityDateTime = e.target.value; setHospitalizationRows(u); }} />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Remarks" fullWidth size="small" value={act.remarks}
                              onChange={(e) => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities[ai].remarks = e.target.value; setHospitalizationRows(u); }} />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button size="small" variant="outlined" startIcon={<AddCircleOutlineIcon />} sx={{ mt: 0.5 }}
                      onClick={() => { const u = [...hospitalizationRows]; u[index].nurseEntries[ni].activities = [...(u[index].nurseEntries[ni].activities || []), blankActivity()]; setHospitalizationRows(u); }}>
                      Add Activity
                    </Button>
                  </Box>
                </Box>
              ))}

              <Divider />

              {/* Daily Visiting Doctor */}
              <Box>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d47a1", textTransform: "uppercase", letterSpacing: "0.5px", borderLeft: "3px solid #1976d2", pl: 1, mb: 1.5 }}>
                  👨‍⚕️ Daily Visiting Doctor
                </Typography>
                <Box sx={{ border: "1px solid #e3eaf5", borderRadius: 1.5, p: 2, mb: 2, background: "#f7faff" }}>
                  <Typography sx={{ fontSize: "0.7rem", color: "#5a6a85", fontWeight: 500, mb: 1.5, textTransform: "uppercase" }}>Doctor Profile</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Doctor Full Name" fullWidth size="small" onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }} value={row.visitingDoctorName || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].visitingDoctorName = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select label="Specialization" fullWidth size="small" sx={{ minWidth: 220 }} value={row.visitingDoctorSpecialization || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].visitingDoctorSpecialization = e.target.value; setHospitalizationRows(u); }}>
                        {["General Medicine / MBBS","Paediatrics","General Surgery","Gynaecology","Orthopaedics","Dermatology","ENT","Ophthalmology","Other"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Contact Number" fullWidth size="small" value={row.visitingDoctorContact || ""}
                        inputProps={{ maxLength: 10, inputMode: "numeric" }}
                        onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) e.preventDefault(); }}
                        error={row.visitingDoctorContact && row.visitingDoctorContact.length !== 10}
                        helperText={row.visitingDoctorContact && row.visitingDoctorContact.length !== 10 ? "Must be 10 digits" : ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].visitingDoctorContact = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                  </Grid>
                </Box>

                {/* Doctor Visit Log */}
                <Box sx={{ border: "1px solid #dce3f0", borderRadius: 1.5, overflow: "hidden" }}>
                  <Box sx={{ background: "#1a56a0", px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>📋 Doctor Visit Attendance Log</Typography>
                    <Button size="small" variant="outlined" startIcon={<AddCircleOutlineIcon />} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}
                      onClick={() => { const u = [...hospitalizationRows]; u[index].doctorVisitLogs = [...(u[index].doctorVisitLogs || []), blankVisitLog()]; setHospitalizationRows(u); }}>
                      Add Record
                    </Button>
                  </Box>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e8f0fb" }}>
                          {["Visit Date","Visit Status","Remarks / Notes",""].map((h) => (
                            <TableCell key={h} sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#1a56a0", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(row.doctorVisitLogs || []).map((log, li) => (
                          <TableRow key={li} sx={{ "&:hover": { background: "#f7faff" } }}>
                            <TableCell sx={{ minWidth: 150 }}>
                              <TextField size="small" type="date" InputLabelProps={{ shrink: true }} value={log.visitDate}
                                onChange={(e) => { const u = [...hospitalizationRows]; u[index].doctorVisitLogs[li].visitDate = e.target.value; setHospitalizationRows(u); }}
                                sx={{ "& .MuiInputBase-root": { fontSize: "0.78rem" } }} />
                            </TableCell>
                            <TableCell sx={{ minWidth: 200 }}>
                              <TextField select size="small" fullWidth value={log.visitStatus}
                                onChange={(e) => { const u = [...hospitalizationRows]; u[index].doctorVisitLogs[li].visitStatus = e.target.value; setHospitalizationRows(u); }}
                                sx={{ "& .MuiInputBase-root": { fontSize: "0.78rem" } }}>
                                {[{ label: "Visited", bg: "#d4edda", color: "#155724" },{ label: "Absent", bg: "#f8d7da", color: "#721c24" },{ label: "Rescheduled", bg: "#fff3cd", color: "#856404" },{ label: "Emergency Call", bg: "#cce5ff", color: "#004085" },{ label: "Early Departure", bg: "#e2e3e5", color: "#383d41" }]
                                  .map(({ label, bg, color }) => <MenuItem key={label} value={label}><Chip label={label} size="small" sx={{ fontSize: "0.68rem", background: bg, color }} /></MenuItem>)}
                              </TextField>
                            </TableCell>
                            <TableCell sx={{ minWidth: 200 }}>
                              <TextField size="small" fullWidth placeholder="Optional remarks…" value={log.remarks}
                                onChange={(e) => { const u = [...hospitalizationRows]; u[index].doctorVisitLogs[li].remarks = e.target.value; setHospitalizationRows(u); }}
                                sx={{ "& .MuiInputBase-root": { fontSize: "0.78rem" } }} />
                            </TableCell>
                            <TableCell>
                              {(row.doctorVisitLogs || []).length > 1 && (
                                <IconButton size="small" sx={{ color: "#c62828" }}
                                  onClick={() => { const u = [...hospitalizationRows]; u[index].doctorVisitLogs = u[index].doctorVisitLogs.filter((_, i) => i !== li); setHospitalizationRows(u); }}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>

              <Divider />

              {/* Psychological Counsellor */}
              <Box>
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d47a1", textTransform: "uppercase", letterSpacing: "0.5px", borderLeft: "3px solid #1976d2", pl: 1, mb: 1.5 }}>
                  🧠 Psychological Counsellor
                </Typography>
                <Box sx={{ border: "1px solid #e3eaf5", borderRadius: 1.5, p: 2, background: "#f7faff" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Counsellor Full Name" fullWidth size="small" value={row.counsellorName || ""}
                        onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorName = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select label="Qualification" fullWidth size="small" sx={{ minWidth: 220 }} value={row.counsellorQualification || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorQualification = e.target.value; setHospitalizationRows(u); }}>
                        {["M.A. Psychology","M.Sc. Psychology","M.Phil. Clinical Psychology","Ph.D. Psychology","RCI Registered Counsellor","REBT / CBT Certified","Other"].map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Registration / Certificate No." fullWidth size="small" value={row.counsellorRegNo || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorRegNo = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Contact Number" fullWidth size="small" value={row.counsellorContact || ""}
                        inputProps={{ maxLength: 10, inputMode: "numeric" }}
                        onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) e.preventDefault(); }}
                        error={row.counsellorContact && row.counsellorContact.length !== 10}
                        helperText={row.counsellorContact && row.counsellorContact.length !== 10 ? "Must be 10 digits" : ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorContact = e.target.value; setHospitalizationRows(u); }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select label="Available Days" fullWidth size="small" sx={{ minWidth: 220 }}
                        SelectProps={{ multiple: true, renderValue: (selected) => (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{selected.map((v) => <Chip key={v} label={v} size="small" />)}</Box>) }}
                        value={row.counsellorAvailableDays || []}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorAvailableDays = typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value; setHospitalizationRows(u); }}>
                        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField select label="Session Type" fullWidth size="small" sx={{ minWidth: 220 }} value={row.counsellorSessionType || ""}
                        onChange={(e) => { const u = [...hospitalizationRows]; u[index].counsellorSessionType = e.target.value; setHospitalizationRows(u); }}>
                        {["Individual","Group","Both Individual & Group"].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Sessions Conducted (This Month)" fullWidth size="small" type="number" inputProps={{ min: 0 }}
                        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                        value={row.counsellorSessionsConducted || ""}
                        onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].counsellorSessionsConducted = e.target.value; setHospitalizationRows(u); } }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField label="Students Counselled (This Month)" fullWidth size="small" type="number" inputProps={{ min: 0 }}
                        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                        value={row.counsellorStudentsCounselled || ""}
                        onChange={(e) => { if (Number(e.target.value) >= 0) { const u = [...hospitalizationRows]; u[index].counsellorStudentsCounselled = e.target.value; setHospitalizationRows(u); } }} />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>

        </Box>
      ))}
    </>
  );
};

export default HospitalizationSection;