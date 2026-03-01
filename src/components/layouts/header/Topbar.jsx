import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Topbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6">
          Asset Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;