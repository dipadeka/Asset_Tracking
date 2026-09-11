import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, CircularProgress, Chip, Alert,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tabs, Tab, Slide, AppBar, Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  buildSections,
  exportPDF,
  fetchEmrsFromBackend,
  getFormId,
  getUniqueKey,
  EMRS_API_BASE,
} from "./emrsAppliedShared";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ───────────────────────────── shared table bits ───────────────────────────── */

const SectionTable = ({ rows }) => (
  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, minWidth: 0 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ background: "#e3f2fd" }}>
          <TableCell sx={{ fontWeight: 700, width: "40%", fontSize: 12, py: 0.5 }}>Field</TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: 12, py: 0.5 }}>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: "#374151", py: 0.5 }}>{row.label}</TableCell>
            <TableCell sx={{ fontSize: 12, py: 0.5, wordBreak: "break-word" }}>{String(row.value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const EmptyTabState = ({ label }) => (
  <Box sx={{ textAlign: "center", p: 3, border: "1px dashed #e2e8f0", borderRadius: 2, background: "#f8fafc" }}>
    <Typography color="text.secondary" fontSize={13}>
      No {label.toLowerCase()} recorded for this submission.
    </Typography>
  </Box>
);

const MultiRowTable = ({ headers, rowKeys, rows }) => (
  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto", minWidth: 0 }}>
    <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
      <TableHead>
        <TableRow sx={{ background: "#e3f2fd" }}>
          {headers.map((h) => (
            <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, whiteSpace: "normal", overflowWrap: "anywhere", py: 0.5 }}>{h}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "#f8fafc" } }}>
            {rowKeys.map((k) => (
              <TableCell key={k} sx={{ fontSize: 11, verticalAlign: "top", overflowWrap: "anywhere", py: 0.5 }}>{valueToText(r[k])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const EMRSImagesSection = ({ images }) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  const entries = images && typeof images === "object"
    ? Object.entries(images).flatMap(([key, val]) => {
        const values = Array.isArray(val) ? val : [val];
        return values
          .map((value) => (typeof value === "string" ? value : value?.dataUrl))
          .filter((src) => typeof src === "string" && (src.startsWith("data:") || src.startsWith("http")))
          .map((src, i) => ({ key, src, id: `${key}-${i}` }));
      })
    : [];

  const labelize = (key) =>
    key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

  if (entries.length === 0) return <EmptyTabState label="images" />;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, minWidth: 0 }}>
        {entries.map(({ key, src, id }) => (
          <Box key={id} sx={{ textAlign: "center" }}>
            <Box
              component="img"
              src={src}
              alt={key}
              onClick={() => setPreviewSrc(src)}
              sx={{
                width: 140, height: 105, objectFit: "cover", borderRadius: 2,
                border: "1px solid #e2e8f0", boxShadow: 1, cursor: "pointer",
                transition: "transform 0.15s", "&:hover": { transform: "scale(1.03)" },
              }}
            />
            <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.5, maxWidth: 140 }}>
              {labelize(key)}
            </Typography>
          </Box>
        ))}
      </Box>

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

const valueToText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const firstSubmittedValue = (form, ...keys) =>
  keys.map((key) => form?.[key]).find((value) => value !== undefined && value !== null);

const CompleteSubmissionTable = ({ form }) => {
  const rows = Object.entries(form)
    .filter(([key]) => !["_id", "id", "__v", "createdAt", "updatedAt", "emrsImages"].includes(key))
    .map(([key, value]) => ({
      label: key.replace(/([a-z])([A-Z])/g, "$1 $2"),
      value: valueToText(value),
    }));
  return <SectionTable rows={rows} />;
};

const SubmittedDataSection = ({ label, data, emptyLabel }) => {
  const rows = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : [];
  if (rows.length === 0) return <EmptyTabState label={emptyLabel || label} />;

  return (
    <Box sx={{ display: "grid", gap: 1.5, minWidth: 0 }}>
      {rows.map((item, index) => (
        <Box key={index} sx={{ minWidth: 0 }}>
          {Array.isArray(data) && (
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#475569", mb: 0.5 }}>
              {label} {index + 1}
            </Typography>
          )}
          <SectionTable
            rows={Object.entries(item).map(([key, value]) => ({
              label: key.replace(/([a-z])([A-Z])/g, "$1 $2"),
              value: valueToText(value),
            }))}
          />
        </Box>
      ))}
    </Box>
  );
};

/* ───────────────────────────── tabbed detail content ───────────────────────────── */

const AppliedFormTabs = ({ form }) => {
  const [activeTab, setActiveTab] = useState(0);

  const sectionTabs = buildSections(form).map((sec) => ({
    label: sec.title,
    content: <SectionTable rows={sec.rows} />,
  }));

  const extraTabs = [
    {
      label: "🎓 Enrollment",
      content: form.classStrength?.length ? (
        <MultiRowTable
          headers={["Academic Year", "Class", "Section", "Sanctioned Capacity", "Current Enrollment"]}
          rowKeys={["academicYear", "class", "section", "sanctionedCapacity", "currentEnrollment"]}
          rows={form.classStrength}
        />
      ) : (
        <EmptyTabState label="enrollment details" />
      ),
    },
    { label: "👨‍🏫 Teaching Staff", content: <SubmittedDataSection label="Teaching Staff" data={form.teachingStaff} /> },
    { label: "👷 Non-Teaching Staff", content: <SubmittedDataSection label="Non-Teaching Staff" data={form.nonTeachingStaff} /> },
    {
      label: "🎭 Extra Curricular",
      content: <SubmittedDataSection label="Extra Curricular Record" data={firstSubmittedValue(form, "extraCurricular", "extraCurricularRows")} />,
    },
    {
      label: "🏥 Hospitalization",
      content: <SubmittedDataSection label="Hospitalization Record" data={firstSubmittedValue(form, "hospitalization", "hospitalizationRows")} />,
    },
    {
      label: "📋 Staff Attendance",
      content: (
        <>
          <SubmittedDataSection label="Teaching Staff Attendance" data={form.teachingStaffAttendance} />
          <Box sx={{ mt: 1.5 }}>
            <SubmittedDataSection label="Non-Teaching Staff Attendance" data={form.nonTeachingStaffAttendance} />
          </Box>
        </>
      ),
    },
    { label: "🎓 Student Attendance", content: <SubmittedDataSection label="Student Attendance Record" data={form.studentAttendance} /> },
    { label: "💰 Operational Cost", content: <SubmittedDataSection label="Operational Cost Entry" data={form.operationalCost} /> },
    {
      label: "📊 Financial & Procurement",
      content: (
        <>
          <SubmittedDataSection label="Financial Summary" data={firstSubmittedValue(form, "financialData", "financial")} />
          <Box sx={{ mt: 1.5 }}>
            <SubmittedDataSection
              label="Recurring Breakup"
              data={firstSubmittedValue(form, "recurringBreakup") || form.financialData?.recurringBreakup || form.financial?.recurringBreakup}
            />
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <SubmittedDataSection
              label="Procurement Record"
              data={firstSubmittedValue(form, "procurements") || form.financialData?.procurements || form.financial?.procurements}
            />
          </Box>
        </>
      ),
    },
    { label: "📸 Images", content: <EMRSImagesSection images={firstSubmittedValue(form, "emrsImages", "uploadedImages")} /> },
    { label: "📄 All Fields", content: <CompleteSubmissionTable form={form} /> },
  ];

  const tabs = [...sectionTabs, ...extraTabs];
  const safeActiveTab = Math.min(activeTab, tabs.length - 1);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Tabs
        value={safeActiveTab}
        onChange={(_e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 1.5,
          borderBottom: "1px solid #e2e8f0",
          minHeight: 34,
          "& .MuiTab-root": { textTransform: "none", fontSize: 12, fontWeight: 600, minHeight: 34, py: 0.5, px: 1.25 },
          "& .Mui-selected": { color: "#1976d2 !important" },
          "& .MuiTabs-indicator": { background: "#1976d2" },
        }}
      >
        {tabs.map((tab) => <Tab key={tab.label} label={tab.label} />)}
      </Tabs>
      <Box sx={{ width: "100%", minWidth: 0 }}>{tabs[safeActiveTab]?.content}</Box>
    </Box>
  );
};

