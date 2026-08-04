// src/pages/EMRS/Steps/OperationalCost.jsx
import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED "TRIBAL" DESIGN TOKENS — same palette + type scale as
   MonthlyActivity.jsx / Attendance.jsx, kept local here so this file has no
   circular import back to the page that renders it.
───────────────────────────────────────────────────────────────────────────── */
const PAL = {
  sand: "#F4E9D7",
  sandDark: "#EADCC0",
  clay: "#B4451F",
  clayDark: "#8C3416",
  ochre: "#DDA23A",
  ochreLight: "#EFC777",
  brown: "#5B3A24",
  brownDark: "#3A2415",
  cream: "#FBF4E8",
  ink: "#2E1D10",
};

const FONT_DISPLAY = "'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/** Small decorative diamond used as a bullet before headings, matching the other tribal pages. */
const DiamondBullet = ({ size = 8, color = PAL.ochre }) => (
  <Box
    aria-hidden
    sx={{
      width: size,
      height: size,
      bgcolor: color,
      transform: "rotate(45deg)",
      flexShrink: 0,
      borderRadius: "2px",
      boxShadow: `0 0 0 2px ${PAL.cream}`,
    }}
  />
);

/** Thin woven zig-zag divider, matching the other tribal pages. */
const ZigZagDivider = ({ color = PAL.ochre, height = 10 }) => (
  <Box
    aria-hidden
    sx={{
      width: "100%",
      height,
      backgroundImage: `linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%), linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(315deg, ${color} 25%, transparent 25%)`,
      backgroundPosition: `${height}px 0, ${height}px 0, 0 0, 0 0`,
      backgroundSize: `${height * 2}px ${height * 2}px`,
      backgroundRepeat: "repeat-x",
      opacity: 0.9,
    }}
  />
);

const COST_TYPES = [
  "Electricity",
  "Internet",
  "Security Agency",
  "Event Organized",
  "Maintenance",
  "Establishment",
  "Salary - Contractual Teaching Staff",
  "Salary - Contractual Non-Teaching Staff",
  "Miscellaneous",
  "Others",
];

const YEAR_OPTIONS = ["2024-2025", "2025-2026", "2026-2027"];

const MONTH_OPTIONS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

/** Reusable tribal-styled dropdown cell to avoid repeating sx props. */
const TribalSelect = ({ value, onChange, options }) => (
  <TextField
    select
    fullWidth
    size="small"
    value={value}
    onChange={onChange}
    sx={{
      "& .MuiOutlinedInput-root": { bgcolor: PAL.cream },
      "& .MuiOutlinedInput-notchedOutline": { borderColor: PAL.ochre },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PAL.clay },
    }}
  >
    {options.map((opt) => (
      <MenuItem key={opt} value={opt} sx={{ fontFamily: FONT_BODY, fontSize: 13 }}>
        {opt}
      </MenuItem>
    ))}
  </TextField>
);

const OperationalCost = ({ operationalCostRows, setOperationalCostRows }) => {
  const total = operationalCostRows.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
            <DiamondBullet size={9} />
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 0.3,
                color: PAL.clayDark,
              }}
            >
              Operational Cost Details
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <ZigZagDivider />
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          overflowX: "auto",
          mb: 2,
          border: `2px solid ${PAL.ochre}`,
          borderRadius: 2,
          background: PAL.cream,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 650,
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead>
            <tr>
              {["S.No", "Year", "Month", "Cost Type", "Amount (₹)", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      background: PAL.clay,
                      color: PAL.cream,
                      padding: "10px 8px",
                      fontSize: 13,
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      borderRight: "1px solid rgba(255,255,255,0.25)",
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
                style={{ background: index % 2 === 0 ? PAL.sand : "#fff" }}
              >
                <td
                  style={{
                    padding: "8px 6px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                    color: "#9c8b6f",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: FONT_BODY,
                  }}
                >
                  {index + 1}
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                  }}
                >
                  <TribalSelect
                    value={row.year}
                    options={YEAR_OPTIONS}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].year = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                  }}
                >
                  <TribalSelect
                    value={row.month}
                    options={MONTH_OPTIONS}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].month = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                  }}
                >
                  <TribalSelect
                    value={row.costType}
                    options={COST_TYPES}
                    onChange={(e) => {
                      const u = [...operationalCostRows];
                      u[index].costType = e.target.value;
                      setOperationalCostRows(u);
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={row.amount}
                    placeholder="0"
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": { bgcolor: PAL.cream },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: PAL.ochre },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: PAL.clay },
                    }}
                  />
                </td>

                <td
                  style={{
                    padding: "6px 8px",
                    border: `1px solid ${PAL.sandDark}`,
                    textAlign: "center",
                  }}
                >
                  <Box display="flex" gap={0.75} justifyContent="center">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: 0,
                        px: 1.2,
                        py: 0.3,
                        fontSize: 15,
                        fontFamily: FONT_BODY,
                        backgroundColor: PAL.ochre,
                        color: PAL.brownDark,
                        boxShadow: "0 2px 0 rgba(58,36,21,0.25)",
                        "&:hover": { backgroundColor: PAL.ochreLight },
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
                        sx={{
                          minWidth: 0,
                          px: 1,
                          py: 0.3,
                          fontSize: 13,
                          fontFamily: FONT_BODY,
                          borderColor: PAL.clay,
                          color: PAL.clay,
                          "&:hover": { bgcolor: "#F9E1DC", borderColor: PAL.clayDark },
                        }}
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
            background: `linear-gradient(135deg, ${PAL.sand}, ${PAL.cream})`,
            border: `2px solid ${PAL.ochre}`,
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 3px 0 rgba(58,36,21,0.12)",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              color: PAL.clayDark,
              fontSize: 15,
            }}
          >
            💰 Total Operational Cost
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              color: PAL.clay,
              fontSize: 18,
            }}
          >
            ₹{total.toLocaleString("en-IN")}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default OperationalCost;