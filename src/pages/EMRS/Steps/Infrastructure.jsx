import React, { useRef, useState } from "react";
import {
  Grid, Typography, Box, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Autocomplete, Paper, Chip, Button, IconButton,
  Checkbox, ListItemText, OutlinedInput, Select, FormControl, InputLabel
} from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import * as XLSX from "xlsx";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

const bookCategoryOptions = [
  { id: "Textbooks & Academic Guides: Core curriculum NCERT/CBSE books, question banks, and competitive exam preparation materials.", label: "Textbooks & Academic Guides" },
  { id: "Reference Books: Encyclopedias, dictionaries, atlases, yearbooks, and subject-specific handbooks.", label: "Reference Books" },
  { id: "Fiction & Literature: Novels, short story collections, poetry, mythological tales, and graphic novels in both English and regional languages.", label: "Fiction & Literature" },
  { id: "Non-Fiction & General Knowledge: Books on history, geography, basic sciences, and Indian polity to support broad learning.", label: "Non-Fiction & GK" },
  { id: "Biographies & Autobiographies: Inspirational life stories of freedom fighters, scientists, and global leaders.", label: "Biographies & Autobiographies" },
  { id: "Arts, Crafts & Hobbies: Books focused on tribal arts, music, painting, sports, and life skills.", label: "Arts, Crafts & Hobbies" },
  { id: "Periodicals & Magazines: Educational journals, daily newspapers, and current affairs magazines.", label: "Periodicals & Magazines" },
  { id: "Career Guidance: Guides on vocational courses, higher education planning, and professional options.", label: "Career Guidance" }
];

const CLASS_SECTIONS = [
  { class: 6,  sections: ["A", "B"] },
  { class: 7,  sections: ["A", "B"] },
  { class: 8,  sections: ["A", "B"] },
  { class: 9,  sections: ["A", "B"] },
  { class: 10, sections: ["A", "B"] },
  { class: 11, sections: ["A", "B", "C"] },
  { class: 12, sections: ["A", "B", "C"] },
];

const CLASS_ROWS = CLASS_SECTIONS.flatMap(({ class: cls, sections }) =>
  sections.map((sec) => ({ key: `cls${cls}_${sec}`, label: `Class ${cls} – Section ${sec}` }))
);

const TOTAL_CLASSROOMS = CLASS_ROWS.length;

const SPORTS_OPTIONS = ["Kho-kho", "Basketball", "Volleyball", "Kabaddi", "Archery", "Others"];

