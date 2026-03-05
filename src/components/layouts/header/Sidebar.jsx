import React, { useState } from "react";
import { Box, Button, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openScheme, setOpenScheme] = useState(false);

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 3,
      }}
    >
      {/* 🔹 TOP SECTION */}
      <Box>
        <Typography variant="h6" mb={3} fontWeight={600}>
          Asset Portal
        </Typography>

        {/* New Application */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => navigate("/dashboard/new")}
        >
          New Application
        </Button>

        {/* Already Applied */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#fff", mb: 2 }}
          onClick={() => navigate("/dashboard/applied")}
        >
          Already Applied
        </Button>

        {/* 🔹 Scheme Parent */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#fff", mb: 1 }}
          onClick={() => setOpenScheme(!openScheme)}
        >
          Scheme {openScheme ? <ExpandLess /> : <ExpandMore />}
        </Button>

        {/* 🔹 Scheme Children */}
        <Collapse in={openScheme}>
          <Button
            fullWidth
            variant="text"
            sx={{ color: "#fff", pl: 4 }}
            onClick={() => navigate("/dashboard/emrs")}
          >
            EMRS
          </Button>
        </Collapse>
      </Box>

      {/* 🔹 LOGOUT */}
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