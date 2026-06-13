import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import EMRSSidebar from "../../components/layouts/header/EMRSSidebar";
import Topbar from "../../components/layouts/header/Topbar";

const EMRSDashboard = () => {
  return (
    <Box sx={{ display: "flex", p: 0, m: 0 }}>
      <EMRSSidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ padding: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default EMRSDashboard;