// ─── Reusable Excel Upload + Preview Component ───────────────────────────────
function ExcelUploadField({ label, value, onChange, templateCols, hint }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      onChange({ fileName: file.name, rows });
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet(templateCols);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${label.replace(/\s+/g, "_")}_Template.xlsx`);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current.click()}
          sx={{ textTransform: "none", fontSize: 13 }}
        >
          {label}
        </Button>
        <Button
          variant="text"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadTemplate}
          sx={{ textTransform: "none", fontSize: 12, color: "#1976d2" }}
        >
          Download Template
        </Button>
        {value?.fileName && (
          <>
            <Chip
              label={value.fileName}
              size="small"
              color="success"
              variant="outlined"
              onDelete={() => onChange(null)}
              deleteIcon={<DeleteIcon />}
            />
            <Typography sx={{ fontSize: 11, color: "#888" }}>
              {value.rows?.length} row(s) loaded
            </Typography>
          </>
        )}
      </Box>

      {hint && !value?.fileName && (
        <Typography sx={{ fontSize: 11, color: "#999", mb: 1 }}>💡 {hint}</Typography>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      {value?.rows?.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1, maxHeight: 260, overflow: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                {Object.keys(value.rows[0]).map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#e3f2fd" }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {value.rows.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fbff" }}>
                  {Object.values(row).map((cell, j) => (
                    <TableCell key={j} sx={{ fontSize: 12 }}>{String(cell)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Fire Audit Table Row ─────────────────────────────────────────────────────
function FireAuditRow({ row, index, onChange, onDelete }) {
  const nocInputRef = useRef();

  const handleNocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Try to extract year from filename (e.g. "NOC_2023.pdf" → 2023)
    const yearMatch = file.name.match(/\b(20\d{2})\b/);
    const extractedYear = yearMatch ? yearMatch[1] : "";

    // Generate a mock NOC number from filename
    const nocNo = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();

    onChange(index, {
      ...row,
      nocFile: file.name,
      year: extractedYear || row.year,
      nocCertificate: "Yes",
      nocNo: nocNo,
    });
    e.target.value = "";
  };

  return (
    <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#fff8f6" }}>
      {/* Year */}
      <TableCell sx={{ minWidth: 110 }}>
        <TextField
          size="small"
          value={row.year}
          onChange={(e) => onChange(index, { ...row, year: e.target.value })}
          placeholder="e.g. 2023"
          fullWidth
          sx={{ fontSize: 12 }}
        />
      </TableCell>

      {/* NOC Dropdown */}
      <TableCell sx={{ minWidth: 110 }}>
        <TextField
          select
          size="small"
          value={row.nocCertificate}
          onChange={(e) => onChange(index, { ...row, nocCertificate: e.target.value })}
          fullWidth
        >
          <MenuItem value="">— Select —</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </TableCell>

      {/* NOC No */}
      <TableCell sx={{ minWidth: 160 }}>
        <TextField
          size="small"
          value={row.nocNo}
          onChange={(e) => onChange(index, { ...row, nocNo: e.target.value })}
          placeholder="NOC Number"
          fullWidth
          sx={{ fontSize: 12 }}
        />
      </TableCell>

      {/* Upload NOC */}
      <TableCell sx={{ minWidth: 180 }}>
        <input
          ref={nocInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={handleNocUpload}
        />
        {row.nocFile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Chip
              label={row.nocFile}
              size="small"
              color="success"
              variant="outlined"
              onDelete={() => onChange(index, { ...row, nocFile: "", nocCertificate: row.nocCertificate === "Yes" ? "" : row.nocCertificate, nocNo: "", year: row.year })}
              deleteIcon={<DeleteIcon />}
              sx={{ fontSize: 10, maxWidth: 140 }}
            />
          </Box>
        ) : (
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={() => nocInputRef.current.click()}
            sx={{ textTransform: "none", fontSize: 11, color: "#d84315", borderColor: "#d84315",
              "&:hover": { borderColor: "#bf360c", backgroundColor: "#fff3e0" } }}
          >
            Upload NOC
          </Button>
        )}
      </TableCell>

      {/* Delete */}
      <TableCell sx={{ width: 48 }}>
        <IconButton size="small" color="error" onClick={() => onDelete(index)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function InfrastructureDetails({ control, watch, setValue, syncInfraToConstruction }) {
  const sectionBox = (border = "#e2e8f0", bg = "#fff") => ({
    border: `1px solid ${border}`,
    borderRadius: 2,
    p: 2,
    mb: 2,
    background: bg,
  });

  const allSmartValues = useWatch({ control, name: CLASS_ROWS.map(r => `classroom_smart_${r.key}`) });
  const allProjValues  = useWatch({ control, name: CLASS_ROWS.map(r => `classroom_proj_${r.key}`) });

  const smartYesCount = (allSmartValues || []).filter(v => v === "Yes").length;
  const projYesCount  = (allProjValues  || []).filter(v => v === "Yes").length;
  const smartNoCount  = (allSmartValues || []).filter(v => v === "No").length;
  const projNoCount   = (allProjValues  || []).filter(v => v === "No").length;

  // Fire Audit rows state (local, or wire via Controller if needed)
  const [fireAuditRows, setFireAuditRows] = useState([
    { year: "", nocCertificate: "", nocNo: "", nocFile: "" }
  ]);

  const handleFireAuditRowChange = (index, updatedRow) => {
    setFireAuditRows(prev => prev.map((r, i) => i === index ? updatedRow : r));
  };

  const handleAddFireAuditRow = () => {
    setFireAuditRows(prev => [...prev, { year: "", nocCertificate: "", nocNo: "", nocFile: "" }]);
  };

  const handleDeleteFireAuditRow = (index) => {
    setFireAuditRows(prev => prev.filter((_, i) => i !== index));
  };

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
        <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 0.5, fontSize: 14 }}>
          🏫 Classrooms
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#555", mb: 2 }}>
          Total Classrooms: <strong>{TOTAL_CLASSROOMS}</strong> &nbsp;|&nbsp;
          Smart Class Available: <Chip label={smartYesCount} size="small" color="primary" sx={{ fontSize: 11 }} /> &nbsp;
          Not Available: <Chip label={smartNoCount} size="small" color="default" sx={{ fontSize: 11 }} /> &nbsp;|&nbsp;
          Projector Available: <Chip label={projYesCount} size="small" color="secondary" sx={{ fontSize: 11 }} /> &nbsp;
          Not Available: <Chip label={projNoCount} size="small" color="default" sx={{ fontSize: 11 }} />
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Class – Section</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, minWidth: 180 }}>Smart Class</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, minWidth: 180 }}>Projector</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CLASS_ROWS.map((row, idx) => (
                <TableRow key={row.key} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fbff" }}>
                  <TableCell sx={{ fontWeight: 500, fontSize: 13 }}>{row.label}</TableCell>
                  <TableCell>
                    <Controller
                      name={`classroom_smart_${row.key}`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField {...field} select size="small" fullWidth label="Smart Class" sx={{ minWidth: 160 }}>
                          <MenuItem value="Yes">✅ Yes</MenuItem>
                          <MenuItem value="No">❌ No</MenuItem>
                        </TextField>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`classroom_proj_${row.key}`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField {...field} select size="small" fullWidth label="Projector" sx={{ minWidth: 160 }}>
                          <MenuItem value="Yes">✅ Yes</MenuItem>
                          <MenuItem value="No">❌ No</MenuItem>
                        </TextField>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: "#e8f5e9", fontWeight: 700 }}>
                <TableCell sx={{ fontWeight: 700 }}>Total ({TOTAL_CLASSROOMS} rooms)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  ✅ {smartYesCount} &nbsp; ❌ {smartNoCount}
                  {smartYesCount + smartNoCount < TOTAL_CLASSROOMS && (
                    <Typography component="span" sx={{ fontSize: 11, color: "#999", ml: 1 }}>
                      ({TOTAL_CLASSROOMS - smartYesCount - smartNoCount} pending)
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  ✅ {projYesCount} &nbsp; ❌ {projNoCount}
                  {projYesCount + projNoCount < TOTAL_CLASSROOMS && (
                    <Typography component="span" sx={{ fontSize: 11, color: "#999", ml: 1 }}>
                      ({TOTAL_CLASSROOMS - projYesCount - projNoCount} pending)
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
                  <TextField {...field} select label={label} fullWidth size="small" sx={{ minWidth: 220 }}>
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
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1976d2", mb: 2, mt: 4, textAlign: "left" }}>
            📋 Marking Criteria of Laboratory Functionalities as per NESTS Guidelines
          </Typography>
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

        {/* Library */}
        <Box sx={sectionBox()}>
          <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
            📚 Library
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="library" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label="Library Available" fullWidth size="small" sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {watch("library") === "Yes" && (
              <>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="booksInLibrary" control={control} defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="No. of Books in Library" type="number" fullWidth size="small" sx={{ minWidth: 220 }} />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={6}>
                  <Controller
                    name="bookCategories"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={bookCategoryOptions}
                        getOptionLabel={(option) => option.label}
                        value={bookCategoryOptions.filter(opt => (value || []).includes(opt.id))}
                        onChange={(event, newValue) => { onChange(newValue.map(item => item.id)); }}
                        disableCloseOnSelect
                        slotProps={{ popper: { sx: { width: '450px !important' } } }}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>{option.label}</Typography>
                            <Typography variant="caption" sx={{ color: '#666', whiteSpace: 'normal' }}>{option.description}</Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Category of Books" placeholder="Select categories" size="small" sx={{ minWidth: 220 }} fullWidth />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ border: "1px dashed #90caf9", borderRadius: 2, p: 2, backgroundColor: "#f0f7ff" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1976d2", mb: 1 }}>
                      📂 Upload Book Requirements
                    </Typography>
                    <Controller
                      name="libraryBooksFile"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        <ExcelUploadField
                          label="Upload Book Requirements (Excel)"
                          value={value}
                          onChange={onChange}
                          templateCols={[
                            ["Requirements of Books in the Library"],
                            ["Sl No", "Category of Book", "Book Name", "Quantity"]
                          ]}
                          hint="Excel should have columns: Sl No | Category of Book | Book Name | Quantity"
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Playground */}
        <Box sx={sectionBox()}>
          <Typography sx={{ fontWeight: 600, color: "#1976d2", mb: 1.5, fontSize: 14 }}>
            ⚽ Playground
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="playground" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label="Playground Available" fullWidth size="small" sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {watch("playground") === "Yes" && (
              <>
                {/* Playground Area */}
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="playgroundArea" control={control} defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Playground Area (sq. ft)" type="number" fullWidth size="small" />
                    )}
                  />
                </Grid>

                {/* ── NEW: Types of Sports Played ── */}
                <Grid item xs={12} sm={6} md={5}>
                  <Controller
                    name="sportsPlayed"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={SPORTS_OPTIONS}
                        value={value || []}
                        onChange={(_, newValue) => onChange(newValue)}
                        disableCloseOnSelect
                        renderOption={(props, option, { selected }) => (
                          <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Checkbox size="small" checked={selected} sx={{ p: 0 }} />
                            <ListItemText primary={option} primaryTypographyProps={{ fontSize: 13 }} />
                          </Box>
                        )}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              key={option}
                              label={option}
                              size="small"
                              color={option === "Others" ? "warning" : "primary"}
                              variant="outlined"
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Types of Sports Played in the Playground"
                            placeholder="Select sports"
                            size="small" sx={{ minWidth: 220 }}
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* If "Others" is selected, show a text field */}
                {(watch("sportsPlayed") || []).includes("Others") && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="sportsPlayedOthers"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Please specify other sport(s)"
                          placeholder="e.g. Badminton, Cricket..."
                          fullWidth
                          size="small"
                          sx={{ minWidth: 220 }}
                        />
                      )}
                    />
                  </Grid>
                )}

                {/* Sports Equipment Upload */}
                <Grid item xs={12}>
                  <Box sx={{ border: "1px dashed #a5d6a7", borderRadius: 2, p: 2, backgroundColor: "#f1fff4" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#2e7d32", mb: 1 }}>
                      🏅 Upload Requirements of Sports Gear
                    </Typography>
                    <Controller
                      name="sportsEquipmentFile"
                      control={control}
                      defaultValue={null}
                      render={({ field: { onChange, value } }) => (
                        <ExcelUploadField
                          label="Upload Sports Equipment (Excel)"
                          value={value}
                          onChange={onChange}
                          templateCols={[
                            ["Requirements of Sports Gear and Equipment"],
                            ["Sl No", "Category of the Sports Gear", "Quantity"]
                          ]}
                          hint="Excel should have columns: Sl No | Category of the Sports Gear | Quantity"
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </>
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
                  <TextField {...field} select label="Auditorium" fullWidth size="small" sx={{ minWidth: 220 }}
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
                    <TextField {...field} label="Auditorium Capacity" type="number" fullWidth size="small" sx={{ minWidth: 220 }} />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="Infirmary" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label="Infirmary" fullWidth size="small" sx={{ minWidth: 220 }}>
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
              { name: "firesafetysysteminstalled", label: "Fire Safety System Installed" },
              { name: "electricalSafetyInspection", label: "Electrical Safety Inspection Conducted" },
              { name: "fireSafetyDrill", label: "Fire Safety Drill Conducted" },
              { name: "disastersafetydrill", label: "Disaster Safety Drill Conducted" },
            ].map(({ name, label }) => (
              <Grid item xs={12} sm={4} md={3} key={name}>
                <Controller name={name} control={control} defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} select label={label} fullWidth size="small" sx={{ minWidth: 220 }}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            ))}

            {/* ── NEW: Fire Audit Conducted ── */}
            <Grid item xs={12} sm={4} md={3}>
              <Controller name="fireAuditConducted" control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} select label="Fire Audit Conducted" fullWidth size="small" sx={{ minWidth: 220 }}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          {/* Fire Audit Table — shown only when "Yes" */}
          {watch("fireAuditConducted") === "Yes" && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#d84315" }}>
                  🗂️ Fire Audit NOC Details
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddFireAuditRow}
                  sx={{
                    textTransform: "none",
                    fontSize: 12,
                    color: "#d84315",
                    borderColor: "#d84315",
                    "&:hover": { borderColor: "#bf360c", backgroundColor: "#fff3e0" }
                  }}
                >
                  Add Row
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderColor: "#ffccbc" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fbe9e7" }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#bf360c" }}>Year</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#bf360c" }}>NOC</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#bf360c" }}>NOC No.</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: "#bf360c" }}>Upload NOC</TableCell>
                      <TableCell sx={{ width: 48 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fireAuditRows.map((row, index) => (
                      <FireAuditRow
                        key={index}
                        row={row}
                        index={index}
                        onChange={handleFireAuditRowChange}
                        onDelete={handleDeleteFireAuditRow}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography sx={{ fontSize: 11, color: "#999", mt: 1 }}>
                💡 Uploading an NOC file will auto-fill the Year (if found in filename) and NOC Number.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}