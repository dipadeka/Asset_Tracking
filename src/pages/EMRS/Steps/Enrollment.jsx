import React from "react";
import { Grid, Typography, Box, TextField, MenuItem, Button } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import { achievementLevels } from "./constants/emrsfields";

// ── Exam eligibility map by class ──
const EXAM_CLASS_MAP = {
  "School Level": ["6", "7", "8", "9", "10", "11", "12"],
  "District Level": ["6", "7", "8", "9", "10", "11", "12"],
  "State Level": ["6", "7", "8", "9", "10", "11", "12"],
  "National Level": ["6", "7", "8", "9", "10", "11", "12"],
  "Mathematics Olympiad": ["6", "7", "8", "9", "10", "11", "12"],
  "Physics Olympiad": ["6", "7", "8", "9", "10", "11", "12"],
  "Chemistry Olympiad": ["6", "7", "8", "9", "10", "11", "12"],
  "Biology Olympiad": ["6", "7", "8", "9", "10", "11", "12"],
  "Astronomy Olympiad": ["6", "7", "8", "9", "10", "11", "12"],
  "National Sports Championship": ["6", "7", "8", "9", "10", "11", "12"],
  "State Sports Championship": ["6", "7", "8", "9", "10", "11", "12"],
  "National Cultural Competition": ["6", "7", "8", "9", "10", "11", "12"],
  "Junior Science Olympiad": ["6", "7", "8", "9", "10"],
  "National Talent Search Examination": ["10"],
  "INSPIRE Scholarship": ["10", "11", "12"],
  "Board Topper": ["10", "11", "12"],
  "Board Merit List": ["10", "11", "12"],
  "National Defence Academy": ["11", "12"],
  "JEE Mains": ["12"],
  "JEE Advanced": ["12"],
  "NEET": ["12"],
  "CUET": ["12"],
  "Common Law Admission Test": ["12"],
  "CA Foundation": ["12"],
  "National Institute of Fashion": ["12"],
  "NID": ["12"],
};

const getFilteredAchievementLevels = (className) => {
  if (!className) return achievementLevels;
  return achievementLevels.filter((level) => {
    const matchedKey = Object.keys(EXAM_CLASS_MAP).find((key) =>
      level.toLowerCase().includes(key.toLowerCase())
    );
    if (!matchedKey) return true;
    return EXAM_CLASS_MAP[matchedKey].includes(className);
  });
};

const getMarksFromPercentage = (percent) => {
  if (percent === 100) return 10;
  if (percent >= 90) return 9;
  if (percent >= 80) return 8;
  if (percent >= 70) return 7;
  if (percent >= 60) return 6;
  if (percent >= 50) return 5;
  if (percent >= 40) return 4;
  if (percent >= 33) return 3;
  return 0;
};

