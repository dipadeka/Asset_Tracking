import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Chip,
  Container, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, IconButton, TextField, InputAdornment,
} from "@mui/material";

const statusColor = (s) => {
  if (s === "Completed" || s === "completed") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Ongoing"   || s === "Work In Progress") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#f1f5f9", color: "#64748b" };
};

const Row = ({ label, value }) => (
  <Box display="flex" gap={1} mb={0.5}>
    <Typography sx={{ fontSize: 12, color: "#64748b", minWidth: 160, fontWeight: 600 }}>{label}:</Typography>
    <Typography sx={{ fontSize: 12, color: "#1e293b" }}>{value ?? "—"}</Typography>
  </Box>
);

const AssetsApplied = () => {
  const [assets, setAssets]       = useState([]);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("submittedAssets") || "[]");
    setAssets(stored);
  }, []);

  const confirmDelete = (id) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    localStorage.setItem("submittedAssets", JSON.stringify(updated));
    setDeleteId(null);
  };

  const filtered = assets.filter(a =>
    [a.assetName, a.projectName, a.district, a.village, a.assetId]
      .some(v => (v || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container sx={{ pb: 4, pt: 3, backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Assets
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        All submitted asset applications
      </Typography>

      {/* Search */}
      <TextField
        size="small" placeholder="Search by name, project, district…"
        value={search} onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3, background: "#fff", borderRadius: 2, width: { xs: "100%", sm: 360 } }}
        InputProps={{
          startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
        }}
      />

      {filtered.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography sx={{ fontSize: 48 }}>📭</Typography>
          <Typography variant="h6" color="text.secondary" mt={1}>
            {assets.length === 0 ? "No assets submitted yet." : "No results found."}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((asset) => {
            const sc = statusColor(asset.status);
            return (
              <Grid item xs={12} sm={6} md={4} key={asset.id}>
                <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%" }}>
                  {/* Thumbnail */}
                  {asset.photos?.photoConstructionSite ? (
                    <img
                      src={asset.photos.photoConstructionSite}
                      alt="site"
                      style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                    />
                  ) : (
                    <Box sx={{
                      height: 80, borderRadius: "12px 12px 0 0",
                      background: "linear-gradient(to right,#1976d2,#42a5f5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Typography sx={{ fontSize: 32 }}>🏗️</Typography>
                    </Box>
                  )}

                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography fontWeight={700} fontSize={15} sx={{ flex: 1, mr: 1 }}>
                        {asset.assetName || "Unnamed Asset"}
                      </Typography>
                      <Chip
                        label={asset.status || "Unknown"}
                        size="small"
                        sx={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: 10 }}
                      />
                    </Box>

                    <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>
                      📁 {asset.projectName}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>
                      📍 {[asset.village, asset.district].filter(Boolean).join(", ")}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>
                      🗓️ Submitted: {asset.submittedAt ? new Date(asset.submittedAt).toLocaleDateString() : "—"}
                    </Typography>

                    {/* Progress bar */}
                    <Box sx={{ height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden", mb: 1.5 }}>
                      <Box sx={{
                        height: "100%", width: `${asset.completionPercentage || 0}%`,
                        background: asset.completionPercentage === 100
                          ? "linear-gradient(90deg,#22c55e,#16a34a)"
                          : asset.completionPercentage >= 50
                          ? "linear-gradient(90deg,#fbbf24,#d97706)"
                          : "#cbd5e1",
                        borderRadius: 3,
                      }} />
                    </Box>
                    <Typography sx={{ fontSize: 11, color: "#64748b", mb: 1.5 }}>
                      {asset.completionPercentage || 0}% complete
                    </Typography>

                    <Box display="flex" gap={1}>
                      <Button size="small" variant="contained" onClick={() => setSelected(asset)}
                        sx={{ flex: 1, fontSize: 11, background: "linear-gradient(to right,#1976d2,#42a5f5)" }}>
                        View Details
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => setDeleteId(asset.id)}
                        sx={{ fontSize: 11 }}>
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* ===== DETAIL DIALOG ===== */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        {selected && (
          <>
            <DialogTitle sx={{
              background: "linear-gradient(to right,#1976d2,#42a5f5)",
              color: "#fff", fontWeight: 700,
            }}>
              {selected.assetName}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {/* Photos */}
              {Object.values(selected.photos || {}).some(Boolean) && (
                <Box mb={3}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>📸 Photos</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {Object.entries(selected.photos || {}).map(([k, v]) =>
                      v ? (
                        <img key={k} src={v} alt={k}
                          style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }} />
                      ) : null
                    )}
                    {(selected.otherPhotos || []).map((src, i) =>
                      src ? (
                        <img key={i} src={src} alt={`other-${i}`}
                          style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }} />
                      ) : null
                    )}
                  </Box>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>📋 Project Details</Typography>
                  <Row label="Asset ID"            value={selected.assetId} />
                  <Row label="Asset Code"          value={selected.assetCode} />
                  <Row label="Asset Name"          value={selected.assetName} />
                  <Row label="Project Name"        value={selected.projectName} />
                  <Row label="Implementing Agency" value={selected.implementingAgency} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>📍 Address</Typography>
                  <Row label="District"       value={selected.district} />
                  <Row label="Block"          value={selected.block} />
                  <Row label="Gram Panchayat" value={selected.gramPanchayat} />
                  <Row label="Village"        value={selected.village} />
                  <Row label="Latitude"       value={selected.latitude} />
                  <Row label="Longitude"      value={selected.longitude} />
                  <Row label="Area Size"      value={selected.areaSize} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>💰 Financials</Typography>
                  <Row label="Scheme"           value={selected.schemeName} />
                  <Row label="Funding Source"   value={selected.fundingSource} />
                  <Row label="Project Cost"     value={selected.projectCost ? `₹${selected.projectCost} Lakhs` : null} />
                  <Row label="Actual Cost"      value={selected.actualCost ? `₹${selected.actualCost} Lakhs` : null} />
                  <Row label="Contract Value"   value={selected.contractValue ? `₹${selected.contractValue} Lakhs` : null} />
                  <Row label="Work Order No."   value={selected.workOrderNumber} />
                  <Row label="Work Order Date"  value={selected.workOrderDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>📅 Timeline & Status</Typography>
                  <Row label="Start Date"     value={selected.constructionStartDate} />
                  <Row label="End Date"       value={selected.constructionEndDate} />
                  <Row label="Duration"       value={selected.timeOfCompletion ? `${selected.timeOfCompletion} months` : null} />
                  <Row label="Status"         value={selected.status} />
                  <Row label="Completion"     value={`${selected.completionPercentage || 0}%`} />
                  <Row label="Point of Contact" value={selected.pointOfContact} />
                  <Row label="Remarks"        value={selected.remarks} />
                </Grid>
              </Grid>

              {/* Cost Breakdown */}
              {selected.costBreakdown?.length > 0 && (
                <Box mt={2}>
                  <Typography fontWeight={700} fontSize={13} color="#1976d2" mb={1}>📦 Cost Breakdown</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selected.costBreakdown.map((s, i) => (
                      <Chip key={i} label={`${s.category}: ₹${s.amount || 0}L`}
                        size="small" sx={{ background: "#f0f7ff", color: "#1976d2", fontWeight: 600 }} />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelected(null)} variant="contained"
                sx={{ background: "linear-gradient(to right,#1976d2,#42a5f5)" }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Delete Asset?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => confirmDelete(deleteId)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssetsApplied;