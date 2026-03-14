import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, CircularProgress, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tooltip, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

// ── helpers ──────────────────────────────────────────────
const cell = (label, value) => ({ label, value: value ?? "—" });

const buildSections = (form) => [
  {
    title: "🏫 School Details",
    rows: [
      cell("School Name", form.schoolname),
      cell("EMRS Code", form.EMRScode),
      cell("UDISE Code", form.udaisecode),
      cell("School Type", form.schooltype),
      cell("Affiliation", form.affiliation),
      cell("Principal Name", form.principalName),
      cell("Contact No", form.contactno),
      cell("Email", form.email),
    ],
  },
  {
    title: "📍 Location Details",
    rows: [
      cell("Pincode", form.pincode),
      cell("District", form.district),
      cell("Block", form.block),
      cell("Gram Panchayat", form.grampanchayat),
      cell("Village", form.village),
    ],
  },
  {
    title: "🔬 Infrastructure Details",
    rows: [
      cell("Total Classrooms", form.totalClassrooms),
      cell("Smart Class Rooms", form.classroomWithSmartClass),
      cell("Projector Rooms", form.classroomWithProjector),
      cell("Science Lab", form.scienceLab),
      cell("Biology Lab", form.biologyLab),
      cell("Chemistry Lab", form.chemistryLab),
      cell("Physics Lab", form.physicsLab),
      cell("Computer Lab", form.computerLab),
      cell("Library", form.library),
      cell("Books in Library", form.booksInLibrary),
      cell("Playground", form.playground),
      cell("Playground Area (sq ft)", form.playgroundArea),
      cell("Auditorium", form.auditorium),
      cell("Medical Room", form.medicalRoom),
    ],
  },
  {
    title: "🏠 Boys Hostel",
    rows: [
      cell("Capacity", form.boysHostel?.capacity),
      cell("Beds Available", form.boysHostel?.bedsAvailable),
      cell("Current Occupancy", form.boysHostel?.currentOccupancy),
      cell("CCTV Installed", form.boysHostel?.cctvInstalled),
      cell("No of CCTV", form.boysHostel?.noOfCCTV),
      cell("Security Agency", form.boysHostel?.securityAgency),
      cell("Warden Name", form.boysHostel?.warden?.name),
      cell("Warden Email", form.boysHostel?.warden?.email),
      cell("Warden Contact", form.boysHostel?.warden?.contact),
    ],
  },
  {
    title: "🏠 Girls Hostel",
    rows: [
      cell("Capacity", form.girlsHostel?.capacity),
      cell("Beds Available", form.girlsHostel?.bedsAvailable),
      cell("Current Occupancy", form.girlsHostel?.currentOccupancy),
      cell("CCTV Installed", form.girlsHostel?.cctvInstalled),
      cell("No of CCTV", form.girlsHostel?.noOfCCTV),
      cell("Security Agency", form.girlsHostel?.securityAgency),
      cell("Warden Name", form.girlsHostel?.warden?.name),
      cell("Warden Email", form.girlsHostel?.warden?.email),
      cell("Warden Contact", form.girlsHostel?.warden?.contact),
    ],
  },
  {
    title: "🍽️ Mess Compliance",
    rows: [
      cell("Weekly Menu Displayed", form.messCompliance?.weeklyMenuDisplayed),
      cell("Mess Inspection Register", form.messCompliance?.messInspectionRegister),
      cell("Food Stock Register", form.messCompliance?.foodStockRegister),
      cell("Food Complaint Register", form.messCompliance?.foodComplaintRegister),
      cell("Mess Cleanliness Daily", form.messCompliance?.messCleanlinessDaily),
    ],
  },
];

