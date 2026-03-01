import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
      }}
    >
      {/* Top Menu */}
      <Box>
        <Typography variant="h6" mb={3}>
          Asset Portal
        </Typography>

        {/* ✅ NEW APPLICATION */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => navigate("/dashboard/new")}
        >
          New Application
        </Button>

        {/* ✅ ALREADY APPLIED */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#fff" }}
          onClick={() => navigate("/dashboard/applied")}
        >
          Already Applied
        </Button>
      </Box>

      {/* ✅ LOGOUT */}
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={logoutUser}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;