const Enrollment = ({ enrollmentRows, setEnrollmentRows }) => {
  return (
    <>
      {/* ================= UNIFIED STUDENT ENROLLMENT SECTION ================= */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(to right, #1976d2, #42a5f5)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 2,
              fontWeight: 600,
              mb: 2,
            }}
          >
            Student Enrollment Details
          </Typography>
        </Grid>
      </Grid>

      {enrollmentRows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            border: "1px solid #cbd5e1",
            borderRadius: 2,
            mb: 3,
            backgroundColor: "#fff",
            overflow: "hidden",
          }}
        >
          {/* ── BLOCK TITLE BAR ── */}
          <Box
            sx={{
              background: "linear-gradient(to right, #1e3a5f, #1976d2)",
              px: 3,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              📚 Enrollment Block {rowIndex + 1}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {row.academicYear && (
                <Box sx={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, px: 1.5, py: 0.3 }}>
                  <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                    📅 {row.academicYear}
                  </Typography>
                </Box>
              )}
              {row.class && (
                <Box sx={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, px: 1.5, py: 0.3 }}>
                  <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                    🎓 Class {row.class}
                  </Typography>
                </Box>
              )}
              {row.section && (
                <Box sx={{ background: "rgba(255,255,255,0.18)", borderRadius: 10, px: 1.5, py: 0.3 }}>
                  <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                    🔖 Section {row.section}
                  </Typography>
                </Box>
              )}
              {!row.academicYear && !row.class && !row.section && (
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontStyle: "italic" }}>
                  Select year, class & section below
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ padding: 3 }}>
            {/* ── ENROLLMENT HEADER ── */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select label="Academic Year" fullWidth size="small" sx={{ minWidth: 220 }}
                  value={row.academicYear}
                  onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].academicYear = e.target.value; setEnrollmentRows(u); }}
                >
                  {["2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030"].map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select label="Class" fullWidth size="small" sx={{ minWidth: 220 }}
                  value={row.class}
                  onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].class = e.target.value; setEnrollmentRows(u); }}
                >
                  {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select label="Section" fullWidth size="small" sx={{ minWidth: 220 }}
                  value={row.section}
                  onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].section = e.target.value; setEnrollmentRows(u); }}
                >
                  {["A", "B", "C"].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Sanctioned Capacity" type="number" inputProps={{ min: 0 }} fullWidth size="small"
                  value={row.sanctionedCapacity}
                  onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].sanctionedCapacity = e.target.value; setEnrollmentRows(u); }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Current Enrollment" type="number" inputProps={{ min: 0 }} fullWidth size="small"
                  value={row.currentEnrollment}
                  onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].currentEnrollment = e.target.value; setEnrollmentRows(u); }}
                />
              </Grid>

              {/* ── CATEGORY BREAKDOWN ── */}
              <Grid item xs={12}>
                <Box sx={{ border: "1px solid #bbdefb", borderRadius: 2, p: 2, background: "#f0f7ff" }}>
                  <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 2, fontSize: 14 }}>
                    📊 Student Category Breakdown
                  </Typography>
                  {(() => {
                    const categoryConfig = [
                      { key: "ST", label: "ST", group: "I", pct: "80%", color: "#1976d2", hasState: true, notApplicable: false, expected: { Block: 24, District: 15, State: 9 } },
                      { key: "PVTG", label: "PVTG", group: "II", pct: "5%", color: "#7b1fa2", hasState: false, notApplicable: true, expected: { Block: 0, District: 0, State: 0 } },
                      { key: "DNT_NT_SNT", label: "DNT/NT/SNT", group: "III", pct: "5%", color: "#2e7d32", hasState: false, notApplicable: true, expected: { Block: 0, District: 0, State: 0 } },
                      { key: "LandDonor", label: "Land Donor", group: "IV", pct: "3%", color: "#00838f", hasState: false, notApplicable: false, expected: { Block: 1, District: 1, State: 0 } },
                    ];
                    const cat4Config = [
                      { key: "LWE_Covid", label: "LWE/Covid/Insurgency", subLabel: "V a)" },
                      { key: "Widow", label: "Children of Widows", subLabel: "V b)" },
                      { key: "Divyang", label: "Divyang/Orphan", subLabel: "V c)" },
                    ];
                    const levels = ["Block", "District", "State"];
                    const handleChange = (catKey, level, value) => {
                      const u = [...enrollmentRows];
                      if (!u[rowIndex].categoryBreakdown) u[rowIndex].categoryBreakdown = {};
                      if (!u[rowIndex].categoryBreakdown[catKey]) u[rowIndex].categoryBreakdown[catKey] = {};
                      u[rowIndex].categoryBreakdown[catKey][level] = value;
                      setEnrollmentRows(u);
                    };
                    const categoryKeys = ["ST", "PVTG", "DNT_NT_SNT", "LWE_Covid", "Widow", "Divyang", "LandDonor"];
                    const categoryLabels = ["ST", "PVTG", "DNT/NT/SNT", "LWE/Covid", "Widow", "Divyang/Orphan", "Land Donor"];
                    const colors = ["#1976d2", "#7b1fa2", "#2e7d32", "#e65100", "#f57c00", "#c62828", "#00838f"];
                    const breakdown = row.categoryBreakdown || {};
                    const getCatTotal = (key) => {
                      const bd = breakdown[key] || {};
                      return levels.reduce((s, l) => s + Number(bd[l] || 0), 0);
                    };
                    const total = categoryKeys.reduce((sum, key) => sum + getCatTotal(key), 0);
                    return (
                      <>
                        <Grid container spacing={2}>
                          {categoryConfig.map((cat) => {
                            const bd = breakdown[cat.key] || {};
                            const block = Number(bd.Block || 0);
                            const district = Number(bd.District || 0);
                            const state = Number(bd.State || 0);
                            const rowTotal = block + district + state;
                            const seatsOk = rowTotal === 0 || (block === cat.expected.Block && district === cat.expected.District && state === cat.expected.State);
                            return (
                              <Grid item xs={12} md={6} key={cat.key}>
                                <Box sx={{ border: `1px solid ${cat.notApplicable ? "#e0e0e0" : cat.color + "44"}`, borderRadius: 2, p: 1.5, background: cat.notApplicable ? "#f5f5f5" : "#fff" }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: cat.notApplicable ? "#bdbdbd" : cat.color }} />
                                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: cat.notApplicable ? "#9e9e9e" : cat.color }}>{cat.label}</Typography>
                                    <Typography sx={{ fontSize: 11, color: "#888" }}>(Cat {cat.group} · {cat.pct})</Typography>
                                    {cat.notApplicable && (
                                      <Box sx={{ ml: "auto", px: 1, py: 0.2, background: "#eeeeee", borderRadius: 1, border: "1px solid #bdbdbd" }}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#757575" }}>N/A — Not applicable in Assam</Typography>
                                      </Box>
                                    )}
                                  </Box>
                                  <Grid container spacing={1}>
                                    {levels.map((level) => (
                                      <Grid item xs={4} key={level}>
                                        <TextField
                                          label={level} type="number" fullWidth size="small"
                                          disabled={cat.notApplicable || (level === "State" && !cat.hasState)}
                                          value={cat.notApplicable ? "0" : bd[level] || ""}
                                          helperText={cat.notApplicable ? "Not applicable" : level === "State" && !cat.hasState ? "0 (N/A)" : `Expected: ${cat.expected[level]}`}
                                    
                                     inputProps={{ min: 0 }}
  onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  }}
        onChange={(e) => {
                                            if (cat.notApplicable) return;

                                            const value = e.target.value;

                                            if (value === "" || Number(value) >= 0) {
                                              handleChange(cat.key, level, value);
                                            }
                                          }}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                  {!cat.notApplicable && rowTotal > 0 && (
                                    <Typography sx={{ fontSize: 11, mt: 1, fontWeight: 600, color: seatsOk ? "#2e7d32" : "#e65100" }}>
                                      {seatsOk ? `✅ Matches guideline · Total: ${rowTotal}` : `⚠️ Expected B:${cat.expected.Block} D:${cat.expected.District} S:${cat.expected.State} · Got B:${block} D:${district} S:${state}`}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}

                          <Grid item xs={12}>
                            <Box sx={{ border: "1px dashed #e65100", borderRadius: 2, p: 1.5, background: "#fff3e0" }}>
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#e65100", mb: 1.5 }}>
                                Category IV — Shared Pool · 7% &nbsp;|&nbsp; Expected: Block=2, District=2, State=0
                              </Typography>
                              <Grid container spacing={2}>
                                {cat4Config.map((cat) => {
                                  const bd = breakdown[cat.key] || {};
                                  return (
                                    <Grid item xs={12} md={4} key={cat.key}>
                                      <Box sx={{ background: "#fff", borderRadius: 1.5, p: 1.5, border: "1px solid #ffe0b2" }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#e65100", mb: 1 }}>{cat.subLabel} {cat.label}</Typography>
                                        <Grid container spacing={1}>
                                          {levels.map((level) => (
                                            <Grid item xs={4} key={level}>
                                              <TextField
                                                label={level} type="number" fullWidth size="small"
                                                disabled={level === "State"}
                                                value={bd[level] || ""}
                                                helperText={level === "State" ? "0 (N/A)" : ""}
                                                  inputProps={{ min: 0 }}
onKeyDown={(e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
}}
                                                onChange={(e) => {
  const value = e.target.value;

  if (value === "" || Number(value) >= 0) {
    handleChange(cat.key, level, value);
  }
}}
                                              />
                                            </Grid>
                                          ))}
                                        </Grid>
                                      </Box>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                              {(() => {
                                const cat4Total = ["LWE_Covid", "Widow", "Divyang"].reduce((sum, k) => sum + levels.reduce((s, l) => s + Number(breakdown[k]?.[l] || 0), 0), 0);
                                const cat4Max = Math.round((row.sanctionedCapacity || 60) * 0.07);
                                if (cat4Total === 0) return null;
                                return (
                                  <Typography sx={{ fontSize: 11, fontWeight: 600, mt: 1.5, color: cat4Total > cat4Max ? "#c62828" : "#2e7d32" }}>
                                    {cat4Total > cat4Max ? `⚠️ Cat V total ${cat4Total} exceeds pool of ${cat4Max} seats` : `✅ Cat V pool: ${cat4Total} / ${cat4Max} seats used`}
                                  </Typography>
                                );
                              })()}
                            </Box>
                          </Grid>
                        </Grid>

                        {total > 0 && (
                          <Box mt={2}>
                            <Box sx={{ display: "flex", height: 28, borderRadius: 2, overflow: "hidden", mb: 1.5 }}>
                              {categoryKeys.map((key, i) => {
                                const val = getCatTotal(key);
                                const pct = total > 0 ? (val / total) * 100 : 0;
                                if (pct === 0) return null;
                                return (
                                  <Box key={key} sx={{ width: `${pct}%`, background: colors[i], display: "flex", alignItems: "center", justifyContent: "center", transition: "width 0.4s" }}>
                                    {pct > 8 && <Typography sx={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{Math.round(pct)}%</Typography>}
                                  </Box>
                                );
                              })}
                            </Box>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                              {categoryKeys.map((key, i) => {
                                const val = getCatTotal(key);
                                if (!val) return null;
                                return (
                                  <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: colors[i], flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: 12, color: "#374151" }}>{categoryLabels[i]}: <strong>{val}</strong></Typography>
                                  </Box>
                                );
                              })}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1976d2" }}>Total: {total}</Typography>
                                {row.currentEnrollment && Number(row.currentEnrollment) > 0 && total > Number(row.currentEnrollment) && (
                                  <Typography sx={{ fontSize: 11, color: "#c62828", fontWeight: 600 }}>⚠️ Exceeds enrollment ({row.currentEnrollment})</Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              </Grid>
            </Grid>

            {/* ── ACADEMIC PERFORMANCE ── */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
              Academic Performance
            </Typography>

            {/* ── CLASS 6, 7, 8, 9 — Annual Exam ── */}
            {["6", "7", "8", "9"].includes(row.class) && (
              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                  Annual Exam Performance — Class {row.class}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Appeared" type="number" fullWidth size="small"
                      value={row.appeared}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].appeared = e.target.value;
                        const appeared = Number(e.target.value || 0);
                        const passed = Number(u[rowIndex].passed || 0);
                        const percent = appeared > 0 ? (passed / appeared) * 100 : 0;
                        u[rowIndex].passPercent = percent.toFixed(2);
                        u[rowIndex].marks = getMarksFromPercentage(percent);
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Passed" type="number" fullWidth size="small"
                      value={row.passed}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].passed = e.target.value;
                        const passed = Number(e.target.value || 0);
                        const appeared = Number(u[rowIndex].appeared || 0);
                        const percent = appeared > 0 ? (passed / appeared) * 100 : 0;
                        u[rowIndex].passPercent = percent.toFixed(2);
                        u[rowIndex].marks = getMarksFromPercentage(percent);
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Pass %" type="number" fullWidth size="small" value={row.passPercent || ""} InputProps={{ readOnly: true }} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ── CLASS 10 — Board Exam ── */}
            {row.class === "10" && (
              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                  Board Exam Performance — Class 10
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Appeared" type="number" fullWidth size="small"
                      value={row.appeared}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].appeared = e.target.value;
                        const appeared = Number(e.target.value || 0);
                        const passed = Number(u[rowIndex].passed || 0);
                        const percent = appeared > 0 ? (passed / appeared) * 100 : 0;
                        u[rowIndex].passPercent = percent.toFixed(2);
                        u[rowIndex].marks = getMarksFromPercentage(percent);
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Passed" type="number" fullWidth size="small"
                      value={row.passed}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].passed = e.target.value;
                        const passed = Number(e.target.value || 0);
                        const appeared = Number(u[rowIndex].appeared || 0);
                        const percent = appeared > 0 ? (passed / appeared) * 100 : 0;
                        u[rowIndex].passPercent = percent.toFixed(2);
                        u[rowIndex].marks = getMarksFromPercentage(percent);
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Pass %" type="number" fullWidth size="small" value={row.passPercent || ""} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Marks Obtained (out of 10)" fullWidth size="small" value={row.marks || ""} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Top Scorer Name" fullWidth size="small" value={row.topScorer || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScorer = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Top Score (%)" type="number" fullWidth size="small" value={row.topScore || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScore = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>Marking Criteria (Out of 10)</Typography>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Pass %</TableCell><TableCell>Marks</TableCell></TableRow></TableHead>
                    <TableBody>
                      {[{ range: "100%", marks: 10 }, { range: "90–99%", marks: 9 }, { range: "80–89%", marks: 8 }, { range: "70–79%", marks: 7 }, { range: "60–69%", marks: 6 }, { range: "50–59%", marks: 5 }, { range: "40–49%", marks: 4 }, { range: "33–39%", marks: 3 }, { range: "Below 33%", marks: 0 }].map((r) => (
                        <TableRow key={r.range}><TableCell>{r.range}</TableCell><TableCell>{r.marks}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}

            {/* ── CLASS 11 & 12 — Board Exam by Stream ── */}
            {["11", "12"].includes(row.class) && (
              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 1, p: 2, mb: 3, backgroundColor: "#f8fafc" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                  Board Exam Performance — Class {row.class} (Stream-wise)
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select label="Stream" fullWidth size="small" sx={{ minWidth: 220 }} value={row.stream || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].stream = e.target.value; setEnrollmentRows(u); }}
                    >
                      {["Science", "Commerce", "Arts"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Appeared" type="number" fullWidth size="small" value={row.appeared}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].appeared = e.target.value;
                        const appeared = Number(e.target.value || 0);
                        const passed = Number(u[rowIndex].passed || 0);
                        const passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                        u[rowIndex].passPercent = passPercent;
                        u[rowIndex].marks = getMarksFromPercentage(Number(passPercent));
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Students Passed" type="number" fullWidth size="small" value={row.passed}
                      onChange={(e) => {
                        const u = [...enrollmentRows];
                        u[rowIndex].passed = e.target.value;
                        const passed = Number(e.target.value || 0);
                        const appeared = Number(u[rowIndex].appeared || 0);
                        const passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "";
                        u[rowIndex].passPercent = passPercent;
                        u[rowIndex].marks = getMarksFromPercentage(Number(passPercent));
                        setEnrollmentRows(u);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Pass %" type="number" fullWidth size="small" value={row.passPercent || ""} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Marks Obtained (out of 10)" fullWidth size="small" value={row.marks || ""} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Top Scorer Name" fullWidth size="small" value={row.topScorer || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScorer = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Top Score (%)" type="number" fullWidth size="small" value={row.topScore || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].topScore = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>Marking Criteria (Out of 10)</Typography>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Pass %</TableCell><TableCell>Marks</TableCell></TableRow></TableHead>
                    <TableBody>
                      {[{ range: "100%", marks: 10 }, { range: "90–99%", marks: 9 }, { range: "80–89%", marks: 8 }, { range: "70–79%", marks: 7 }, { range: "60–69%", marks: 6 }, { range: "50–59%", marks: 5 }, { range: "40–49%", marks: 4 }, { range: "33–39%", marks: 3 }, { range: "Below 33%", marks: 0 }].map((r) => (
                        <TableRow key={r.range}><TableCell>{r.range}</TableCell><TableCell>{r.marks}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}

            {!row.class && (
              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3, fontStyle: "italic" }}>
                Please select a Class above to fill Academic Performance.
              </Typography>
            )}

            {/* ── DROPOUT DETAILS ── */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
              Dropout Details
            </Typography>
            {row.dropouts.map((dropout, dIndex) => (
              <Box key={dIndex} sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 2, mb: 2, background: "#f8fafc" }}>

                {/* ── Student Info ── */}
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
                  Student Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Student Name" fullWidth size="small" value={dropout.studentName}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].studentName = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Roll No" fullWidth size="small" value={dropout.rollNo}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].rollNo = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Reason for Dropout" fullWidth size="small" multiline rows={3}
                      placeholder="Enter reason for dropout..." value={dropout.reason}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].reason = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                </Grid>

                {/* ── Counselling Details ── */}
                <Box sx={{ border: "1px solid #fbbf2455", borderRadius: 2, p: 2, mb: 2, background: "#fffbeb" }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#b45309", mb: 1.5, display: "block" }}>
                    Counselling Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select label="Was student counselled before dropout?" fullWidth size="small" sx={{ minWidth: 220 }}
                        value={dropout.wasCounselled || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].wasCounselled = e.target.value; setEnrollmentRows(u); }}
                      >
                        {["Yes", "No"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="No. of Counselling Sessions Held" type="number" inputProps={{ min: 0 }} fullWidth size="small"
                        disabled={dropout.wasCounselled === "No"}
                        value={dropout.counsellingSessions || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].counsellingSessions = e.target.value; setEnrollmentRows(u); }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Date of Last Counselling Session" type="date" fullWidth size="small"
                        InputLabelProps={{ shrink: true }}
                        disabled={dropout.wasCounselled === "No"}
                        value={dropout.lastCounsellingDate || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].lastCounsellingDate = e.target.value; setEnrollmentRows(u); }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select label="Counselled By" fullWidth size="small" sx={{ minWidth: 220 }}
                        disabled={dropout.wasCounselled === "No"}
                        value={dropout.counselledBy || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].counselledBy = e.target.value; setEnrollmentRows(u); }}
                      >
                        {["Class Teacher", "Principal / Head Teacher", "Warden", "Counsellor", "Parent / Guardian", "Other"].map((v) => (
                          <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select label="Was Guardian Present During Counselling?" fullWidth size="small" sx={{ minWidth: 220 }}
                        disabled={dropout.wasCounselled === "No"}
                        value={dropout.guardianPresentInCounselling || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].guardianPresentInCounselling = e.target.value; setEnrollmentRows(u); }}
                      >
                        {["Yes", "No"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select label="Was Dropout Preventable?" fullWidth size="small" sx={{ minWidth: 220 }}
                        value={dropout.dropoutPreventable || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].dropoutPreventable = e.target.value; setEnrollmentRows(u); }}
                      >
                        {["Yes", "No", "Uncertain"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        select label="Follow-up Action Taken" fullWidth size="small" sx={{ minWidth: 220 }}
                        value={dropout.followUpAction || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].followUpAction = e.target.value; setEnrollmentRows(u); }}
                      >
                        {["Home visit conducted", "Letter sent to guardian", "Referred to welfare officer", "No follow-up taken", "Other"].map((v) => (
                          <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        label="Summary of Counselling Outcome" fullWidth size="small" sx={{ minWidth: 220 }} multiline rows={2}
                        disabled={dropout.wasCounselled === "No"}
                        placeholder="Describe what was discussed and the outcome..."
                        value={dropout.counsellingOutcome || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].counsellingOutcome = e.target.value; setEnrollmentRows(u); }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Additional Remarks" fullWidth size="small" sx={{ minWidth: 220 }} multiline rows={2}
                        placeholder="Any additional notes on the counselling process..."
                        value={dropout.counsellingRemarks || ""}
                        onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].counsellingRemarks = e.target.value; setEnrollmentRows(u); }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* ── Guardian Info ── */}
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
                  Guardian Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Guardian Name" fullWidth size="small" value={dropout.guardianName || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].guardianName = e.target.value; setEnrollmentRows(u); }}
                      sx={{ minWidth: 220 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Guardian Contact No" fullWidth size="small" value={dropout.guardianContactNo}
                      inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                      onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) e.preventDefault(); }}
                      error={dropout.guardianContactNo && dropout.guardianContactNo.toString().length !== 10}
                      helperText={dropout.guardianContactNo && dropout.guardianContactNo.toString().length !== 10 ? "Must be exactly 10 digits" : ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].guardianContactNo = e.target.value; setEnrollmentRows(u); }}
                    />
                  </Grid>
                </Grid>

                {/* ── Address Info ── */}
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b", mb: 1, display: "block" }}>
                  Address Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="PIN Code" fullWidth size="small" type="number" value={dropout.pinCode || ""}
                      inputProps={{ min: 0, maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) e.preventDefault();
                        if (e.key === "-" || e.key === "e") e.preventDefault();
                      }}
                      onChange={async (e) => {
                        const val = e.target.value;
                        if (Number(val) >= 0 || val === "") {
                          const u = [...enrollmentRows];
                          u[rowIndex].dropouts[dIndex].pinCode = val;
                          setEnrollmentRows(u);
                          if (val.length === 6) {
                            try {
                              const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                              const data = await res.json();
                              if (data[0].Status === "Success") {
                                const po = data[0].PostOffice[0];
                                const u2 = [...enrollmentRows];
                                u2[rowIndex].dropouts[dIndex].district = po.District;
                                u2[rowIndex].dropouts[dIndex].postOffice = po.Name;
                                u2[rowIndex].dropouts[dIndex].gramPanchayat = po.Block;
                                u2[rowIndex].dropouts[dIndex].village = po.Village || "";
                                setEnrollmentRows(u2);
                              }
                            } catch (err) { console.error("Pincode fetch error:", err); }
                          }
                        }
                      }}
                      error={dropout.pinCode && (Number(dropout.pinCode) < 0 || dropout.pinCode.toString().length !== 6)}
                      helperText={dropout.pinCode && Number(dropout.pinCode) < 0 ? "PIN Code cannot be negative" : dropout.pinCode && dropout.pinCode.toString().length !== 6 ? "PIN Code must be 6 digits" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="District" fullWidth size="small" value={dropout.district || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].district = e.target.value; setEnrollmentRows(u); }}
                      onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Post Office" fullWidth size="small" value={dropout.postOffice || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].postOffice = e.target.value; setEnrollmentRows(u); }}
                      onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Gram Panchayat" fullWidth size="small" value={dropout.gramPanchayat || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].gramPanchayat = e.target.value; setEnrollmentRows(u); }}
                      onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      label="Village" fullWidth size="small" value={dropout.village || ""}
                      onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].dropouts[dIndex].village = e.target.value; setEnrollmentRows(u); }}
                      onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                      error={/\d/.test(dropout.village || "")}
                      helperText={/\d/.test(dropout.village || "") ? "Village name should not contain numbers" : ""}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Box mb={3}>
              <Button
                variant="outlined" size="small" sx={{ minWidth: 220 }}
                onClick={() => {
                  const u = [...enrollmentRows];
                  u[rowIndex].dropouts.push({
                    studentName: "", rollNo: "", reason: "",
                    guardianName: "", guardianContactNo: "",
                    pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "",
                    wasCounselled: "", counsellingSessions: "", lastCounsellingDate: "",
                    counselledBy: "", guardianPresentInCounselling: "", dropoutPreventable: "",
                    followUpAction: "", counsellingOutcome: "", counsellingRemarks: "",
                  });
                  setEnrollmentRows(u);
                }}
              >
                + Add Dropout
              </Button>
            </Box>

            {/* ── MIGRATION DETAILS ── */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
              Migration Details
            </Typography>
            {row.migrations.map((migration, mIndex) => (
              <Grid container spacing={2} mb={1} key={mIndex}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Student Name" fullWidth size="small" value={migration.studentName}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].studentName = e.target.value; setEnrollmentRows(u); }}
                    onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    error={/\d/.test(migration.studentName || "")}
                    helperText={/\d/.test(migration.studentName || "") ? "Student name should not contain numbers" : ""}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Migrated From" fullWidth size="small" value={migration.migratedFrom}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].migratedFrom = e.target.value; setEnrollmentRows(u); }}
                    onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    error={/\d/.test(migration.migratedFrom || "")}
                    helperText={/\d/.test(migration.migratedFrom || "") ? "Location should not contain numbers" : ""}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Transferred To" fullWidth size="small" value={migration.transferredTo}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].transferredTo = e.target.value; setEnrollmentRows(u); }}
                    onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                    error={/\d/.test(migration.transferredTo || "")}
                    helperText={/\d/.test(migration.transferredTo || "") ? "Location should not contain numbers" : ""}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Reason" multiline rows={4} fullWidth size="small" value={migration.reason}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].migrations[mIndex].reason = e.target.value; setEnrollmentRows(u); }}
                    onKeyDown={(e) => { if (/^[0-9]$/.test(e.key)) e.preventDefault(); }}
                  />
                </Grid>
              </Grid>
            ))}
            <Box mb={3}>
              <Button
                variant="outlined" size="small" sx={{ minWidth: 220 }}
                onClick={() => {
                  const u = [...enrollmentRows];
                  u[rowIndex].migrations.push({ studentName: "", migratedFrom: "", transferredTo: "", reason: "" });
                  setEnrollmentRows(u);
                }}
              >
                + Add Migration
              </Button>
            </Box>

            {/* ── STUDENT ACHIEVEMENTS ── */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
              Student Special Achievements
            </Typography>


            {row.achievements.map((achievement, aIndex) => (
              <Grid container spacing={2} mb={1} key={aIndex}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Student Name" fullWidth size="small" value={achievement.studentName}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].studentName = e.target.value; setEnrollmentRows(u); }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Event Name" fullWidth size="small" value={achievement.eventName}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].eventName = e.target.value; setEnrollmentRows(u); }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select label="Level / Exam" fullWidth size="small" sx={{ minWidth: 220 }}
                    value={achievement.level}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].level = e.target.value; setEnrollmentRows(u); }}
                  >
                    {getFilteredAchievementLevels(row.class).map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Recognition" fullWidth size="small" value={achievement.recognition}
                    onChange={(e) => { const u = [...enrollmentRows]; u[rowIndex].achievements[aIndex].recognition = e.target.value; setEnrollmentRows(u); }}
                  />
                </Grid>
              </Grid>
            ))}
            <Box>
              <Button
                variant="outlined" size="small" sx={{ minWidth: 220 }}
                onClick={() => {
                  const u = [...enrollmentRows];
                  u[rowIndex].achievements.push({ studentName: "", eventName: "", level: "", recognition: "" });
                  setEnrollmentRows(u);
                }}
              >
                + Add Achievement
              </Button>

              {/* ── Competitive Exam Section — Class 12 only ── */}
              {row.class === "12" && (
                <Box mt={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 1 }}>
                    Competitive Examination Selection with Admission
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Name of Examination" fullWidth size="small"
                        value={row.competitiveExam?.examName || ""}
                        onChange={(e) => {
                          const updatedRows = [...enrollmentRows];
                          updatedRows[rowIndex] = { ...updatedRows[rowIndex], competitiveExam: { ...(updatedRows[rowIndex].competitiveExam || {}), examName: e.target.value } };
                          setEnrollmentRows(updatedRows);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="No. of Students Qualified" fullWidth size="small"
                        value={row.competitiveExam?.qualified || ""}
                        onChange={(e) => {
                          const updatedRows = [...enrollmentRows];
                          updatedRows[rowIndex] = { ...updatedRows[rowIndex], competitiveExam: { ...(updatedRows[rowIndex].competitiveExam || {}), qualified: e.target.value } };
                          setEnrollmentRows(updatedRows);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Students Secured Admission" fullWidth size="small"
                        value={row.competitiveExam?.admission || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value || 0);
                          let marks = 0;
                          if (val >= 30) marks = 7;
                          else if (val >= 20) marks = 5;
                          else if (val >= 10) marks = 3;
                          else if (val > 0) marks = 1;
                          const updatedRows = [...enrollmentRows];
                          updatedRows[rowIndex] = { ...updatedRows[rowIndex], competitiveExam: { ...(updatedRows[rowIndex].competitiveExam || {}), admission: e.target.value, marks } };
                          setEnrollmentRows(updatedRows);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Total" fullWidth size="small"
                        value={row.competitiveExam?.total || ""}
                        onChange={(e) => {
                          const updatedRows = [...enrollmentRows];
                          updatedRows[rowIndex] = { ...updatedRows[rowIndex], competitiveExam: { ...(updatedRows[rowIndex].competitiveExam || {}), total: e.target.value } };
                          setEnrollmentRows(updatedRows);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Marks (out of 7)" fullWidth size="small" value={row.competitiveExam?.marks || ""} InputProps={{ readOnly: true }} />
                    </Grid>
                  </Grid>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Students with Admission</strong></TableCell>
                            <TableCell><strong>Marks</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[{ condition: "30 or above", marks: 7 }, { condition: "20 or above", marks: 5 }, { condition: "10 or above", marks: 3 }, { condition: "Below 10", marks: 1 }].map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.condition}</TableCell>
                              <TableCell>{item.marks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}

      {/* ── Add new Class/Section Block ── */}
      <Box mb={4}>
        <Button
          variant="contained"
          onClick={() =>
            setEnrollmentRows([
              ...enrollmentRows,
              {
                academicYear: "", class: "", section: "",
                sanctionedCapacity: "", currentEnrollment: "",
                category: "", boardClass: "",
                appeared: "", passed: "", passPercent: "",
                above75: "", below50: "", above75Error: "",
                stream: "", distinctions: "", topScorer: "", topScore: "",
                categoryBreakdown: { ST: "", PVTG: "", "DNT/NT/SNT": "", Orphan: "", Divyang: "" },
                monthlyAttendance: [],
                dropouts: [{
                  studentName: "", rollNo: "", reason: "",
                  guardianName: "", guardianContactNo: "",
                  pinCode: "", district: "", postOffice: "", gramPanchayat: "", village: "",
                  wasCounselled: "", counsellingSessions: "", lastCounsellingDate: "",
                  counselledBy: "", guardianPresentInCounselling: "", dropoutPreventable: "",
                  followUpAction: "", counsellingOutcome: "", counsellingRemarks: "",
                }],
                migrations: [{ studentName: "", migratedFrom: "", transferredTo: "", reason: "" }],
                achievements: [{ studentName: "", eventName: "", level: "", recognition: "" }],
                competitiveExam: { examName: "", qualified: "", admission: "", total: "", marks: "" },
              },
            ])
          }
        >
          + Add Class / Section
        </Button>
      </Box>
    </>
  );
};

export default Enrollment;