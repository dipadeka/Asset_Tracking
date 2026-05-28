  import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
  const renderStaffAttendance = (staffRows, setStaffRows, staffIndex) => {
    const row = staffRows[staffIndex];
    const attendance = row.monthlyAttendance || [];

    const totalWorking = attendance.reduce(
      (s, r) => s + Number(r.workingDays || 0),
      0,
    );
    const totalPresent = attendance.reduce(
      (s, r) => s + Number(r.present || 0),
      0,
    );
    const totalAbsent = totalWorking - totalPresent;
    const overallPct =
      totalWorking > 0
        ? ((totalPresent / totalWorking) * 100).toFixed(1)
        : null;

    const updateAttRow = (aIdx, field, val) => {
      const u = [...staffRows];
      u[staffIndex].monthlyAttendance[aIdx][field] = val;
      setStaffRows(u);
    };

    const addMonth = () => {
      const u = [...staffRows];
      if (!u[staffIndex].monthlyAttendance)
        u[staffIndex].monthlyAttendance = [];
      u[staffIndex].monthlyAttendance.push({
        month: "",
        workingDays: "",
        present: "",
      });
      setStaffRows(u);
    };

    const removeMonth = (aIdx) => {
      const u = [...staffRows];
      u[staffIndex].monthlyAttendance.splice(aIdx, 1);
      setStaffRows(u);
    };

    return (
      <Box mt={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "#374151" }}
          >
            📅 Monthly Attendance
          </Typography>
          {overallPct && (
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                background:
                  Number(overallPct) >= 75
                    ? "#dcfce7"
                    : Number(overallPct) >= 50
                      ? "#fef3c7"
                      : "#fee2e2",
                color:
                  Number(overallPct) >= 75
                    ? "#16a34a"
                    : Number(overallPct) >= 50
                      ? "#d97706"
                      : "#dc2626",
              }}
            >
              Overall: {overallPct}% &nbsp;|&nbsp; {totalPresent}P /{" "}
              {totalAbsent}A / {totalWorking} days
            </Box>
          )}
        </Box>

        {attendance.length === 0 && (
          <Typography
            sx={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", mb: 1 }}
          >
            No attendance records yet. Click "+ Add Month" to begin.
          </Typography>
        )}

        {attendance.map((att, aIdx) => {
          const workingDays = Number(att.workingDays || 0);
          const present = Number(att.present || 0);
          const absent =
            workingDays > 0 && att.present !== ""
              ? workingDays - present
              : null;
          const pct =
            workingDays > 0 && att.present !== ""
              ? ((present / workingDays) * 100).toFixed(1)
              : null;

          return (
            <Box
              key={aIdx}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 2,
                mb: 1.5,
                background: "#fff",
                position: "relative",
              }}
            >
              {/* Delete button */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ minWidth: 0, px: 1, py: 0.2, fontSize: 11 }}
                  onClick={() => removeMonth(aIdx)}
                >
                  ✕
                </Button>
              </Box>

              <Grid container spacing={2} alignItems="center">
                {/* Month */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Month"
                    fullWidth
                    size="small"
                    sx={{ minWidth: 140 }}
                    value={att.month}
                    onChange={(e) =>
                      updateAttRow(aIdx, "month", e.target.value)
                    }
                  >
                    {[
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                      "January",
                      "February",
                      "March",
                    ].map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Working Days */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Working Days"
                    type="number"
                    fullWidth
                    size="small"
                    value={att.workingDays}
                    inputProps={{ min: 0, max: 31 }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    onChange={(e) =>
                      updateAttRow(aIdx, "workingDays", e.target.value)
                    }
                  />
                </Grid>

                {/* Days Present */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Days Present"
                    type="number"
                    fullWidth
                    size="small"
                    value={att.present}
                    inputProps={{ min: 0, max: workingDays || 31 }}
                    error={
                      att.present !== "" &&
                      present > workingDays &&
                      workingDays > 0
                    }
                    helperText={
                      att.present !== "" &&
                      present > workingDays &&
                      workingDays > 0
                        ? `Max ${workingDays}`
                        : ""
                    }
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    onChange={(e) =>
                      updateAttRow(aIdx, "present", e.target.value)
                    }
                  />
                </Grid>

                {/* Days Absent — auto */}
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    label="Days Absent"
                    fullWidth
                    size="small"
                    value={absent !== null ? absent : ""}
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        background:
                          absent > 0
                            ? "#fff5f5"
                            : absent === 0
                              ? "#f0fff4"
                              : "#f8fafc",
                      },
                      "& input": {
                        color: absent > 0 ? "#c62828" : "#16a34a",
                        fontWeight: 700,
                      },
                    }}
                  />
                </Grid>

                {/* Attendance % bar */}
                <Grid item xs={12} sm={12} md={3}>
                  {pct !== null ? (
                    <Box sx={{ px: 0.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                          Attendance
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            color:
                              Number(pct) >= 75
                                ? "#16a34a"
                                : Number(pct) >= 50
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          background: "#e2e8f0",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            borderRadius: 4,
                            width: `${Math.min(Number(pct), 100)}%`,
                            background:
                              Number(pct) >= 75
                                ? "#16a34a"
                                : Number(pct) >= 50
                                  ? "#f59e0b"
                                  : "#dc2626",
                            transition: "width 0.3s",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          mt: 0.3,
                          color:
                            Number(pct) >= 75
                              ? "#16a34a"
                              : Number(pct) >= 50
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {Number(pct) >= 75
                          ? "🟢 Good"
                          : Number(pct) >= 50
                            ? "🟡 Average"
                            : "🔴 Low"}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      Fill days to see %
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          );
        })}

        {/* Annual Summary — shows only when 2+ months filled */}
        {attendance.length >= 2 && totalWorking > 0 && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
              border: "1px solid #90caf9",
            }}
          >
            <Typography
              sx={{ fontWeight: 700, color: "#1976d2", mb: 1.5, fontSize: 13 }}
            >
              📊 Annual Summary
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Working Days", val: totalWorking, color: "#1976d2" },
                { label: "Present", val: totalPresent, color: "#16a34a" },
                { label: "Absent", val: totalAbsent, color: "#c62828" },
                {
                  label: "Attendance %",
                  val: `${overallPct}%`,
                  color:
                    Number(overallPct) >= 75
                      ? "#16a34a"
                      : Number(overallPct) >= 50
                        ? "#d97706"
                        : "#dc2626",
                },
              ].map(({ label, val, color }) => (
                <Grid item xs={6} sm={3} key={label}>
                  <Box
                    sx={{
                      textAlign: "center",
                      background: "#fff",
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color }}>
                      {val}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                      {label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box mt={1.5}>
          <Button variant="outlined" size="small" onClick={addMonth}>
            + Add Month
          </Button>
        </Box>
      </Box>
    );
  };
export default function StaffAttendance({ staffRows, setStaffRows, staffIndex }) {
  return renderStaffAttendance(staffRows, setStaffRows, staffIndex);
}