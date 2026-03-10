import React, { useState } from "react";
import {
  Box, Typography, Container, Card, CardContent,
  Button, Chip, Divider, Grid, IconButton, Tooltip
} from "@mui/material";
import { useLocation } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

// ── CSV Parser ──
const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.replace(/"/g, "").trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || "—"; });
    return {
      schoolname:    obj["School Name"]  || obj["schoolname"]  || "—",
      EMRScode:      obj["EMRS Code"]    || obj["EMRScode"]    || "—",
      district:      obj["District"]     || obj["district"]    || "—",
      principalName: obj["Principal"]    || obj["principalName"] || "—",
      affiliation:   obj["Affiliation"]  || obj["affiliation"] || "—",
      schooltype:    obj["School Type"]  || obj["schooltype"]  || "—",
      contactno:     obj["Contact"]      || obj["contactno"]   || "—",
      email:         obj["Email"]        || obj["email"]       || "—",
      submittedAt:   obj["Submitted At"] || obj["submittedAt"] || "Imported",
      payload: obj,   // keep raw row too
      imported: true, // flag so we know it came from CSV
    };
  });
};

// ... (keep your existing exportCSV and exportPDF functions here)

// ── MAIN COMPONENT ──
const AlreadyApplied = ({ submittedForms = [], assetForms = [] }) => {
  const location = useLocation();
  const isEMRS  = location.pathname === "/dashboard/applied/emrs";
  const isAsset = location.pathname === "/dashboard/applied/asset";

  const [importedEMRS,  setImportedEMRS]  = useState([]);
  const [importedAsset, setImportedAsset] = useState([]);
  const [dragOver,      setDragOver]      = useState(false);
  const [importError,   setImportError]   = useState("");

  // ── Handle file (from input click or drag-drop) ──
  const handleFile = (file) => {
    setImportError("");
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setImportError("❌ Only .csv files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (parsed.length === 0) {
          setImportError("⚠️ No valid rows found in the CSV.");
          return;
        }
        if (isEMRS)  setImportedEMRS(prev  => [...prev,  ...parsed]);
        if (isAsset) setImportedAsset(prev => [...prev, ...parsed]);
      } catch {
        setImportError("❌ Failed to parse CSV. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeImported = (index) => {
    if (isEMRS)  setImportedEMRS(prev  => prev.filter((_, i) => i !== index));
    if (isAsset) setImportedAsset(prev => prev.filter((_, i) => i !== index));
  };

  // Combine live submitted + imported
  const emrsList  = [...submittedForms,  ...importedEMRS];
  const assetList = [...assetForms, ...importedAsset];
  const currentList = isEMRS ? emrsList : assetList;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>

      {/* ── Page Title ── */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isEMRS ? "EMRS — Submitted Forms" : "Submitted Forms"}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        View your submitted forms here
      </Typography>


      {/* ── FORMS LIST ── */}
      {currentList.length === 0 ? (
        <Box sx={{
          textAlign: "center", py: 8,
          border: "2px dashed #e2e8f0",
          borderRadius: 3, background: "#f8fafc"
        }}>
          <Typography fontSize={48}>📋</Typography>
          <Typography variant="h6" color="text.secondary" mt={1}>
            No forms submitted yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please complete and submit a form to view your application history here.
          </Typography>
        </Box>
      ) : (
        currentList.map((form, i) => (
          <Card key={i} sx={{ mb: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <Box sx={{
              background: form.imported
                ? "linear-gradient(to right, #7c3aed, #a78bfa)"  // purple for imported
                : "linear-gradient(to right, #1976d2, #42a5f5)", // blue for live submitted
              px: 3, py: 1.5,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                🏫 {form.schoolname || "—"}
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                {form.imported && (
                  <Chip
                    label="📥 Imported"
                    size="small"
                    sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }}
                  />
                )}
                <Chip
                  label={isEMRS ? "EMRS" : "Asset"}
                  size="small"
                  sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}
                />
                {/* Remove imported record */}
                {form.imported && (
                  <Tooltip title="Remove">
                    <IconButton size="small" onClick={() => removeImported(
                      // find index among imported only
                      (isEMRS ? importedEMRS : importedAsset).findIndex(
                        (f, idx) => f === form
                      )
                    )} sx={{ color: "rgba(255,255,255,0.7)" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <CardContent>
              <Grid container spacing={2} mb={2}>
                {[
                  { label: "EMRS Code",    value: form.EMRScode },
                  { label: "District",     value: form.district },
                  { label: "Principal",    value: form.principalName },
                  { label: "Submitted At", value: form.submittedAt },
                ].map((field, fi) => (
                  <Grid item xs={12} sm={6} md={3} key={fi}>
                    <Typography variant="caption" color="text.secondary">{field.label}</Typography>
                    <Typography fontWeight={600}>{field.value || "—"}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" size="small"
                  onClick={() => exportCSV(form)}
                  sx={{ borderColor: "#1976d2", color: "#1976d2", fontWeight: 600 }}>
                  ⬇ Export CSV
                </Button>
                <Button variant="contained" size="small"
                  onClick={() => exportPDF(form)}
                  sx={{ background: "linear-gradient(to right, #dc2626, #f87171)", fontWeight: 600 }}>
                  ⬇ Export PDF
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default AlreadyApplied;
