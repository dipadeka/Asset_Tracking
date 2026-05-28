import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ExtraCurricular = ({
  extraCurricularRows,
  setExtraCurricularRows,
  control,
  watch,
}) => {
  return (
    <>
      {/* ── Section Header ── */}
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
            Extra Curricular Activities
          </Typography>
        </Grid>
      </Grid>

      {/* ── Activity Rows ── */}
      {extraCurricularRows.map((row, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #cbd5e1",
            borderRadius: 2,
            padding: 3,
            mb: 2,
            backgroundColor: "#fff",
          }}
        >
          <Grid container spacing={2}>
            {/* Academic Year */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Academic Year"
                fullWidth
                size="small"
                sx={{ minWidth: 220 }}
                value={row.academicYear}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].academicYear = e.target.value;
                  setExtraCurricularRows(u);
                }}
              >
                {[
                  "2024-2025",
                  "2025-2026",
                  "2026-2027",
                  "2027-2028",
                  "2028-2029",
                  "2029-2030",
                ].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Class */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Class"
                fullWidth
                size="small"
                sx={{ minWidth: 220 }}
                value={row.class || ""}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].class = e.target.value;
                  setExtraCurricularRows(u);
                }}
              >
                {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Section */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Section"
                fullWidth
                size="small"
                sx={{ minWidth: 220 }}
                value={row.section || ""}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].section = e.target.value;
                  setExtraCurricularRows(u);
                }}
              >
                {["A", "B", "C"].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Name of Program */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Name of the Program"
                fullWidth
                size="small"
                value={row.initiativeName}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].initiativeName = e.target.value;
                  setExtraCurricularRows(u);
                }}
              />
            </Grid>

            {/* Collaborating Partner */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Collaborating Partner"
                fullWidth
                size="small"
                value={row.collaboratingPartner}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].collaboratingPartner = e.target.value;
                  setExtraCurricularRows(u);
                }}
              />
            </Grid>

            {/* Areas of Development */}
            <Grid item xs={12} sm={6} md={6}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={row.areasOfDevelopment === "Others" ? 6 : 12}
                >
                  <TextField
                    select
                    label="Areas of Development"
                    fullWidth
                    size="small"
                    sx={{ minWidth: 220 }}
                    value={row.areasOfDevelopment || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const u = [...extraCurricularRows];
                      u[index].areasOfDevelopment = value;
                      if (value !== "Others")
                        u[index].otherAreaOfDevelopment = "";
                      setExtraCurricularRows(u);
                    }}
                  >
                    {[
                      "Sports",
                      "Culture",
                      "Health & Wellness",
                      "Value Education",
                      "Kaushalya Skill Internship",
                      "Computer Skills",
                      "Personality Development",
                      "Excursions",
                      "Career Guidance",
                      "Exposure",
                      "Competitive Exam Training",
                      "Enhancing Learning Skills",
                      "Adventure Activities",
                      "STEM Learning",
                      "Innovation",
                      "Others",
                    ].map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {row.areasOfDevelopment === "Others" && (
                  <Grid item xs={6}>
                    <TextField
                      label="Specify Other"
                      fullWidth
                      size="small"
                      sx={{ minWidth: 220 }}
                      value={row.otherAreaOfDevelopment || ""}
                      onChange={(e) => {
                        const u = [...extraCurricularRows];
                        u[index].otherAreaOfDevelopment = e.target.value;
                        setExtraCurricularRows(u);
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Description / Objectives"
                fullWidth
                size="small"
                value={row.description}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].description = e.target.value;
                  setExtraCurricularRows(u);
                }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Status"
                fullWidth
                size="small"
                sx={{ minWidth: 220 }}
                value={row.status}
                onChange={(e) => {
                  const u = [...extraCurricularRows];
                  u[index].status = e.target.value;
                  setExtraCurricularRows(u);
                }}
              >
                {["Active", "In Progress", "Completed", "Planned"].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      ))}

      {/* ── 2. National Cultural Meet ── */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Box
            sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden" }}
          >
            <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                2. Student Participation in National Level Cultural Meet (5 Marks)
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                background: "#fff",
              }}
            >
              {/* Participated */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="studentsParticipatedCulturalMeet"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Students Participated (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("studentsParticipatedCulturalMeet") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="studentsParticipatedCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Got Medal */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="studentsGotMedalCulturalMeet"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Students Got Rank/Medal (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("studentsGotMedalCulturalMeet") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="studentsRankCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Marks */}
              <Box
                sx={{
                  flex: "1 1 160px",
                  display: "flex",
                  alignItems: "center",
                  background: "#f7faff",
                  border: "1px solid #c8d4e8",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#5a6a85",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Marks Obtained*
                </Typography>
                {(() => {
                  const p = watch("studentsParticipatedCulturalMeet");
                  const m = watch("studentsGotMedalCulturalMeet");
                  const val = p !== "Yes" ? 0 : m === "Yes" ? 5 : 3;
                  return (
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        ml: "auto",
                        color:
                          val === 5
                            ? "#155724"
                            : val === 3
                            ? "#856404"
                            : "#721c24",
                      }}
                    >
                      {val}
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ── 3. NCC & Scout Guide ── */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Box
            sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden" }}
          >
            <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                3. NCC and Scout Guide in EMRS (5 Marks)
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                background: "#fff",
              }}
            >
              {/* NCC */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="nccUnitRunning"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="NCC Unit Running (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("nccUnitRunning") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="nccStudentsCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of NCC Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Scout & Guide */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="scoutGuideRunning"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Scout and Guide Running (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("scoutGuideRunning") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="scoutGuideStudentsCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Marks */}
              <Box
                sx={{
                  flex: "1 1 160px",
                  display: "flex",
                  alignItems: "center",
                  background: "#f7faff",
                  border: "1px solid #c8d4e8",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#5a6a85",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Marks Obtained*
                </Typography>
                {(() => {
                  const yesCount = [
                    watch("nccUnitRunning"),
                    watch("scoutGuideRunning"),
                  ].filter((v) => v === "Yes").length;
                  const val = yesCount === 2 ? 5 : yesCount === 1 ? 3 : 0;
                  return (
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        ml: "auto",
                        color:
                          val === 5
                            ? "#155724"
                            : val === 3
                            ? "#856404"
                            : "#721c24",
                      }}
                    >
                      {val}
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ── 4. RBVP / INSPIRE MANAK ── */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Box
            sx={{ border: "1.5px solid #1a56a0", borderRadius: 0, overflow: "hidden" }}
          >
            <Box sx={{ background: "#1a56a0", px: 2, py: 0.9 }}>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                4. Selection in RBVP / INSPIRE MANAK Award (5 Marks)
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                background: "#fff",
              }}
            >
              {/* RBVP */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="studentsSelectedRBVP"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Students Selected for RBVP (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("studentsSelectedRBVP") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="rbvpStudentsCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* INSPIRE MANAK */}
              <Box sx={{ flex: "1 1 220px" }}>
                <Controller
                  name="studentsSelectedInspireManak"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size="small"
                      label="Students Selected for Inspire MANAK Award (Yes/No)"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {watch("studentsSelectedInspireManak") === "Yes" && (
                <Box sx={{ flex: "1 1 160px" }}>
                  <Controller
                    name="inspireStudentsCount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="No. of Students"
                        type="number"
                        fullWidth
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </Box>
              )}

              {/* Marks */}
              <Box
                sx={{
                  flex: "1 1 160px",
                  display: "flex",
                  alignItems: "center",
                  background: "#f7faff",
                  border: "1px solid #c8d4e8",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#5a6a85",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Marks Obtained*
                </Typography>
                {(() => {
                  const yesCount = [
                    watch("studentsSelectedRBVP"),
                    watch("studentsSelectedInspireManak"),
                  ].filter((v) => v === "Yes").length;
                  const val = yesCount === 2 ? 5 : yesCount === 1 ? 3 : 0;
                  return (
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        ml: "auto",
                        color:
                          val === 5
                            ? "#155724"
                            : val === 3
                            ? "#856404"
                            : "#721c24",
                      }}
                    >
                      {val}
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ── Add Activity Button ── */}
      <Box mb={4}>
        <Button
          variant="outlined"
          onClick={() =>
            setExtraCurricularRows([
              ...extraCurricularRows,
              {
                academicYear: "",
                initiativeName: "",
                collaboratingPartner: "",
                areasOfDevelopment: "",
                description: "",
                targetStudents: "",
                status: "",
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