/* ───────────────────────────── helpers ───────────────────────────── */

const filterFormsForUser = (forms, currentUser) => {
  if (!currentUser) return [];
  if (currentUser.role !== "school") return forms;

  const userIdentifiers = new Set(
    [currentUser.schoolCode, currentUser.username, currentUser.loginId, currentUser.id, currentUser.email, currentUser.emailid]
      .filter(Boolean).map((v) => String(v).trim().toLowerCase())
  );
  if (userIdentifiers.size === 0) return forms;

  return forms.filter((f) => {
    const formIdentifiers = [f.EMRScode, f.schoolCode, f.username, f.loginId, f.email, f.emailid]
      .filter(Boolean).map((v) => String(v).trim().toLowerCase());
    return formIdentifiers.some((fi) => userIdentifiers.has(fi));
  });
};

const dedupeForms = (forms) => {
  const map = new Map();
  forms.forEach((f) => {
    const key = getUniqueKey(f) || JSON.stringify(f);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, f);
    } else {
      const existingTime = new Date(existing.submittedAt || existing.createdAt || 0).getTime();
      const currentTime = new Date(f.submittedAt || f.createdAt || 0).getTime();
      map.set(key, currentTime >= existingTime ? f : existing);
    }
  });
  return Array.from(map.values());
};

