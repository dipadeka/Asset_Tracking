import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  Logout,
  Assignment,
  CheckCircle,
  AccountBalance,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openScheme, setOpenScheme] = useState(false);
  const [openApplied, setOpenApplied] = useState(false);

  const logoutUser = () => {
    // remove stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // show message
    toast.success("Logged out successfully");

    // redirect to login page
    navigate("/signin", { replace: true });
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
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Asset Portal
        </Typography>

        <List>
          {/* New Application */}
          <ListItemButton
            selected={isActive("/dashboard/new")}
            onClick={() => navigate("/dashboard/new")}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                background: "#2563eb",
                "&:hover": { background: "#1d4ed8" },
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="New Application" />
          </ListItemButton>

         

          {/* Scheme */}
          <ListItemButton
            onClick={() => setOpenScheme(!openScheme)}
            sx={{
              borderRadius: 2,
              "&:hover": { background: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <AccountBalance />
            </ListItemIcon>

            <ListItemText primary="Scheme" />

            {openScheme ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Scheme Children */}
          <Collapse in={openScheme}>
            <List component="div" disablePadding>
              <ListItemButton
                selected={isActive("/dashboard/emrs")}
                onClick={() => navigate("/dashboard/emrs")}
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
    "&:hover": { background: "rgba(255,255,255,0.08)" },
  }}
>
  <ListItemIcon sx={{ color: "#fff" }}>
    <CheckCircle />
  </ListItemIcon>

  <ListItemText primary="Already Applied" />

  {openApplied ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={openApplied}>
  <List component="div" disablePadding>

    {/* EMRS Applied */}
    <ListItemButton
      selected={isActive("/dashboard/applied/emrs")}
      onClick={() => navigate("/dashboard/applied/emrs")}
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

    {/* Asset Applied */}
    <ListItemButton
      selected={isActive("/dashboard/applied/assets")}
      onClick={() => navigate("/dashboard/applied/assets")}
      sx={{
        pl: 6,
        borderRadius: 2,
        "&.Mui-selected": {
          background: "#2563eb",
        },
        "&:hover": { background: "rgba(255,255,255,0.08)" },
      }}
    >
      <ListItemText sx={{ pl: 3 }} primary="Assets" />
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

export default Sidebar;