// CSV Export 
const exportCSV = (form) => {
  const sections = buildSections(form);
  let csv = `EMRS Form Export - ${form.schoolname || "School"}\n\n`;
  sections.forEach((sec) => {
    csv += `${sec.title}\n`;
    csv += "Field,Value\n";
    sec.rows.forEach((r) => {
      csv += `"${r.label}","${String(r.value).replace(/"/g, '""')}"\n`;
    });
    csv += "\n";
  });

  // Enrollment
  if (form.classStrength?.length) {
    csv += "🎓 Enrollment Details\n";
    csv += "Academic Year,Class,Section,Sanctioned Capacity,Current Enrollment\n";
    form.classStrength.forEach((c) => {
      csv += `"${c.academicYear}","${c.class}","${c.section}","${c.sanctionedCapacity}","${c.currentEnrollment}"\n`;
    });
    csv += "\n";
  }

  // Teaching Staff
  if (form.teachingStaff?.length) {
    csv += "👨‍🏫 Teaching Staff\n";
    csv += "Post,Name,DOB,DOJ,Email,Contact,Total,Filled,Vacant\n";
    form.teachingStaff.forEach((s) => {
      csv += `"${s.post}","${s.name}","${s.dob}","${s.doj}","${s.email}","${s.contact}","${s.total}","${s.filled}","${s.vacant}"\n`;
    });
    csv += "\n";
  }

  // Non Teaching Staff
  if (form.nonTeachingStaff?.length) {
    csv += "👷 Non-Teaching Staff\n";
    csv += "Post,Name,DOB,DOJ,Email,Contact,Total,Filled,Vacant\n";
    form.nonTeachingStaff.forEach((s) => {
      csv += `"${s.post}","${s.name}","${s.dob}","${s.doj}","${s.email}","${s.contact}","${s.total}","${s.filled}","${s.vacant}"\n`;
    });
    csv += "\n";
  }

  // Operational Cost
  if (form.operationalCost?.length) {
    csv += "💰 Operational Cost\n";
    csv += "Year,Month,Cost Type,Amount\n";
    form.operationalCost.forEach((o) => {
      csv += `"${o.year}","${o.month}","${o.costType}","${o.amount}"\n`;
    });
    csv += "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EMRS_${form.schoolname || "form"}_${form.EMRScode || ""}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

//  PDF Export 
const exportPDF = (form) => {
  const sections = buildSections(form);
  let html = `
    <html><head><style>
      body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
      h1 { color: #1976d2; font-size: 18px; }
      h2 { color: #1976d2; font-size: 14px; margin-top: 20px; border-bottom: 2px solid #1976d2; padding-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      th { background: #1976d2; color: white; padding: 6px 10px; text-align: left; font-size: 11px; }
      td { padding: 5px 10px; border: 1px solid #e2e8f0; font-size: 11px; }
      tr:nth-child(even) { background: #f8fafc; }
      .header { background: linear-gradient(to right,#1976d2,#42a5f5); color:white; padding:16px; border-radius:8px; margin-bottom:20px; }
      .header p { margin:4px 0; font-size:12px; }
    </style></head><body>
    <div class="header">
      <h1 style="margin:0;color:white">EMRS Form — ${form.schoolname || "—"}</h1>
      <p>EMRS Code: ${form.EMRScode || "—"} &nbsp;|&nbsp; District: ${form.district || "—"}</p>
      <p>Submitted: ${form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}</p>
    </div>`;

  sections.forEach((sec) => {
    html += `<h2>${sec.title}</h2><table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>`;
    sec.rows.forEach((r) => {
      html += `<tr><td><strong>${r.label}</strong></td><td>${r.value}</td></tr>`;
    });
    html += `</tbody></table>`;
  });

  // Enrollment table
  if (form.classStrength?.length) {
    html += `<h2>🎓 Enrollment Details</h2>
    <table><thead><tr>
      <th>Academic Year</th><th>Class</th><th>Section</th>
      <th>Sanctioned Capacity</th><th>Current Enrollment</th>
    </tr></thead><tbody>`;
    form.classStrength.forEach((c) => {
      html += `<tr><td>${c.academicYear}</td><td>${c.class}</td><td>${c.section}</td>
               <td>${c.sanctionedCapacity}</td><td>${c.currentEnrollment}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  // Teaching Staff table
  if (form.teachingStaff?.length) {
    html += `<h2>👨‍🏫 Teaching Staff</h2>
    <table><thead><tr>
      <th>Post</th><th>Name</th><th>DOB</th><th>DOJ</th>
      <th>Email</th><th>Contact</th><th>Total</th><th>Filled</th><th>Vacant</th>
    </tr></thead><tbody>`;
    form.teachingStaff.forEach((s) => {
      html += `<tr><td>${s.post}</td><td>${s.name}</td><td>${s.dob}</td><td>${s.doj}</td>
               <td>${s.email}</td><td>${s.contact}</td><td>${s.total}</td>
               <td>${s.filled}</td><td>${s.vacant}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  // Non Teaching Staff
  if (form.nonTeachingStaff?.length) {
    html += `<h2>👷 Non-Teaching Staff</h2>
    <table><thead><tr>
      <th>Post</th><th>Name</th><th>DOB</th><th>DOJ</th>
      <th>Email</th><th>Contact</th><th>Total</th><th>Filled</th><th>Vacant</th>
    </tr></thead><tbody>`;
    form.nonTeachingStaff.forEach((s) => {
      html += `<tr><td>${s.post}</td><td>${s.name}</td><td>${s.dob}</td><td>${s.doj}</td>
               <td>${s.email}</td><td>${s.contact}</td><td>${s.total}</td>
               <td>${s.filled}</td><td>${s.vacant}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  // Operational Cost
  if (form.operationalCost?.length) {
    html += `<h2>💰 Operational Cost</h2>
    <table><thead><tr><th>Year</th><th>Month</th><th>Cost Type</th><th>Amount (₹)</th></tr></thead><tbody>`;
    form.operationalCost.forEach((o) => {
      html += `<tr><td>${o.year}</td><td>${o.month}</td><td>${o.costType}</td><td>₹${Number(o.amount).toLocaleString("en-IN")}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print(); // opens print/save as PDF dialog
};

//  Section Table Component 
const SectionTable = ({ title, rows }) => (
  <Box mb={2}>
    <Typography sx={{
      fontWeight: 700, fontSize: 13, color: "#1976d2",
      mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5
    }}>
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

// Main Component 
const AlreadyApplied = () => {
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchForms(); }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/emrs");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setSubmittedForms(result.data);
      } else {
        setSubmittedForms([]);
      }
    } catch (err) {
      setError(`Could not load submitted forms. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => { setSelectedFormId(id); setDeleteDialogOpen(true); };
  const handleDeleteCancel = () => { setDeleteDialogOpen(false); setSelectedFormId(null); };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/emrs/${selectedFormId}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok && result.success) {
        setSubmittedForms(prev => prev.filter(f => f._id !== selectedFormId));
        setDeleteDialogOpen(false);
        setSelectedFormId(null);
      } else {
        alert("Failed to delete: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Submitted Forms</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        View, export and manage your submitted forms here
      </Typography>

      {submittedForms.length === 0 ? (
        <Box sx={{
          textAlign: "center", p: 6,
          border: "2px dashed #e2e8f0", borderRadius: 3, background: "#f8fafc"
        }}>
          <Typography fontSize={48}>📋</Typography>
          <Typography fontWeight={600} mt={1}>No forms submitted yet</Typography>
          <Typography color="text.secondary" fontSize={14}>
            Please complete and submit a form to view your application history here.
          </Typography>
        </Box>
      ) : (
        submittedForms.map((form, index) => (
          <Accordion key={form._id || index} sx={{ mb: 2, borderRadius: "12px !important", boxShadow: 2 }}>

            {/* ── Accordion Header ── */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
              background: "linear-gradient(to right, #1e3a5f, #1976d2)",
              borderRadius: "12px 12px 0 0", color: "#fff",
              "& .MuiAccordionSummary-expandIconWrapper": { color: "#fff" }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap={1} pr={1}>
                <Box>
                  <Typography fontWeight={700} fontSize={16}>
                    {form.schoolname || "—"}
                  </Typography>
                  <Typography fontSize={12} sx={{ opacity: 0.85 }}>
                    EMRS Code: {form.EMRScode} &nbsp;|&nbsp; District: {form.district} &nbsp;|&nbsp;
                    Submitted: {form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} onClick={e => e.stopPropagation()}>
                  <Chip label="Submitted ✅" size="small" sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700 }} />

                  {/* CSV Export */}
                  <Tooltip title="Export as CSV/Excel">
                    <IconButton size="small"
                      sx={{ background: "#fff", "&:hover": { background: "#e3f2fd" } }}
                      onClick={() => exportCSV(form)}>
                      <TableChartIcon fontSize="small" sx={{ color: "#16a34a" }} />
                    </IconButton>
                  </Tooltip>

                  {/* PDF Export */}
                  <Tooltip title="Export as PDF">
                    <IconButton size="small"
                      sx={{ background: "#fff", "&:hover": { background: "#fee2e2" } }}
                      onClick={() => exportPDF(form)}>
                      <PictureAsPdfIcon fontSize="small" sx={{ color: "#dc2626" }} />
                    </IconButton>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip title="Delete">
                    <IconButton size="small"
                      sx={{ background: "#fff", "&:hover": { background: "#fee2e2" } }}
                      onClick={() => handleDeleteClick(form._id)}>
                      <DeleteIcon fontSize="small" sx={{ color: "#dc2626" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>

            {/* ── Accordion Body — all sections ── */}
            <AccordionDetails sx={{ p: 3, background: "#f8fafc" }}>

              {/* Export buttons inside too */}
              <Box display="flex" gap={1} mb={3} justifyContent="flex-end">
                <Button variant="outlined" color="success" size="small"
                  startIcon={<TableChartIcon />} onClick={() => exportCSV(form)}>
                  Export CSV / Excel
                </Button>
                <Button variant="outlined" color="error" size="small"
                  startIcon={<PictureAsPdfIcon />} onClick={() => exportPDF(form)}>
                  Export PDF
                </Button>
              </Box>

              {/* All sections */}
              {buildSections(form).map((sec) => (
                <SectionTable key={sec.title} title={sec.title} rows={sec.rows} />
              ))}

              {/* Enrollment Table */}
              {form.classStrength?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
                    🎓 Enrollment Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Academic Year", "Class", "Section", "Sanctioned Capacity", "Current Enrollment"].map(h => (
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

              {/* Teaching Staff Table */}
              {form.teachingStaff?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
                    👨‍🏫 Teaching Staff
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Post", "Name", "DOB", "DOJ", "Email", "Contact", "Total", "Filled", "Vacant"].map(h => (
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

              {/* Non Teaching Staff Table */}
              {form.nonTeachingStaff?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
                    👷 Non-Teaching Staff
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Post", "Name", "DOB", "DOJ", "Email", "Contact", "Total", "Filled", "Vacant"].map(h => (
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

              {/* Operational Cost Table */}
              {form.operationalCost?.length > 0 && (
                <Box mb={2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1976d2", mb: 1, borderBottom: "2px solid #e3f2fd", pb: 0.5 }}>
                    💰 Operational Cost
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "#e3f2fd" }}>
                          {["Year", "Month", "Cost Type", "Amount (₹)"].map(h => (
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

      {/* ── Delete Dialog ── */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>🗑️ Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this form? This action <strong>cannot be undone</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" disabled={deleting}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlreadyApplied;