// src/pages/EMRS/SchoolEMRSWrapper.jsx
// ─────────────────────────────────────────────────────────────
//  Route component for /dashboard/emrs — reads the logged-in school
//  from AuthContext and pre-fills school identity fields in EMRSForm.
//  Submitted records are stored on the server (API); only in-progress
//  drafts are kept in localStorage inside EMRSForm.
// ─────────────────────────────────────────────────────────────
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import EMRSForm from "./EMRSForm";

const SchoolEMRSWrapper = () => {
  const { user } = useAuth();

  if (!user || user.role !== "school") {
    return (
      <Typography sx={{ p: 4, color: "red" }}>
        Access denied. Please log in as a school user.
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(to right, #0d47a1, #1976d2)",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.5, flex: 1 }}
        >
          🏫 {user.schoolName}
        </Typography>
        <Chip
          label={`District: ${user.district}`}
          size="small"
          sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}
        />
        <Chip
          label={`Sanction: ${user.yearOfSanction}`}
          size="small"
          sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}
        />
        <Chip
          label={user.schoolCode}
          size="small"
          sx={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
        />
      </Box>

      <EMRSForm schoolInfo={user} />
    </Box>
  );
};

export default SchoolEMRSWrapper;
