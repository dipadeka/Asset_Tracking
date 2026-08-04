import React from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Logout,
  Assignment,
  CheckCircle,
  EventNote, // icon for Monthly Activity
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

/* ─────────────────────────────────────────────────────────────────────────────
   TRIBAL DESIGN TOKENS — same palette + type scale as MonthlyActivity.jsx /
   Attendance.jsx, so the sidebar reads as part of the same product.
───────────────────────────────────────────────────────────────────────────── */
const PAL = {
  sand: "#F4E9D7",
  sandDark: "#EADCC0",
  clay: "#B4451F",
  clayDark: "#8C3416",
  ochre: "#DDA23A",
  ochreLight: "#EFC777",
  brown: "#5B3A24",
  brownDark: "#3A2415",
  cream: "#FBF4E8",
  ink: "#2E1D10",
};

const FONT_DISPLAY = "'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

/** Small carved diamond, used as a bullet / decorative accent. */
const DiamondBullet = ({ size = 9, color = PAL.ochre }) => (
  <Box
    aria-hidden
    sx={{
      width: size,
      height: size,
      bgcolor: color,
      transform: "rotate(45deg)",
      flexShrink: 0,
      borderRadius: "2px",
      boxShadow: `0 0 0 2px ${PAL.brownDark}`,
    }}
  />
);

/** Thin woven zig-zag divider, matching the rest of the app. */
const ZigZagDivider = ({ color = PAL.ochre, height = 8 }) => (
  <Box
    aria-hidden
    sx={{
      width: "100%",
      height,
      backgroundImage: `linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%), linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(315deg, ${color} 25%, transparent 25%)`,
      backgroundPosition: `${height}px 0, ${height}px 0, 0 0, 0 0`,
      backgroundSize: `${height * 2}px ${height * 2}px`,
      backgroundRepeat: "repeat-x",
      opacity: 0.85,
    }}
  />
);

const NAV_ITEMS = [
  { path: "/asset/dashboard/new", label: "New Application", icon: Assignment },
  { path: "/asset/dashboard/applied/assets", label: "Submitted Applications", icon: CheckCircle },
  { path: "/asset/dashboard/monthly-activity", label: "Monthly Activity", icon: EventNote },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
        background: `linear-gradient(180deg, ${PAL.brownDark}, ${PAL.brown})`,
        color: PAL.cream,
        display: "flex",
        flexDirection: "column",
        p: 2,
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset -1px 0 0 rgba(221,162,58,0.25)",
      }}
    >
      {/* Faint carved diamond-lattice texture in the background */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(45deg, ${PAL.ochre} 25%, transparent 25%), linear-gradient(-45deg, ${PAL.ochre} 25%, transparent 25%)`,
          backgroundSize: "26px 26px",
        }}
      />

      {/* TOP SECTION */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
          <DiamondBullet />
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.6,
              color: PAL.ochreLight,
              textAlign: "center",
            }}
          >
            Asset Portal
          </Typography>
          <DiamondBullet />
        </Box>

        <Box sx={{ mb: 2.5, px: 1 }}>
          <ZigZagDivider />
        </Box>

        <List sx={{ px: 0.5 }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <ListItemButton
                key={path}
                selected={active}
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  mb: 1.25,
                  py: 1,
                  border: `1px solid ${active ? PAL.ochre : "rgba(221,162,58,0.18)"}`,
                  background: active
                    ? `linear-gradient(135deg, ${PAL.clay}, ${PAL.clayDark})`
                    : "rgba(251,244,232,0.03)",
                  boxShadow: active ? "0 3px 0 rgba(58,36,21,0.45)" : "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    background: active
                      ? `linear-gradient(135deg, ${PAL.clay}, ${PAL.clayDark})`
                      : "rgba(221,162,58,0.12)",
                    border: `1px solid ${PAL.ochre}`,
                    transform: "translateX(2px)",
                  },
                  "&.Mui-selected": {
                    "&:hover": {
                      background: `linear-gradient(135deg, ${PAL.clay}, ${PAL.clayDark})`,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: active ? PAL.ochreLight : PAL.ochre, minWidth: 38 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: FONT_BODY,
                      fontWeight: active ? 700 : 500,
                      fontSize: 13.5,
                      color: active ? PAL.cream : "rgba(251,244,232,0.85)",
                      letterSpacing: 0.2,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Spacer pushes logout to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ px: 1, mb: 2 }}>
          <ZigZagDivider />
        </Box>

        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={logoutUser}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.3,
            color: PAL.cream,
            py: 1,
            background: `linear-gradient(135deg, ${PAL.clay}, ${PAL.clayDark})`,
            border: `1.5px solid ${PAL.ochre}`,
            boxShadow: "0 3px 0 rgba(58,36,21,0.5)",
            "&:hover": {
              background: `linear-gradient(135deg, ${PAL.clayDark}, ${PAL.clayDark})`,
              boxShadow: "0 2px 0 rgba(58,36,21,0.5)",
              transform: "translateY(1px)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;