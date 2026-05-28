import React from "react";
import { Grid, Typography, Box, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { CONSTRUCTION_CONFIG, CONSTRUCTION_STATUS_STYLE } from "./constants/emrsfields.js";

export default function ConstructionDetails({ control, constructionRows, setConstructionRows }) {

  const renderConstructionTable = (catKey) => {
    const cfg = CONSTRUCTION_CONFIG[catKey];
    const rows = constructionRows[catKey];

    const updateRow = (idx, field, val) => {
      setConstructionRows((prev) => {
        const updated = [...prev[catKey]];
        updated[idx] = { ...updated[idx], [field]: val };
        if (field === "status" && val === "Completed") updated[idx].progress = 100;
        if (field === "status" && val === "Not Started") updated[idx].progress = 0;
        return { ...prev, [catKey]: updated };
      });
    };

    const thStyle = {
      background: cfg.color, color: "#fff", padding: "9px 10px",
      fontSize: 12, fontWeight: 600, textAlign: "left",
      whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.2)",
    };
    const tdStyle = {
      padding: "8px 10px", fontSize: 13, verticalAlign: "middle",
      borderBottom: "1px solid #e5e7eb", borderRight: "1px solid #f1f5f9",
    };
    const nativeInput = {
      width: "100%", border: "1px solid #e2e8f0", borderRadius: 6,
      padding: "5px 8px", fontSize: 12, fontFamily: "inherit",
      outline: "none", boxSizing: "border-box", background: "#fff",
    };

    return (
      <Box key={catKey} mb={3}>
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: cfg.light, border: `1px solid ${cfg.color}30`,
          borderRadius: "10px 10px 0 0", px: 2, py: 1.5,
        }}>
          <Typography sx={{ fontWeight: 700, color: cfg.color, fontSize: 15 }}>
            {cfg.icon} {cfg.label}
          </Typography>
          <Box display="flex" gap={1}>
            <Typography sx={{ background: "#dcfce7", color: "#16a34a", px: 1.5, py: 0.3, borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
              ✅ {rows.filter((r) => r.status === "Completed").length} Done
            </Typography>
            <Typography sx={{ background: "#fef3c7", color: "#d97706", px: 1.5, py: 0.3, borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
              🔄 {rows.filter((r) => r.status === "In Progress").length} Active
            </Typography>
          </Box>
        </Box>
        <Box sx={{ overflowX: "auto", border: `1px solid ${cfg.color}25`, borderTop: "none", borderRadius: "0 0 10px 10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1050 }}>
            <thead>
              <tr>
                {["S.No","Component","Units","Status","Progress (%)","Start Date","End Date","Assigned To","Budget (₹)","Remarks"]
                  .map((h) => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <td style={{ ...tdStyle, textAlign: "center", color: "#9ca3af", fontWeight: 600, width: 40 }}>{i + 1}</td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    {row.component.startsWith("↳") ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 2 }}>
                        <Box sx={{ width: 3, height: 3, borderRadius: "50%", background: "#94a3b8", mt: "1px" }} />
                        <Typography sx={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
                          {row.component.replace("↳ ", "")}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{row.component}</Typography>
                    )}
                  </td>
                  <td style={{ ...tdStyle, minWidth: 100 }}>
                    <input type="text" value={row.units} onChange={(e) => updateRow(i, "units", e.target.value)} style={nativeInput} placeholder="e.g. 2 rooms" />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <select value={row.status} onChange={(e) => updateRow(i, "status", e.target.value)}
                      style={{ ...nativeInput, background: CONSTRUCTION_STATUS_STYLE[row.status]?.bg || "#f3f4f6", color: CONSTRUCTION_STATUS_STYLE[row.status]?.color || "#6b7280", fontWeight: 600, cursor: "pointer" }}>
                      {["Not Started","In Progress","Completed","On Hold","Cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input type="number" min={0} max={100} value={row.progress}
                      onChange={(e) => updateRow(i, "progress", Math.min(100, Math.max(0, Number(e.target.value))))}
                      style={nativeInput} />
                    <Box sx={{ mt: 0.5, height: 5, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
                      <Box sx={{ height: "100%", borderRadius: 2, transition: "width 0.3s", width: `${row.progress}%`,
                        background: row.progress === 100 ? "#16a34a" : row.progress > 0 ? "#f59e0b" : "#d1d5db" }} />
                    </Box>
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input type="date" value={row.startDate} onChange={(e) => updateRow(i, "startDate", e.target.value)} style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 120 }}>
                    <input type="date" value={row.endDate} onChange={(e) => updateRow(i, "endDate", e.target.value)} style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input type="text" value={row.assignedTo} onChange={(e) => updateRow(i, "assignedTo", e.target.value)} placeholder="Name / Agency" style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 110 }}>
                    <input type="number" value={row.budget} onChange={(e) => updateRow(i, "budget", e.target.value)} placeholder="0" style={nativeInput} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 130 }}>
                    <input type="text" value={row.remarks} onChange={(e) => updateRow(i, "remarks", e.target.value)} placeholder="Optional" style={nativeInput} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };

  // Live summary banner
  const all = Object.values(constructionRows).flat();
  const total = all.length;
  const completed = all.filter((r) => r.status === "Completed").length;
  const inProgress = all.filter((r) => r.status === "In Progress").length;
  const pct = total > 0 ? Math.round(all.reduce((s, r) => s + r.progress, 0) / total) : 0;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            color: "#fff", padding: "8px 16px", borderRadius: 2, fontWeight: 600, mb: 2,
          }}>
            🏗️ Construction & Asset Status
          </Typography>
        </Grid>
      </Grid>

      {/* Project Overview */}
      <Box sx={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 2, p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}>
          Project Overview
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: "projectStartDate", label: "Project Start Date" },
            { name: "projectEndDate", label: "Expected End Date" },
          ].map(({ name, label }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Controller name={name} control={control} defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label={label} type="date" InputLabelProps={{ shrink: true }} fullWidth size="small" />
                )}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Controller name="totalProjectBudget" control={control} defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Total Project Budget (₹)" type="number" fullWidth size="small" />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Live Summary Banner */}
      <Box sx={{ background: "linear-gradient(135deg, #1976d2, #42a5f5)", borderRadius: 2, p: 3, mb: 3, color: "#fff" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: 13, opacity: 0.85 }}>Overall Construction Progress</Typography>
            <Typography sx={{ fontSize: 32, fontWeight: 800 }}>{pct}%</Typography>
            <Box sx={{ mt: 1, height: 8, background: "rgba(255,255,255,0.3)", borderRadius: 2 }}>
              <Box sx={{ height: "100%", width: `${pct}%`, background: "#fff", borderRadius: 2, transition: "width 0.5s" }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box display="flex" gap={2} flexWrap="wrap">
              {[
                { label: "Total", val: total, bg: "rgba(255,255,255,0.15)" },
                { label: "✅ Completed", val: completed, bg: "rgba(22,163,74,0.35)" },
                { label: "🔄 In Progress", val: inProgress, bg: "rgba(245,158,11,0.35)" },
                { label: "⏳ Not Started", val: total - completed - inProgress, bg: "rgba(255,255,255,0.1)" },
              ].map(({ label, val, bg }) => (
                <Box key={label} sx={{ textAlign: "center", background: bg, borderRadius: 2, px: 2.5, py: 1.5 }}>
                  <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{val}</Typography>
                  <Typography sx={{ fontSize: 11, opacity: 0.9 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 4 Category Tables */}
      {["school", "residence", "outdoor", "utilities"].map((catKey) =>
        renderConstructionTable(catKey)
      )}
      <Box mb={4} />
    </>
  );
}

