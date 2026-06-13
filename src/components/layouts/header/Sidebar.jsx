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
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [openScheme, setOpenScheme] = useState(false);
  const [openApplied, setOpenApplied] = useState(false);

  const logoutUser = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/asset/login", { replace: true });
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
            selected={isActive("/asset/dashboard/new")}
            onClick={() => navigate("/asset/dashboard/new")}
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

          {/* Already Applied */}
          <ListItemButton
            selected={isActive("/asset/dashboard/applied/assets")}
            onClick={() => navigate("/asset/dashboard/applied/assets")}
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
              <CheckCircle />
            </ListItemIcon>
            <ListItemText primary="Submitted Applications" />
          </ListItemButton>
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
