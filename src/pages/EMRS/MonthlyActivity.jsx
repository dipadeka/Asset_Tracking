// src/pages/EMRS/MonthlyActivity.jsx
import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Attendance from "./Steps/Attendance";
import OperationalCost from "./Steps/OperationalCost";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthlyActivity = () => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Monthly Activity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage Attendance and Operational Cost records here.
      </Typography>

      <Box sx={{ mb: 4 }}>
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
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <OperationalCost
          operationalCostRows={operationalCostRows}
          setOperationalCostRows={setOperationalCostRows}
        />
      </Box>
    </Box>
  );
};

export default MonthlyActivity;