/* ───────────────────────────── main component ───────────────────────────── */

const EMRSApplied = () => {
  const { user } = useAuth();
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [viewForm, setViewForm] = useState(null); // form currently shown in the detail dialog

  const loadForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fromApi = await fetchEmrsFromBackend();
      const allForms = dedupeForms(fromApi);
      setSubmittedForms(filterFormsForUser(allForms, user));
    } catch (apiError) {
      setSubmittedForms([]);
      setError(apiError.message || "Could not load submissions from the server.");
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

    const uniqueKey = getUniqueKey(selectedForm);
    const formId = getFormId(selectedForm);

    if (!uniqueKey) { toast.error("Cannot delete: this record has no identifier."); return; }
    if (!formId) { toast.error("Cannot delete: this record has no server id."); return; }

    setDeleting(true);
    try {
      const res = await fetch(`${EMRS_API_BASE}/${formId}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || body.error || "Failed to delete from server");

      setSubmittedForms((prev) => prev.filter((f) => getUniqueKey(f) !== uniqueKey));
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
    <Box sx={{ p: 2, width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box", minWidth: 0 }}>
      <Toaster position="top-right" />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1.5} mb={1.5} sx={{ minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.25 }}>
            Submitted EMRS Forms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, export and manage all submitted EMRS applications
          </Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={loadForms}>
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

      {submittedForms.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 5, border: "2px dashed #e2e8f0", borderRadius: 3, background: "#f8fafc" }}>
          <Typography fontSize={40}>📋</Typography>
          <Typography fontWeight={600} mt={1}>No EMRS forms submitted yet</Typography>
          <Typography color="text.secondary" fontSize={14}>
            {user?.role === "school"
              ? "You haven't submitted an EMRS form for your school yet."
              : "Complete and submit the EMRS form to see your application here."}
          </Typography>
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", minWidth: 0 }}>
          <TableContainer sx={{ minWidth: 0 }}>
            <Table size="small" sx={{ minWidth: 0 }}>
              <TableHead>
                <TableRow sx={{ background: "linear-gradient(to right, #1e3a5f, #1976d2)" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>School</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>EMRS Code</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>District</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>Submitted</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: 12, py: 1 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submittedForms.map((form, index) => (
                  <TableRow
                    key={getUniqueKey(form) || index}
                    hover
                    sx={{ "&:nth-of-type(even)": { background: "#f8fafc" }, cursor: "pointer" }}
                    onClick={() => setViewForm(form)}
                  >
                    <TableCell sx={{ fontSize: 13, fontWeight: 600, py: 0.75, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {form.schoolname || "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, py: 0.75 }}>{form.EMRScode || form.schoolCode || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, py: 0.75 }}>{form.district || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12, py: 0.75, whiteSpace: "nowrap" }}>
                      {form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell sx={{ py: 0.75 }}>
                      <Chip label="Submitted ✅" size="small" sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: 11 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.75 }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setViewForm(form)}>
                          <VisibilityIcon fontSize="small" sx={{ color: "#1976d2" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export as PDF">
                        <IconButton size="small" onClick={() => exportPDF(form)}>
                          <PictureAsPdfIcon fontSize="small" sx={{ color: "#dc2626" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(form)}>
                          <DeleteIcon fontSize="small" sx={{ color: "#dc2626" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Detail dialog — full screen, opened per row instead of inline expansion */}
      <Dialog fullScreen open={Boolean(viewForm)} onClose={() => setViewForm(null)} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative", background: "linear-gradient(to right, #1e3a5f, #1976d2)" }}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" color="inherit" onClick={() => setViewForm(null)}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {viewForm?.schoolname || "—"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
                EMRS Code: {viewForm?.EMRScode || viewForm?.schoolCode || "—"} | District: {viewForm?.district || "—"}
              </Typography>
            </Box>
            {viewForm && (
              <Button color="inherit" variant="outlined" size="small" startIcon={<PictureAsPdfIcon />} onClick={() => exportPDF(viewForm)}>
                Export PDF
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, background: "#f8fafc", minHeight: "100%", boxSizing: "border-box" }}>
          {viewForm && <AppliedFormTabs form={viewForm} />}
        </Box>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>🗑️ Delete EMRS Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedForm?.schoolname || "this form"}</strong>
            {selectedForm?.EMRScode ? ` (${selectedForm.EMRScode})` : ""}? This action{" "}
            <strong>cannot be undone</strong>. Only this one submission will be removed —
            other submissions from the same school are not affected.
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