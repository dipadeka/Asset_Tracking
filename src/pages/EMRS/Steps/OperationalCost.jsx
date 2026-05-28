import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

const OperationalCost = ({ operationalCostRows, setOperationalCostRows }) => {
  return (
    <>
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
            Operational Cost Details
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ overflowX: "auto", mb: 2 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              {["S.No", "Year", "Month", "Cost Type", "Amount (₹)", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      borderRight: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {operationalCostRows.map((row, index) => (
              <tr
                key={index}
                style={{ background: index % 2 === 0 ? "#f8fafc" : "#fff" }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontWeight: 700,
                    width: 50,
                    fontSize: 13,
                  }}
                >
                  {index + 1}
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                    minWidth: 130,
                  }}
                >
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={row.year}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].year = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  >
                    {["2024-2025", "2025-2026", "2026-2027"].map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                    minWidth: 140,
                  }}
                >
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={row.month}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].month = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  >
                    {[
                      "April", "May", "June", "July", "August", "September",
                      "October", "November", "December", "January", "February", "March",
                    ].map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                    minWidth: 220,
                  }}
                >
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={row.costType}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].costType = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  >
                    {[
                      "Electricity",
                      "Water",
                      "Internet",
                      "Security Agency",
                      "Event Organized",
                      "Maintenance",
                      "Establishment",
                      "Salary - Contractual Teaching Staff",
                      "Salary - Contractual Non-Teaching Staff",
                      "Miscellaneous",
                      "Others",
                    ].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                    minWidth: 140,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={row.amount}
                    placeholder="0"
                    inputProps={{ min: 0 }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        const u = [...operationalCostRows];
                        u[index].amount = e.target.value;
                        setOperationalCostRows(u);
                      }
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                    width: 90,
                  }}
                >
                  <Box display="flex" gap={0.5} justifyContent="center">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: 0,
                        px: 1.2,
                        py: 0.3,
                        fontSize: 16,
                        backgroundColor: "#f59e0b",
                        "&:hover": { backgroundColor: "#d97706" },
                      }}
                      onClick={() => {
                        const u = [...operationalCostRows];
                        u.splice(index + 1, 0, {
                          year: "",
                          month: "",
                          costType: "",
                          amount: "",
                        });
                        setOperationalCostRows(u);
                      }}
                    >
                      +
                    </Button>
                    {operationalCostRows.length > 1 && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ minWidth: 0, px: 1, py: 0.3, fontSize: 13 }}
                        onClick={() => {
                          const u = [...operationalCostRows];
                          u.splice(index, 1);
                          setOperationalCostRows(u);
                        }}
                      >
                        ✕
                      </Button>
                    )}
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {operationalCostRows.some((r) => r.amount) && (
        <Box
          sx={{
            background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
            border: "1px solid #90caf9",
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}>
            💰 Total Operational Cost
          </Typography>
          <Typography sx={{ fontWeight: 800, color: "#1976d2", fontSize: 18 }}>
            ₹
            {operationalCostRows
              .reduce((sum, r) => sum + Number(r.amount || 0), 0)
              .toLocaleString("en-IN")}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default OperationalCost;