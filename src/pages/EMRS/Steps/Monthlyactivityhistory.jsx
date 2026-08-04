// src/pages/EMRS/Steps/MonthlyActivityHistory.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";
import PaidIcon from "@mui/icons-material/Paid";
import InboxIcon from "@mui/icons-material/Inbox";

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );

const SummaryStat = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#eef2ff",
        color: "#3b4dd1",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

/**
 * @param {Array} submissions - flat list of saved monthly activity entries
 * @param {Function} onDelete - (id) => void, called when the user deletes an entry
 */
const MonthlyActivityHistory = ({ submissions = [], onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const groupedByYear = useMemo(() => {
    const groups = {};
    submissions.forEach((s) => {
      const year = s.year || "Unknown";
      if (!groups[year]) groups[year] = [];
      groups[year].push(s);
    });
    // newest year first
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [submissions]);

  if (submissions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          border: "1px dashed #cbd5e1",
          textAlign: "center",
          background: "#fafbfc",
        }}
      >
        <InboxIcon sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
        <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
          No monthly activity submitted yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Once you submit a monthly activity, it will show up here — organized month by month.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {groupedByYear.map(([year, entries]) => (
        <Box key={year} sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
              {year}
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
            <Chip size="small" label={`${entries.length} month${entries.length > 1 ? "s" : ""}`} />
          </Stack>

          <Stack spacing={1.5}>
            {entries
              .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
              .map((entry) => {
                const panelId = entry.id;
                const totalCost = (entry.operationalCostRows || []).reduce(
                  (sum, r) => sum + (Number(r.amount) || 0),
                  0
                );

                return (
                  <Accordion
                    key={panelId}
                    expanded={expanded === panelId}
                    onChange={(_, isOpen) => setExpanded(isOpen ? panelId : false)}
                    elevation={0}
                    disableGutters
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px !important",
                      overflow: "hidden",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <EventAvailableIcon sx={{ color: "#2f6fed" }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {entry.month} {entry.year}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Submitted {new Date(entry.submittedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        size="small"
                        label="Submitted"
                        sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 600 }}
                      />
                    </AccordionSummary>

                    <AccordionDetails sx={{ borderTop: "1px solid #f1f5f9", pt: 2.5 }}>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<GroupsIcon fontSize="small" />}
                            label="Staff attendance rows"
                            value={(entry.staffAttendanceRows || []).length}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<SchoolIcon fontSize="small" />}
                            label="Student attendance rows"
                            value={(entry.studentAttendanceData || []).length}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<CelebrationIcon fontSize="small" />}
                            label="Saksham Saturday"
                            value={entry.sakshamCompleted ? "Completed" : "Not filled"}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <SummaryStat
                            icon={<PaidIcon fontSize="small" />}
                            label="Operational cost"
                            value={currency(totalCost)}
                          />
                        </Grid>
                      </Grid>

                      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Tooltip title="Delete this month's record">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete && onDelete(panelId)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default MonthlyActivityHistory;