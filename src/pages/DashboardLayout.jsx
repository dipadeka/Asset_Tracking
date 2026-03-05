import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/layouts/header/Sidebar";
import Topbar from "../components/layouts/header/Topbar";


const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", p:0, m:0}}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ padding: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;