import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const NCC_WINGS = ["Army Wing", "Naval Wing", "Air Force Wing"];

const SCOUT_GUIDE_WINGS = [
  "Cub Scout / Bulbul (Primary)",
  "Scout / Guide (Secondary)",
  "Rover Scout / Ranger Guide (Senior)",
];

const AREAS_OF_DEVELOPMENT = [
  "Sports", "Culture", "Health & Wellness", "Value Education",
  "Kaushalya Skill Internship", "Computer Skills", "Personality Development",
  "Excursions", "Career Guidance", "Exposure", "Competitive Exam Training",
  "Enhancing Learning Skills", "Adventure Activities", "STEM Learning",
  "Innovation", "Others",
];

// Both YES = 5, One YES = 3, Both NO = 0
const computeMarks = (vals) => {
  const yesCount = vals.filter((v) => v === "Yes").length;
  if (yesCount >= 2) return 5;
  if (yesCount === 1) return 3;
  return 0;
};

const MarksBox = ({ val }) => (
  <Box sx={{
    flex: "1 1 160px", display: "flex", alignItems: "center",
    background: "#f7faff", border: "1px solid #c8d4e8", borderRadius: 1,
    px: 2, py: 1, gap: 2,
  }}>
    <Typography sx={{
      fontSize: "0.72rem", color: "#5a6a85", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap",
    }}>
      Marks Obtained*
    </Typography>
    <Typography sx={{
      fontSize: "1.2rem", fontWeight: 700, ml: "auto",
      color: val === 5 ? "#155724" : val === 3 ? "#856404" : "#721c24",
    }}>
      {val}
    </Typography>
  </Box>
);

const SectionHeader = ({ title }) => (
  <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
    <Typography sx={{
      color: "#fff", fontSize: "0.72rem", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.5px",
    }}>
      {title}
    </Typography>
  </Box>
);

