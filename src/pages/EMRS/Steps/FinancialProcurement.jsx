import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const thStyle = {
  border: "1px solid #e0e0e0",
  padding: "8px",
  textAlign: "left",
  fontWeight: 600,
};
const tdStyle = { border: "1px solid #e0e0e0", padding: "8px" };

const FinancialProcurement = ({
  procurements,
  setProcurements,
  procurementDialogOpen,
  setProcurementDialogOpen,
  currentProcurement,
  setCurrentProcurement,
  financialData,
  handleFundsChange,
  recurringBreakup,
  handleBreakupChange,
  gemMarks,
  getGemMarks,
}) => {
  return (
    <>
      {/* ── Header ── */}
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
            Financial Management and Procurement Compliance
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, p: 3, background: "#fff", mb: 4 }}>
        {/* ── Academic Year ── */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField select fullWidth size="small" sx={{ minWidth: 220 }} label="Academic Year">
              {["2023-2024", "2024-2025", "2025-2026", "2027-2028"].map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* ── GeM Procurement ── */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
          Procurement through GeM Portal (5 Marks)
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setProcurementDialogOpen(true)}
          sx={{ mb: 2, backgroundColor: "#1976d2" }}
        >
          + Add Procurement
        </Button>

        {procurements.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0", marginBottom: 16 }}>
            <thead>
              <tr style={{ background: "#e3f2fd" }}>
                {["Type", "Description", "Total No.", "Order Date", "Value (₹)", "Vendor", "Through GeM", "GeM %", "Marks", "Action"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {procurements.map((p, i) => {
                const rowPct =
                  Number(p.totalNumber) > 0
                    ? ((Number(p.throughGem) / Number(p.totalNumber)) * 100).toFixed(2)
                    : "0.00";
                const rowMarks = getGemMarks(rowPct);
                return (
                  <tr key={i}>
                    <td style={tdStyle}>{p.type}</td>
                    <td style={tdStyle}>{p.description}</td>
                    <td style={tdStyle}>{p.totalNumber}</td>
                    <td style={tdStyle}>{p.orderDate}</td>
                    <td style={tdStyle}>{p.value}</td>
                    <td style={tdStyle}>{p.vendor}</td>
                    <td style={tdStyle}>{p.throughGem}</td>
                    <td style={tdStyle}>{rowPct}%</td>
                    <td style={tdStyle}>{rowMarks}</td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => setProcurements((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ── GeM Marking Criteria ── */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          *Marking Criteria (Out of 5) - GeM Procurement Percentage
        </Typography>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>GeM Procurement Percentage</th>
              <th style={thStyle}>Marks</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "100% procurement through GeM", marks: 5 },
              { label: "75% – 99% procurement through GeM", marks: 4 },
              { label: "50% – 74% procurement through GeM", marks: 3 },
              { label: "25% – 49% procurement through GeM", marks: 1 },
              { label: "Below 25%", marks: 0 },
            ].map((row, i) => (
              <tr
                key={i}
                style={{ background: gemMarks === row.marks && procurements.length > 0 ? "#e8f5e9" : "white" }}
              >
                <td style={tdStyle}>{row.label}</td>
                <td style={tdStyle}>{row.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Fund Utilization ── */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
          Fund Utilization Efficiency
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Total Funds Allocated"
              type="number"
              inputProps={{ min: 0 }}
              value={financialData.totalFundsAllocated}
              onChange={(e) => handleFundsChange("totalFundsAllocated", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Total Funds Utilized"
              type="number"
              inputProps={{ min: 0 }}
              value={financialData.totalFundsUtilized}
              onChange={(e) => handleFundsChange("totalFundsUtilized", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Utilization Percentage (%)"
              type="number"
              value={financialData.utilizationPercentage}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Marks Obtained"
              type="number"
              InputProps={{ readOnly: true }}
              value={financialData.fundUtilMarksObtained}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth size="small" label="Audit Conducted Annually" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              *Marking Criteria (Out of 5) - Fund Utilization
            </Typography>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "left" }}>
                    Fund Utilization
                  </th>
                  <th style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "left" }}>
                    Marks
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["95% – 100%", 5],
                  ["70% – 94%", 3],
                  ["50% – 69%", 1],
                  ["Below 50%", 0],
                ].map(([label, marks], i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{label}</td>
                    <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Box>

      {/* ── Recurring Fund Breakup Table ── */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "#333" }}>
        Component-wise Breakup of Recurring Fund (300 Students)
      </Typography>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #e0e0e0",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "#fff" }}>
            {[
              "S.No",
              "Component",
              "Max. Permissible Annual Expenditure per Student (A)",
              "Max. Permissible Annual Expenditure for 300 Students (B) = A×300",
              "Fund Demanded by State Society (C)",
              "Funds Already Released (D)",
              "Fund Released for Remaining Period (E)",
              "Remarks",
            ].map((h) => (
              <th
                key={h}
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "8px",
                  textAlign: h === "S.No" ? "center" : "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recurringBreakup.map((row, index) => (
            <tr
              key={index}
              style={{ background: index % 2 === 0 ? "#fafafa" : "#fff", verticalAlign: "middle" }}
            >
              <td style={{ border: "1px solid #e0e0e0", padding: "8px", textAlign: "center" }}>
                {row.sno}
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px", fontWeight: "500", color: "#333" }}>
                {row.component}
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "right" } }}
                  value={row.colA}
                  onChange={(e) => handleBreakupChange(index, "colA", e.target.value)}
                  sx={{ width: "130px" }}
                />
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  value={(Number(row.colA) || 0) * 300}
                  InputProps={{ readOnly: true }}
                  inputProps={{ style: { textAlign: "right", background: "#f0f4ff", color: "#1976d2" } }}
                  sx={{ width: "140px" }}
                />
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "right" } }}
                  value={row.colC}
                  onChange={(e) => handleBreakupChange(index, "colC", e.target.value)}
                  sx={{ width: "130px" }}
                />
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "right" } }}
                  value={row.colD}
                  onChange={(e) => handleBreakupChange(index, "colD", e.target.value)}
                  sx={{ width: "130px" }}
                />
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px", textAlign: "right" }}>
                <TextField
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "right" } }}
                  value={row.colE}
                  onChange={(e) => handleBreakupChange(index, "colE", e.target.value)}
                  sx={{ width: "140px" }}
                />
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "4px" }}>
                <TextField
                  size="small"
                  placeholder="Remarks"
                  value={row.remarks}
                  onChange={(e) => handleBreakupChange(index, "remarks", e.target.value)}
                  sx={{ width: "150px" }}
                />
              </td>
            </tr>
          ))}
          {/* Total Row */}
          <tr style={{ background: "#e3f2fd" }}>
            <td colSpan={2} style={{ border: "1px solid #e0e0e0", padding: "8px", fontWeight: "bold" }}>
              TOTAL
            </td>
            {["colA", "colA*300", "colC", "colD", "colE"].map((col, i) => (
              <td
                key={i}
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "8px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                ₹
                {col === "colA*300"
                  ? recurringBreakup
                      .reduce((sum, r) => sum + (Number(r.colA) || 0) * 300, 0)
                      .toLocaleString("en-IN")
                  : recurringBreakup
                      .reduce((sum, r) => sum + (Number(r[col]) || 0), 0)
                      .toLocaleString("en-IN")}
              </td>
            ))}
            <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* ── Add Procurement Dialog ── */}
      <Dialog
        open={procurementDialogOpen}
        onClose={() => setProcurementDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white" }}>
          Add Procurement Entry
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Type of Procurement</InputLabel>
                <Select
                  value={currentProcurement.type}
                  label="Type of Procurement"
                  onChange={(e) =>
                    setCurrentProcurement((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <MenuItem value="Goods">Goods</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={currentProcurement.description}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Total Number of Procurements"
                type="number"
                value={currentProcurement.totalNumber}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, totalNumber: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Procurement Order Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentProcurement.orderDate}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, orderDate: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Procurement Value (₹)"
                type="number"
                value={currentProcurement.value}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Vendor"
                value={currentProcurement.vendor}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, vendor: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Procurement through GeM Portal (count)"
                type="number"
                value={currentProcurement.throughGem}
                onChange={(e) =>
                  setCurrentProcurement((prev) => ({ ...prev, throughGem: e.target.value }))
                }
              />
            </Grid>
            {currentProcurement.totalNumber && currentProcurement.throughGem && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                  GeM %:{" "}
                  {(
                    (Number(currentProcurement.throughGem) /
                      Number(currentProcurement.totalNumber)) *
                    100
                  ).toFixed(2)}
                  % → Marks:{" "}
                  {getGemMarks(
                    (
                      (Number(currentProcurement.throughGem) /
                        Number(currentProcurement.totalNumber)) *
                      100
                    ).toFixed(2)
                  )}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setCurrentProcurement({
                type: "",
                description: "",
                totalNumber: "",
                orderDate: "",
                value: "",
                vendor: "",
                throughGem: "",
              });
              setProcurementDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={
              !currentProcurement.type ||
              !currentProcurement.totalNumber ||
              !currentProcurement.throughGem
            }
            onClick={() => {
              setProcurements((prev) => [...prev, currentProcurement]);
              setCurrentProcurement({
                type: "",
                description: "",
                totalNumber: "",
                orderDate: "",
                value: "",
                vendor: "",
                throughGem: "",
              });
              setProcurementDialogOpen(false);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FinancialProcurement;