import React, { useState } from "react";
import { Box, Button, Typography, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore, Logout, School, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const EMRSSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [openScheme, setOpenScheme] = useState(false);
  const [openApplied, setOpenApplied] = useState(false);

  const logoutUser = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/emrs/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0f172a,#1e293b)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* TOP SECTION */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
          EMRS Portal
        </Typography>

        <List>
          {/* Schemes */}
          <ListItemButton
            onClick={() => setOpenScheme(!openScheme)}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <School />
            </ListItemIcon>
            <ListItemText primary="Schemes" />
            {openScheme ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Schemes Children */}
          <Collapse in={openScheme}>
            <List component="div" disablePadding>
              <ListItemButton
                selected={isActive("/emrs/dashboard")}
                onClick={() => navigate("/emrs/dashboard")}
                sx={{
                  pl: 6,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#2563eb",
                  },
                  "&:hover": { background: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemText sx={{ pl: 3 }} primary="EMRS" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Already Applied */}
          <ListItemButton
            onClick={() => setOpenApplied(!openApplied)}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <CheckCircle />
            </ListItemIcon>
            <ListItemText primary="Already Applied" />
            {openApplied ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Already Applied Children */}
          <Collapse in={openApplied}>
            <List component="div" disablePadding>
              <ListItemButton
                selected={isActive("/emrs/submitted")}
                onClick={() => navigate("/emrs/submitted")}
                sx={{
                  pl: 6,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#2563eb",
                  },
                  "&:hover": { background: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemText sx={{ pl: 3 }} primary="EMRS" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* LOGOUT */}
      <Button
        variant="contained"
        color="error"
        startIcon={<Logout />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
        }}
        onClick={logoutUser}
      >
        Logout
      </Button>
    </Box>
  );
};

export default EMRSSidebar;