// Marking Criteria Table shown before Add Activity button
const MarkingCriteriaTable = () => (
  <Box sx={{ mb: 3, border: "1.5px solid #1a56a0", borderRadius: 1, overflow: "hidden" }}>
    <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
      <Typography sx={{
        color: "#fff", fontSize: "0.78rem", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        *Marking Criteria for Point 2, 3 and 4 (Out of 5)
      </Typography>
    </Box>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ background: "#e8f0fb" }}>
          <TableCell sx={{ fontWeight: 700, color: "#1a56a0", fontSize: "0.8rem", borderRight: "1px solid #c8d4e8" }}>
            Participation
          </TableCell>
          <TableCell sx={{ fontWeight: 700, color: "#1a56a0", fontSize: "0.8rem" }}>
            Marks
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          { label: "Both YES", marks: 5, color: "#155724", bg: "#d4edda" },
          { label: "One YES",  marks: 3, color: "#856404", bg: "#fff3cd" },
          { label: "Both NO",  marks: 0, color: "#721c24", bg: "#f8d7da" },
        ].map((row) => (
          <TableRow key={row.label} sx={{ background: row.bg }}>
            <TableCell sx={{ color: row.color, fontWeight: 600, fontSize: "0.82rem", borderRight: "1px solid #c8d4e8" }}>
              {row.label}
            </TableCell>
            <TableCell sx={{ color: row.color, fontWeight: 700, fontSize: "0.82rem" }}>
              {row.marks}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

const ActivityScoredSections = ({ row, index, rows, setRows }) => {
  const get = (field) => row[field] || "";
  const set = (field, value) => {
    const u = [...rows];
    u[index][field] = value;
    setRows(u);
  };

  // Each section: only 2 Yes/No fields → Both YES=5, One YES=3, Both NO=0
  const culturalMarks = computeMarks([
    get("studentsParticipatedCulturalMeet"),
    get("studentsGotMedalCulturalMeet"),
  ]);

  const nccScoutMarks = computeMarks([
    get("nccUnitRunning"),
    get("scoutGuideRunning"),
  ]);

  const rbvpMarks = computeMarks([
    get("studentsSelectedRBVP"),
    get("studentsSelectedInspireManak"),
  ]);

  return (
    <>
      {/* Cultural Meet */}
      <Box sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden", mb: 2 }}>
        <SectionHeader title="Student Participation in National Level Cultural Meet (5 Marks)" />
        <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, background: "#fff" }}>
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small"
              label="Students Participated in National Level Cultural Meet (Yes/No)"
              value={get("studentsParticipatedCulturalMeet")}
              onChange={(e) => set("studentsParticipatedCulturalMeet", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("studentsParticipatedCulturalMeet") === "Yes" && (
            <Box sx={{ flex: "1 1 160px" }}>
              <TextField label="No. of Students" type="number" fullWidth size="small"
                inputProps={{ min: 0 }}
                value={get("studentsParticipatedCount")}
                onChange={(e) => set("studentsParticipatedCount", e.target.value)} />
            </Box>
          )}
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small"
              label="Students Got Rank/Medal in National Level Cultural Meet (Yes/No)"
              value={get("studentsGotMedalCulturalMeet")}
              onChange={(e) => set("studentsGotMedalCulturalMeet", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("studentsGotMedalCulturalMeet") === "Yes" && (
            <Box sx={{ flex: "1 1 160px" }}>
              <TextField label="No. of Students" type="number" fullWidth size="small"
                inputProps={{ min: 0 }}
                value={get("studentsRankCount")}
                onChange={(e) => set("studentsRankCount", e.target.value)} />
            </Box>
          )}
          <MarksBox val={culturalMarks} />
        </Box>
      </Box>

      {/* NCC & Scout Guide */}
      <Box sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden", mb: 2 }}>
        <SectionHeader title="NCC and Scout Guide in EMRS (5 Marks)" />
        <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, background: "#fff" }}>
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small" label="NCC Unit Running (Yes/No)"
              value={get("nccUnitRunning")}
              onChange={(e) => set("nccUnitRunning", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("nccUnitRunning") === "Yes" && (
            <>
              <Box sx={{ flex: "1 1 220px" }}>
                <TextField select fullWidth size="small" label="NCC Wing"
                  value={get("nccWing")}
                  onChange={(e) => set("nccWing", e.target.value)}>
                  {NCC_WINGS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                </TextField>
              </Box>
              <Box sx={{ flex: "1 1 160px" }}>
                <TextField label="No. of NCC Students" type="number" fullWidth size="small"
                  inputProps={{ min: 0 }}
                  value={get("nccStudentsCount")}
                  onChange={(e) => set("nccStudentsCount", e.target.value)} />
              </Box>
            </>
          )}
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small" label="Scout and Guide Running (Yes/No)"
              value={get("scoutGuideRunning")}
              onChange={(e) => set("scoutGuideRunning", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("scoutGuideRunning") === "Yes" && (
            <>
              <Box sx={{ flex: "1 1 220px" }}>
                <TextField select fullWidth size="small" label="Scout / Guide Wing"
                  value={get("scoutGuideWing")}
                  onChange={(e) => set("scoutGuideWing", e.target.value)}>
                  {SCOUT_GUIDE_WINGS.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                </TextField>
              </Box>
              <Box sx={{ flex: "1 1 160px" }}>
                <TextField label="No. of Students" type="number" fullWidth size="small"
                  inputProps={{ min: 0 }}
                  value={get("scoutGuideStudentsCount")}
                  onChange={(e) => set("scoutGuideStudentsCount", e.target.value)} />
              </Box>
            </>
          )}
          <MarksBox val={nccScoutMarks} />
        </Box>
      </Box>

      {/* RBVP / INSPIRE MANAK */}
      <Box sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden", mb: 2 }}>
        <SectionHeader title="Selection in Rashtriya Bal Vaigyanik Pradarshani / INSPIRE MANAK Award (5 Marks)" />
        <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, background: "#fff" }}>
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small" label="Students Selected for RBVP (Yes/No)"
              value={get("studentsSelectedRBVP")}
              onChange={(e) => set("studentsSelectedRBVP", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("studentsSelectedRBVP") === "Yes" && (
            <Box sx={{ flex: "1 1 160px" }}>
              <TextField label="No. of Students" type="number" fullWidth size="small"
                inputProps={{ min: 0 }}
                value={get("rbvpStudentsCount")}
                onChange={(e) => set("rbvpStudentsCount", e.target.value)} />
            </Box>
          )}
          <Box sx={{ flex: "1 1 220px" }}>
            <TextField select fullWidth size="small"
              label="Students Selected for Inspire MANAK Award (Yes/No)"
              value={get("studentsSelectedInspireManak")}
              onChange={(e) => set("studentsSelectedInspireManak", e.target.value)}>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          {get("studentsSelectedInspireManak") === "Yes" && (
            <Box sx={{ flex: "1 1 160px" }}>
              <TextField label="No. of Students" type="number" fullWidth size="small"
                inputProps={{ min: 0 }}
                value={get("inspireStudentsCount")}
                onChange={(e) => set("inspireStudentsCount", e.target.value)} />
            </Box>
          )}
          <MarksBox val={rbvpMarks} />
        </Box>
      </Box>
    </>
  );
};

const ExtraCurricular = ({
  extraCurricularRows,
  setExtraCurricularRows,
  control,
  watch,
}) => {
  return (
    <>
      {/* Section Header */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            color: "#fff", padding: "8px 16px", borderRadius: 2,
            fontWeight: 600, mb: 2,
          }}>
            Extra Curricular Activities
          </Typography>
        </Grid>
      </Grid>

      {extraCurricularRows.map((row, index) => (
        <Box key={index} sx={{
          border: "1px solid #cbd5e1", borderRadius: 2,
          padding: 3, mb: 3, backgroundColor: "#f9fbff",
        }}>
          <Typography sx={{ fontWeight: 600, color: "#1a56a0", mb: 2, fontSize: "0.9rem" }}>
            Activity #{index + 1}
          </Typography>

          <Grid container spacing={2} mb={2}>
            {/* Academic Year */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Academic Year" fullWidth size="small" sx={{ minWidth: 220 }}
                value={row.academicYear}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].academicYear = e.target.value;
                  setExtraCurricularRows(u);
                }}>
                {["2024-2025","2025-2026","2026-2027","2027-2028","2028-2029","2029-2030"].map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Class */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Class" fullWidth size="small" sx={{ minWidth: 220 }}
                value={row.class || ""}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].class = e.target.value;
                  setExtraCurricularRows(u);
                }}>
                {["6","7","8","9","10","11","12"].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Section */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Section" fullWidth size="small" sx={{ minWidth: 220 }}
                value={row.section || ""}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].section = e.target.value;
                  setExtraCurricularRows(u);
                }}>
                {["A","B","C"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Name of Program */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Name of the Program" fullWidth size="small"
                value={row.initiativeName}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].initiativeName = e.target.value;
                  setExtraCurricularRows(u);
                }} />
            </Grid>

            {/* Areas of Development */}
            <Grid item xs={12} sm={6} md={6}>
              <Grid container spacing={1}>
                <Grid item xs={row.areasOfDevelopment === "Others" ? 6 : 12}>
                  <TextField select label="Areas of Development" fullWidth size="small" sx={{ minWidth: 220 }}
                    value={row.areasOfDevelopment || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const u = [...extraCurricularRows];
                      u[index].areasOfDevelopment = value;
                      if (value !== "Others") u[index].otherAreaOfDevelopment = "";
                      setExtraCurricularRows(u);
                    }}>
                    {AREAS_OF_DEVELOPMENT.map((area) => (
                      <MenuItem key={area} value={area}>{area}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {row.areasOfDevelopment === "Others" && (
                  <Grid item xs={6}>
                    <TextField label="Specify Other" fullWidth size="small" sx={{ minWidth: 220 }}
                      value={row.otherAreaOfDevelopment || ""}
                      onChange={(e) => {
                        const u = [...extraCurricularRows];
                        u[index].otherAreaOfDevelopment = e.target.value;
                        setExtraCurricularRows(u);
                      }} />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Description / Objectives" fullWidth size="small"
                value={row.description}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].description = e.target.value;
                  setExtraCurricularRows(u);
                }} />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField select label="Status" fullWidth size="small" sx={{ minWidth: 220 }}
                value={row.status}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].status = e.target.value;
                  setExtraCurricularRows(u);
                }}>
                {["Active","In Progress","Completed","Planned"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <ActivityScoredSections
            row={row}
            index={index}
            rows={extraCurricularRows}
            setRows={setExtraCurricularRows}
          />
        </Box>
      ))}

      {/* Marking Criteria Table — shown once, just before Add Activity */}
      <MarkingCriteriaTable />

      {/* Add Activity Button */}
      <Box mb={4}>
        <Button
          variant="outlined"
          onClick={() =>
            setExtraCurricularRows([
              ...extraCurricularRows,
              {
                academicYear: "", initiativeName: "", areasOfDevelopment: "",
                otherAreaOfDevelopment: "", description: "", status: "",
                class: "", section: "",
                studentsParticipatedCulturalMeet: "", studentsParticipatedCount: "",
                studentsGotMedalCulturalMeet: "", studentsRankCount: "",
                nccUnitRunning: "", nccWing: "", nccStudentsCount: "",
                scoutGuideRunning: "", scoutGuideWing: "", scoutGuideStudentsCount: "",
                studentsSelectedRBVP: "", rbvpStudentsCount: "",
                studentsSelectedInspireManak: "", inspireStudentsCount: "",
              },
            ])
          }
        >
          + Add Activity
        </Button>
      </Box>
    </>
  );
};

export default ExtraCurricular;