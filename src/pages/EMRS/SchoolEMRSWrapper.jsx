// src/pages/EMRS/SchoolEMRSWrapper.jsx
// ─────────────────────────────────────────────────────────────
//  This replaces the route component for /dashboard/emrs
//  It reads the logged-in school from AuthContext and
//  pre-fills + locks school identity fields in EMRSForm.
//
//  WHAT CHANGES vs. your current EMRSForm:
//   1. School name banner shown at top (cannot be changed)
//   2. schoolname, district, block, village, state are
//      pre-filled via React Hook Form's defaultValues
//   3. Submit saves to localStorage keyed by schoolCode
// ─────────────────────────────────────────────────────────────
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import EMRSForm from "./EMRSForm"; // your existing EMRSForm

const SchoolEMRSWrapper = () => {
  const { user } = useAuth();

  // Defensive fallback – should never trigger given ProtectedRoute guards
  if (!user || user.role !== "school") {
    return (
      <Typography sx={{ p: 4, color: "red" }}>
        Access denied. Please log in as a school user.
      </Typography>
    );
  }

  // We pass schoolInfo as a prop so EMRSForm can use it
  const handleAddSubmittedForm = (form) => {
    try {
      const key = `emrs_submitted_forms_${user.schoolCode}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const idx = existing.findIndex(
        (f) => String(f.EMRScode) === String(form.EMRScode)
      );
      if (idx !== -1) existing[idx] = form;
      else existing.push(form);
      localStorage.setItem(key, JSON.stringify(existing));

      // Also write to the shared "all schools" key so admin can read it
      const allKey = "emrs_submitted_forms";
      const allExisting = JSON.parse(localStorage.getItem(allKey) || "[]");
      const allIdx = allExisting.findIndex(
        (f) => String(f.EMRScode) === String(form.EMRScode)
      );
      if (allIdx !== -1) allExisting[allIdx] = form;
      else allExisting.push(form);
      localStorage.setItem(allKey, JSON.stringify(allExisting));

      window.dispatchEvent(new CustomEvent("emrs-form-submitted"));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  return (
    <Box>
      {/* ── School Identity Banner ── */}
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

      {/* ── Existing EMRSForm with schoolInfo injected ── */}
      <EMRSForm
        addSubmittedForm={handleAddSubmittedForm}
        schoolInfo={user} // ← NEW PROP (see EMRSForm changes below)
      />
    </Box>
  );
};

export default SchoolEMRSWrapper;