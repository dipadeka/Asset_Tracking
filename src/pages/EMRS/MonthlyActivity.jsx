// src/pages/EMRS/MonthlyActivity.jsx
import React, { useState } from "react";
import { Box, Typography, Button, Paper, Step, StepLabel, Stepper, Stack } from "@mui/material";
import toast from "react-hot-toast";
import Attendance, { SakshamSaturdayReport } from "./Steps/Attendance";
import OperationalCost from "./Steps/OperationalCost";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthlyActivity = () => {
  const steps = [
    { label: "Attendance", description: "Fill staff and student attendance details" },
    { label: "Saksham Saturday", description: "Capture planning, reports and outcomes" },
    { label: "Operational Cost", description: "Enter monthly operational expenses" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  // ── Attendance state (previously lived inside EMRSForm.jsx) ──
  const [staffAttendanceRows, setStaffAttendanceRows] = useState([]);
  const [teachingAttMonth, setTeachingAttMonth] = useState(MONTHS[new Date().getMonth()]);
  const [nonTeachingAttMonth, setNonTeachingAttMonth] = useState(MONTHS[new Date().getMonth()]);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [studentAttendanceMonth, setStudentAttendanceMonth] = useState(MONTHS[new Date().getMonth()]);

  // ── Operational Cost state (previously lived inside EMRSForm.jsx) ──
  const [operationalCostRows, setOperationalCostRows] = useState([
    { year: "", month: "", costType: "", amount: "" },
  ]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      toast.success("Monthly activity submitted successfully.");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Attendance
            staffAttendanceRows={staffAttendanceRows}
            setStaffAttendanceRows={setStaffAttendanceRows}
            teachingAttMonth={teachingAttMonth}
            setTeachingAttMonth={setTeachingAttMonth}
            nonTeachingAttMonth={nonTeachingAttMonth}
            setNonTeachingAttMonth={setNonTeachingAttMonth}
            studentAttendanceData={studentAttendanceData}
            setStudentAttendanceData={setStudentAttendanceData}
            studentAttendanceMonth={studentAttendanceMonth}
            setStudentAttendanceMonth={setStudentAttendanceMonth}
            showSakshamSaturday={false}
          />
        );
      case 1:
        return <SakshamSaturdayReport />;
      case 2:
        return (
          <OperationalCost
            operationalCostRows={operationalCostRows}
            setOperationalCostRows={setOperationalCostRows}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Monthly Activity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete the monthly attendance, Saksham Saturday and operational cost details step by step.
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: "1px solid #e2e8f0", background: "#fff" }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            {steps[activeStep].label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {steps[activeStep].description}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

        <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap">
          <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Submit Monthly Activity" : "Next"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MonthlyActivity;