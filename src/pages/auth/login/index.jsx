// src/pages/auth/login/index.jsx
// ─────────────────────────────────────────────────────────────
//  EMRS Portal Login page — restyled to match Asset portal dark theme
//  Route: /emrs/login
//
//  After login:
//    role = "school" → /emrs/dashboard
//    role = "admin"  → /emrs/admin
// ─────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EMRSLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    const result = await login(form.username.trim(), form.password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/emrs/admin");
      } else {
        navigate("/emrs/dashboard");
      }
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // Dark indigo gradient — mirrors Asset portal's dark green structure
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      {/* ── Geometric diamond decorations (mirrors Asset portal style) ── */}
      {/* Top-right diamonds */}
      <Box sx={{
        position: "absolute", top: -80, right: -80,
        width: 340, height: 340,
        border: "2px solid rgba(99,102,241,0.15)",
        transform: "rotate(45deg)",
        borderRadius: "24px",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", top: -28, right: -28,
        width: 210, height: 210,
        border: "1.5px solid rgba(99,102,241,0.1)",
        transform: "rotate(45deg)",
        borderRadius: "16px",
        pointerEvents: "none",
      }} />

      {/* Bottom-left diamonds */}
      <Box sx={{
        position: "absolute", bottom: -100, left: -100,
        width: 400, height: 400,
        border: "2px solid rgba(139,92,246,0.12)",
        transform: "rotate(45deg)",
        borderRadius: "28px",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: -40, left: -40,
        width: 240, height: 240,
        border: "1.5px solid rgba(139,92,246,0.08)",
        transform: "rotate(45deg)",
        borderRadius: "18px",
        pointerEvents: "none",
      }} />

      {/* Ambient glow blobs */}
      <Box sx={{
        position: "absolute", top: "10%", left: "5%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "15%", right: "8%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Subtle dot grid */}
      <Box sx={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Floating particles */}
      {[
        { top: "18%", left: "12%" },
        { top: "72%", left: "8%" },
        { top: "35%", right: "10%" },
        { top: "60%", right: "15%" },
        { top: "85%", left: "25%" },
        { top: "12%", right: "28%" },
      ].map((pos, i) => (
        <Box key={i} sx={{
          position: "absolute",
          ...pos,
          width: i % 2 === 0 ? 4 : 3,
          height: i % 2 === 0 ? 4 : 3,
          borderRadius: "50%",
          background: "#818cf8",
          opacity: 0.25,
          pointerEvents: "none",
        }} />
      ))}

      {/* ── Back button ── */}
      <Box sx={{ position: "relative", zIndex: 10, p: "20px 28px" }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          sx={{
            color: "rgba(255,255,255,0.65)",
            fontWeight: 600,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            px: 2.2,
            py: 1,
            backdropFilter: "blur(8px)",
            "&:hover": {
              color: "#fff",
              background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.18)",
            },
          }}
        >
          Back to Portal
        </Button>
      </Box>

      {/* ── Centered card ── */}
      <Box sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        pb: 6,
        position: "relative",
        zIndex: 10,
      }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 440,
            borderRadius: "24px",
            // Glassmorphism — same depth as Asset portal card
            background: "rgba(15,23,42,0.72)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(99,102,241,0.22)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          {/* ── Card header ── */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #1e1b4b 100%)",
              py: 4.5,
              px: 4,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              borderBottom: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            {/* Inner header glow */}
            <Box sx={{
              position: "absolute", top: -48, left: "50%",
              transform: "translateX(-50%)",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Small diamond accents in header */}
            <Box sx={{
              position: "absolute", top: -16, right: -16,
              width: 80, height: 80,
              border: "1px solid rgba(129,140,248,0.2)",
              transform: "rotate(45deg)", borderRadius: "8px",
              pointerEvents: "none",
            }} />
            <Box sx={{
              position: "absolute", bottom: -12, left: -12,
              width: 60, height: 60,
              border: "1px solid rgba(129,140,248,0.15)",
              transform: "rotate(45deg)", borderRadius: "6px",
              pointerEvents: "none",
            }} />

            {/* Icon */}
            <Box sx={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(99,102,241,0.28), rgba(139,92,246,0.28))",
              border: "2px solid rgba(129,140,248,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
              position: "relative",
              boxShadow: "0 0 32px rgba(99,102,241,0.3)",
            }}>
              <SchoolIcon sx={{ fontSize: 38, color: "#c7d2fe" }} />
              {/* Outer ring */}
              <Box sx={{
                position: "absolute", inset: -7,
                borderRadius: "50%",
                border: "1px solid rgba(129,140,248,0.2)",
                pointerEvents: "none",
              }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: 800, letterSpacing: 0.3, position: "relative" }}
            >
              EMRS Portal
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(199,210,254,0.85)", mt: 0.6, fontWeight: 500, position: "relative" }}
            >
              Eklavya Model Residential School — Assam
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(165,180,252,0.5)",
                display: "block", mt: 0.5,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontSize: 10,
                position: "relative",
              }}
            >
              Ministry of Tribal Affairs · NESTS
            </Typography>

            {/* Bottom accent line */}
            <Box sx={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: 64, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent)",
            }} />
          </Box>

          {/* ── Form area ── */}
          <CardContent sx={{ px: 4, pt: 4, pb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
                mb: 3,
                textAlign: "center",
                fontSize: 15,
              }}
            >
              Sign in with your school account
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2.5, ...darkFieldSx }}
                placeholder="e.g. emrs_jalah"
                autoComplete="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ fontSize: 16, lineHeight: 1, color: "rgba(165,180,252,0.45)" }}>👤</Box>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                size="small"
                sx={{ mb: 1, ...darkFieldSx }}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ fontSize: 16, lineHeight: 1, color: "rgba(165,180,252,0.45)" }}>🔒</Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: "rgba(165,180,252,0.45)", "&:hover": { color: "#a5b4fc" } }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Forgot password */}
              <Box sx={{ textAlign: "right", mb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(165,180,252,0.55)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                    "&:hover": { color: "#a5b4fc" },
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>

              {/* Error */}
              {error && (
                <Box sx={{
                  background: "rgba(239,68,68,0.09)",
                  border: "1px solid rgba(239,68,68,0.28)",
                  borderRadius: "10px",
                  px: 1.8, py: 1.2, mb: 2,
                  display: "flex", alignItems: "center", gap: 1,
                }}>
                  <Typography variant="body2" sx={{ color: "#fca5a5", fontSize: 13 }}>
                    ⚠️ {error}
                  </Typography>
                </Box>
              )}

              {/* Sign in button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  background: loading
                    ? "rgba(99,102,241,0.35)"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(79,70,229,0.38)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4338ca, #6d28d9)",
                    boxShadow: "0 12px 32px rgba(79,70,229,0.5)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    color: "rgba(255,255,255,0.5)",
                  },
                  transition: "all 0.2s ease",
                }}
                startIcon={loading ? <CircularProgress size={16} sx={{ color: "rgba(255,255,255,0.6)" }} /> : null}
              >
                {loading ? "Signing in…" : "Sign In →"}
              </Button>
            </form>

            {/* Divider */}
            <Divider
              sx={{
                my: 3,
                "&::before, &::after": { borderColor: "rgba(255,255,255,0.06)" },
                color: "rgba(255,255,255,0.2)",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Login Format
            </Divider>

            {/* Login format hint box */}
            <Box sx={{
              background: "rgba(99,102,241,0.07)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: "12px",
              p: 1.8,
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(165,180,252,0.8)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 1,
                }}
              >
                💡 Login Format
              </Typography>
              {[
                { label: "School", value: "emrs_jalah / Jalah@2024" },
                { label: "Admin",  value: "emrs_admin_assam / Admin@EMRS2024" },
              ].map((row, i) => (
                <Box key={i} sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 0.6,
                  borderBottom: i < 1 ? "1px solid rgba(99,102,241,0.1)" : "none",
                }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    {row.label}:
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: "rgba(165,180,252,0.7)",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: 11,
                  }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.18)",
                textAlign: "center",
                display: "block",
                mt: 2.5,
                fontSize: 11,
              }}
            >
              🇮🇳 Government of Assam · Directorate of Tribal Affairs (Plain)
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

// ── Shared dark-field MUI TextField sx override ──────────────
// Matches the Asset portal's dark input style exactly.
const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "rgba(99,102,241,0.22)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(99,102,241,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(99,102,241,0.7)",
    },
    "&.Mui-focused": {
      background: "rgba(99,102,241,0.07)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(165,180,252,0.55)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#a5b4fc",
  },
  "& input::placeholder": {
    color: "rgba(255,255,255,0.18)",
    opacity: 1,
  },
  "& input": {
    color: "#e2e8f0",
    fontSize: 14,
  },
};

export default EMRSLoginPage;