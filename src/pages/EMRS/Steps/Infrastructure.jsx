import React from "react";
import {
  Grid, Typography, Box, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";
import { Controller } from "react-hook-form";

export default function InfrastructureDetails({ control, watch, syncInfraToConstruction }) {
 const sectionBox = (border = "#e2e8f0", bg = "#fff") => ({
  border: `1px solid ${border}`,
  borderRadius: 2,
  p: 2,
  mb: 2,
  background: bg,
});
 return (
    <>
      {/* Header */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            color: "#fff", padding: "8px 16px",
            borderRadius: 2, fontWeight: 600, mb: 2,
          }}>
            Infrastructure Details
          </Typography>
        </Grid>
      </Grid>

      {/* Classrooms */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          🏫 Classrooms
        </Typography>
        <Grid container spacing={2}>
          {["totalClassrooms", "classroomWithSmartClass", "classroomWithProjector"].map((name) => (
            <Grid item xs={12} sm={4} key={name}>
              <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label={
                    name === "totalClassrooms" ? "Total Classrooms" :
                    name === "classroomWithSmartClass" ? "Classroom with Smart Class" :
                    "Classroom with Projector"
                  } type="number" fullWidth size="small" />
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Science Lab */}
      <Box sx={sectionBox("#bbdefb", "#f0f7ff")}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          🔬 Science Lab
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Controller name="scienceLab" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Science Lab Available" fullWidth size="small"  sx={{ minWidth: 220 }}
                   onChange={(e) => { field.onChange(e); syncInfraToConstruction("scienceLab", e.target.value); }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {watch("scienceLab") === "Yes" && (
            ["biologyLab", "chemistryLab", "physicsLab"].map((name) => (
              <Grid item xs={12} sm={3} key={name}>
                <Controller name={name} control={control} defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} select label={
                      name === "biologyLab" ? "Biology Lab" :
                      name === "chemistryLab" ? "Chemistry Lab" : "Physics Lab"
                    } fullWidth size="small"  sx={{ minWidth: 220 }}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Computer Lab */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          💻 Computer Lab
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Controller name="computerLab" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Computer Lab" fullWidth size="small"  sx={{ minWidth: 220 }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {watch("computerLab") === "Yes" && (
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="internetComputerLab" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label="Internet in Computer Lab" fullWidth size="small"  sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Library */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          📚 Library
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Controller name="library" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Library Available" fullWidth size="small"  sx={{ minWidth: 220 }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {watch("library") === "Yes" && (
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="booksInLibrary" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="No. of Books in Library" type="number" fullWidth size="small" />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Playground */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          ⚽ Playground
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Controller name="playground" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Playground Available" fullWidth size="small"  sx={{ minWidth: 220 }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {watch("playground") === "Yes" && (
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="playgroundArea" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Playground Area (sq. ft)" type="number" fullWidth size="small" />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Other Facilities */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          🏛️ Other Facilities
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Controller name="Auditorium" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Auditorium" fullWidth size="small"  sx={{ minWidth: 220 }}
                  onChange={(e) => { field.onChange(e); syncInfraToConstruction("Auditorium", e.target.value); }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {watch("Auditorium") === "Yes" && (
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="auditoriumCapacity" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Auditorium Capacity" type="number" fullWidth size="small"  sx={{ minWidth: 220 }}/>
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4} md={3}>
            <Controller name="Medical Room" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} select label="Medical Room" fullWidth size="small"  sx={{ minWidth: 220 }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Fire & Safety */}
      <Box sx={sectionBox("#ffccbc", "#fff8f6")}>
        <Typography sx={{ fontWeight: 600, color: "#d84315", mb: 1.5, fontSize: 14 }}>
          🔥 Fire & Electrical Safety Compliance
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: "totalFireExtinguishers", label: "Total Fire Extinguishers Installed" },
            { name: "functionalFireExtinguishers", label: "Functional Fire Extinguishers" },
          ].map(({ name, label }) => (
            <Grid item xs={12} sm={4} md={3} key={name}>
              <Controller name={name} control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label={label} type="number" fullWidth size="small"
                    inputProps={{ min: 0 }}
                    onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                  />
                )}
              />
            </Grid>
          ))}
          {[
            { name: "electricalSafetyInspection", label: "Electrical Safety Inspection Conducted" },
            { name: "fireSafetyDrill", label: "Fire Safety Drill Conducted" },
          ].map(({ name, label }) => (
            <Grid item xs={12} sm={4} md={3} key={name}>
              <Controller name={name} control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label={label} fullWidth size="small"  sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Lab Functionality */}
      <Box sx={sectionBox()}>
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
          🧪 Laboratory Functionality
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: "physicsLabFunctional", label: "Physics Lab Functional" },
            { name: "chemistryLabFunctional", label: "Chemistry Lab Functional" },
            { name: "biologyLabFunctional", label: "Biology Lab Functional" },
            { name: "computerLabFunctional", label: "Computer Lab Functional" },
            { name: "mathLabFunctional", label: "Mathematics Lab Functional" },
            { name: "skillLabFunctional", label: "Skill Lab Functional" },
          ].map(({ name, label }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Controller name={name} control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label={label} fullWidth size="small"  sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Controller name="marksLabFunctional" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Marks Obtained (out of 5)" fullWidth size="small"
                  InputProps={{ readOnly: true }} />
              )}
            />
          </Grid>
        </Grid>

        {/* Marking Criteria */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Condition</strong></TableCell>
                  <TableCell><strong>Marks</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { condition: "All 6 Labs functional", marks: 5 },
                  { condition: "3–5 Labs functional", marks: 3 },
                  { condition: "1–2 Labs functional", marks: 1 },
                  { condition: "None functional", marks: 0 },
                ].map((row) => (
                  <TableRow key={row.condition}>
                    <TableCell>{row.condition}</TableCell>
                    <TableCell>{row.marks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
