import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Chip, Alert,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tooltip, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  buildSections,
  deduplicate,
  exportCSV,
  exportPDF,
  fetchEmrsFromBackend,
  getFormId,
  readLS,
  removeFormFromLS,
  writeLS,
  EMRS_API_BASE,
} from "./emrsAppliedShared";

const SectionTable = ({ title, rows }) => (
  <Box mb={2}>
    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
      {title}
    </Typography>
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: "#e3f2fd" }}>
            <TableCell sx={{ fontWeight: 700, width: "40%", fontSize: 12 }}>Field</TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: "#374151" }}>{row.label}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{String(row.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

/* ─────────────────────────────────────────────────────────────────────────────
   NEW: EMRS IMAGES SECTION
   Renders every image stored under form.emrsImages (base64 data URLs saved
   from Step 11 "EMRS Image Upload" during submission). Supports both a
   single value per key and an array of values per key.
───────────────────────────────────────────────────────────────────────────── */
const EMRSImagesSection = ({ images }) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  if (!images || typeof images !== "object") return null;

  const entries = Object.entries(images).flatMap(([key, val]) => {
    const values = Array.isArray(val) ? val : [val];
    return values
      .filter((src) => typeof src === "string" && src.startsWith("data:"))
      .map((src, i) => ({ key, src, id: `${key}-${i}` }));
  });

  if (entries.length === 0) return null;

  const labelize = (key) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());

  return (
    <Box mb={2}>
      <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
        📸 Uploaded Images
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {entries.map(({ key, src, id }) => (
          <Box key={id} sx={{ textAlign: "center" }}>
            <Box
              component="img"
              src={src}
              alt={key}
              onClick={() => setPreviewSrc(src)}
              sx={{
                width: 160,
                height: 120,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                boxShadow: 1,
                cursor: "pointer",
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            />
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5, maxWidth: 160 }}>
              {labelize(key)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Click-to-zoom preview dialog */}
      <Dialog open={Boolean(previewSrc)} onClose={() => setPreviewSrc(null)} maxWidth="md">
        <DialogContent sx={{ p: 1, display: "flex", justifyContent: "center" }}>
          {previewSrc && (
            <Box component="img" src={previewSrc} alt="preview" sx={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 1 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewSrc(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FIX 1: filterFormsForUser — match on ANY identifier field
   Previously only matched schoolCode OR username, missing cases where the
   form was saved with EMRScode / loginId / email instead.
───────────────────────────────────────────────────────────────────────────── */
const filterFormsForUser = (forms, currentUser) => {
  if (!currentUser) return [];
  if (currentUser.role !== "school") return forms; // admin / other roles → see everything

  // Collect every possible identifier this user might have
  const userIdentifiers = new Set(
    [
      currentUser.schoolCode,
      currentUser.username,
      currentUser.loginId,
      currentUser.id,
      currentUser.email,
      currentUser.emailid,
    ]
      .filter(Boolean)
      .map((v) => String(v).trim().toLowerCase())
  );

  // Failsafe: if we genuinely have no identifiers, show all so the user
  // isn't locked out (edge case during development/testing).
  if (userIdentifiers.size === 0) return forms;

  return forms.filter((f) => {
    const formIdentifiers = [
      f.EMRScode,
      f.schoolCode,
      f.username,
      f.loginId,
      f.email,
      f.emailid,
    ]
      .filter(Boolean)
      .map((v) => String(v).trim().toLowerCase());

    return formIdentifiers.some((fi) => userIdentifiers.has(fi));
  });
};

const EMRSApplied = () => {
  const { user } = useAuth();
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ─────────────────────────────────────────────────────────────────────────
     FIX 2: loadForms — merge local_* records with API so a freshly-submitted
     form (saved to localStorage while the API call may have failed) is always
     visible immediately without needing a separate offline-fallback path.
  ───────────────────────────────────────────────────────────────────────── */
  const loadForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingCache(false);

    // Always load localStorage first — local_* records must never be lost
    const localRecords = deduplicate(readLS());

    try {
      const fromApi = await fetchEmrsFromBackend();

      // Keep any local_* entries that the server doesn't have yet
      const apiIds = new Set(fromApi.map((f) => String(getFormId(f) || "")));
      const localOnly = localRecords.filter(
        (f) =>
          String(getFormId(f) || "").startsWith("local_") &&
          !apiIds.has(String(getFormId(f) || ""))
      );

      const allForms = deduplicate([...fromApi, ...localOnly]);
      writeLS(allForms); // update cache with merged result

      const visibleForms = filterFormsForUser(allForms, user);
      setSubmittedForms(visibleForms);
    } catch (apiError) {
      // API unreachable — fall back to local cache
      const visibleCached = filterFormsForUser(localRecords, user);
      setSubmittedForms(visibleCached);
      setUsingCache(true);
      setError(
        apiError.message || "Could not reach the server. Showing cached submissions."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadForms();
    window.addEventListener("emrs-form-submitted", loadForms);
    return () => window.removeEventListener("emrs-form-submitted", loadForms);
  }, [loadForms]);

  const handleDeleteClick = (form) => {
    setSelectedForm(form);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedForm(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForm) return;

    const formId = getFormId(selectedForm);
    const emrsCode = selectedForm.EMRScode || selectedForm.schoolCode;

    if (!formId) {
      toast.error("Cannot delete: missing record id.");
      return;
    }

    setDeleting(true);
    try {
      if (!formId.startsWith("local_")) {
        const res = await fetch(`${EMRS_API_BASE}/${formId}`, { method: "DELETE" });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body.message || body.error || "Failed to delete from server");
        }
      }

      removeFormFromLS(formId, emrsCode);
      setSubmittedForms((prev) => prev.filter((f) => getFormId(f) !== formId));

      setDeleteDialogOpen(false);
      setSelectedForm(null);
      toast.success("EMRS form deleted successfully.");

      await loadForms();
    } catch (deleteError) {
      toast.error(deleteError.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Toaster position="top-right" />
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Submitted EMRS Forms
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View, export and manage all submitted EMRS applications
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadForms}>
          Refresh
        </Button>
      </Box>

      {usingCache && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || "Showing cached data because the server is unavailable."}
        </Alert>
      )}

      {!usingCache && error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {submittedForms.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 6, border: "2px dashed #e2e8f0", borderRadius: 3, background: "#f8fafc" }}>
          <Typography fontSize={48}>📋</Typography>
          <Typography fontWeight={600} mt={1}>No EMRS forms submitted yet</Typography>
          <Typography color="text.secondary" fontSize={14}>
            {user?.role === "school"
              ? "You haven't submitted an EMRS form for your school yet."
              : "Complete and submit the EMRS form to see your application here."}
          </Typography>
        </Box>
      ) : (
        submittedForms.map((form, index) => (
          <Accordion
            key={getFormId(form) || index}
            sx={{ mb: 2, borderRadius: "12px !important", boxShadow: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                background: "linear-gradient(to right, #1e3a5f, #1976d2)",
                borderRadius: "12px 12px 0 0",
                color: "#fff",
                "& .MuiAccordionSummary-expandIconWrapper": { color: "#fff" },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap={1} pr={1}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>{form.schoolname || "—"}</Typography>
                  <Typography fontSize={12} sx={{ opacity: 0.85 }}>
                    EMRS Code: {form.EMRScode || form.schoolCode} &nbsp;|&nbsp;
                    District: {form.district} &nbsp;|&nbsp;
                    Submitted: {form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} onClick={(e) => e.stopPropagation()}>
                  <Chip label="Submitted ✅" size="small" sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700 }} />
                  <Tooltip title="Export as CSV/Excel">
                    <IconButton size="small" sx={{ background: "#fff", "&:hover": { background: "#e3f2fd" } }} onClick={() => exportCSV(form)}>
                      <TableChartIcon fontSize="small" sx={{ color: "#16a34a" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export as PDF">
                    <IconButton size="small" sx={{ background: "#fff", "&:hover": { background: "#fee2e2" } }} onClick={() => exportPDF(form)}>
                      <PictureAsPdfIcon fontSize="small" sx={{ color: "#dc2626" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" sx={{ background: "#fff", "&:hover": { background: "#fee2e2" } }} onClick={() => handleDeleteClick(form)}>
                      <DeleteIcon fontSize="small" sx={{ color: "#dc2626" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 3, background: "#f8fafc" }}>
              <Box display="flex" gap={1} mb={3} justifyContent="flex-end">
                <Button variant="outlined" color="success" size="small" startIcon={<TableChartIcon />} onClick={() => exportCSV(form)}>
                  Export CSV / Excel
                </Button>
                <Button variant="outlined" color="error" size="small" startIcon={<PictureAsPdfIcon />} onClick={() => exportPDF(form)}>
                  Export PDF
                </Button>
              </Box>

              {buildSections(form).map((sec) => (
                <SectionTable key={sec.title} title={sec.title} rows={sec.rows} />
              ))}

              {/* NEW: Uploaded EMRS images (Step 11), if present on the record */}
              <EMRSImagesSection images={form.emrsImages} />

              {form.classStrength?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>🎓 Enrollment Details</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Academic Year", "Class", "Section", "Sanctioned Capacity", "Current Enrollment"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12 }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {form.classStrength.map((c, i) => (
                          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
                            <TableCell>{c.academicYear}</TableCell>
                            <TableCell>{c.class}</TableCell>
                            <TableCell>{c.section}</TableCell>
                            <TableCell>{c.sanctionedCapacity}</TableCell>
                            <TableCell>{c.currentEnrollment}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {form.teachingStaff?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>👨‍🏫 Teaching Staff</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Post", "Name", "DOB", "DOJ", "Email", "Contact", "Total", "Filled", "Vacant"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {form.teachingStaff.map((s, i) => (
                          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
                            <TableCell>{s.post}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.dob}</TableCell>
                            <TableCell>{s.doj}</TableCell>
                            <TableCell>{s.email}</TableCell>
                            <TableCell>{s.contact}</TableCell>
                            <TableCell>{s.total}</TableCell>
                            <TableCell>{s.filled}</TableCell>
                            <TableCell>{s.vacant}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {form.nonTeachingStaff?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>👷 Non-Teaching Staff</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Post", "Name", "DOB", "DOJ", "Email", "Contact", "Total", "Filled", "Vacant"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {form.nonTeachingStaff.map((s, i) => (
                          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
                            <TableCell>{s.post}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.dob}</TableCell>
                            <TableCell>{s.doj}</TableCell>
                            <TableCell>{s.email}</TableCell>
                            <TableCell>{s.contact}</TableCell>
                            <TableCell>{s.total}</TableCell>
                            <TableCell>{s.filled}</TableCell>
                            <TableCell>{s.vacant}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {form.operationalCost?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>💰 Operational Cost</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Year", "Month", "Cost Type", "Amount (₹)"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12 }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {form.operationalCost.map((o, i) => (
                          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
                            <TableCell>{o.year}</TableCell>
                            <TableCell>{o.month}</TableCell>
                            <TableCell>{o.costType}</TableCell>
                            <TableCell>₹{Number(o.amount || 0).toLocaleString("en-IN")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>🗑️ Delete EMRS Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedForm?.schoolname || "this form"}</strong>
            {selectedForm?.EMRScode ? ` (${selectedForm.EMRScode})` : ""}? This action{" "}
            <strong>cannot be undone</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EMRSApplied;