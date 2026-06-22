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
import HomeIcon from "@mui/icons-material/Home";

/* ══════════════════════════════════════════════════════
   ASSAM GEOMETRIC BACKGROUND
   Inspired by Assamese Gamosa / Mekhela Chador textile
   patterns — simple intersecting grid with diamond nodes,
   very light so the gold card pops cleanly over it.
══════════════════════════════════════════════════════ */
const AssamGeoBg = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  >
    {/* Base — warm golden parchment */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(150deg, #f7e8a0 0%, #f0d96a 40%, #eace50 70%, #f2db78 100%)",
      }}
    />

    {/* Gamosa-inspired geometric grid — very faint */}
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, opacity: 0.09 }}
    >
      <defs>
        <pattern
          id="assam-geo"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Horizontal grid line */}
          <line x1="0" y1="40" x2="80" y2="40" stroke="#5a3200" strokeWidth="0.8" />
          {/* Vertical grid line */}
          <line x1="40" y1="0" x2="40" y2="80" stroke="#5a3200" strokeWidth="0.8" />

          {/* Diamond node at each intersection */}
          <polygon points="40,33 47,40 40,47 33,40" fill="none" stroke="#5a3200" strokeWidth="1" />

          {/* Tiny filled square at centre of diamond */}
          <rect x="38" y="38" width="4" height="4" fill="#5a3200" opacity="0.6" transform="rotate(45 40 40)" />

          {/* Corner quarter-diamond motifs — Gamosa border echo */}
          <polygon points="0,0 8,0 0,8"   fill="none" stroke="#5a3200" strokeWidth="0.8" />
          <polygon points="80,0 72,0 80,8" fill="none" stroke="#5a3200" strokeWidth="0.8" />
          <polygon points="0,80 8,80 0,72" fill="none" stroke="#5a3200" strokeWidth="0.8" />
          <polygon points="80,80 72,80 80,72" fill="none" stroke="#5a3200" strokeWidth="0.8" />

          {/* Subtle diagonal cross inside each cell quadrant */}
          <line x1="0"  y1="0"  x2="40" y2="40" stroke="#5a3200" strokeWidth="0.4" opacity="0.5" />
          <line x1="80" y1="0"  x2="40" y2="40" stroke="#5a3200" strokeWidth="0.4" opacity="0.5" />
          <line x1="0"  y1="80" x2="40" y2="40" stroke="#5a3200" strokeWidth="0.4" opacity="0.5" />
          <line x1="80" y1="80" x2="40" y2="40" stroke="#5a3200" strokeWidth="0.4" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#assam-geo)" />
    </svg>

    {/* Soft centre glow so card area feels lighter */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 60% 55% at center, rgba(255,248,200,0.55) 0%, transparent 100%)",
      }}
    />
  </Box>
);

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
      if (result.user.role === "admin") navigate("/emrs/admin");
      else navigate("/emrs/dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      {/* ══ TOP HEADER BAR ══ */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #3b0f6e 0%, #4a1f8a 50%, #5c1a9e 100%)",
          borderBottom: "3px solid #c9a84c",
          px: { xs: 2, md: 4 },
          py: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56,
          flexShrink: 0,
          boxShadow: "0 2px 14px rgba(0,0,0,0.35)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(201,168,76,0.2)",
              border: "1.5px solid #c9a84c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ fontSize: 20, color: "#f5d97a" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: { xs: 13, md: 15 },
                lineHeight: 1.1,
                letterSpacing: 0.3,
              }}
            >
              Eklavya Model Residential School Portal — Assam
            </Typography>
            <Typography
              sx={{
                color: "#c9a84c",
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Directorate of Tribal Affairs · Government of Assam
            </Typography>
          </Box>
        </Box>

        
      </Box>

      
      {/* ══ MAIN CONTENT ══ */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: { xs: 4, md: 6 },
        }}
      >
        <AssamGeoBg />

        {/* Login Card */}
        <Card
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 440,
            borderRadius: "18px",
            background: "#fff",
            border: "2px solid #c9a84c",
            boxShadow:
              "0 8px 40px rgba(59,15,110,0.18), 0 2px 10px rgba(180,130,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Card header — deep purple + gold */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, #2d0a5e 0%, #3b0f6e 50%, #4a1f8a 100%)",
              py: 3.5,
              px: 3,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              borderBottom: "2px solid #c9a84c",
            }}
          >
            <Box
              sx={{
                position: "absolute", top: -40, right: -40,
                width: 120, height: 120, borderRadius: "50%",
                border: "1.5px solid rgba(201,168,76,0.2)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute", bottom: -25, left: -25,
                width: 90, height: 90, borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.15)",
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(201,168,76,0.15)",
                border: "2.5px solid #c9a84c",
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 2,
                boxShadow: "0 0 20px rgba(201,168,76,0.3)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 36, color: "#f5d97a" }} />
            </Box>

            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.3 }}>
              Welcome to the
            </Typography>
            <Typography sx={{ color: "#f5d97a", fontWeight: 700, fontSize: 14, mt: 0.4 }}>
              Eklavya Model Residential School
            </Typography>
          </Box>

          {/* Form body */}
          <CardContent sx={{ px: 3.5, pt: 3, pb: 3 }}>

            {/* ── Back to Homepage hyperlink ── */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 2.5,
                pb: 2,
                borderBottom: "1px dashed #e8d48a",
              }}
            >
              <HomeIcon sx={{ fontSize: 14, color: "#5a3200" }} />
              <Typography
                component={Link}
                to="/"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#5a3200",
                  textDecoration: "underline",
                  textDecorationColor: "#c9a84c",
                  textUnderlineOffset: "3px",
                  letterSpacing: 0.2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#3b0f6e",
                    textDecorationColor: "#3b0f6e",
                  },
                  transition: "color 0.15s ease",
                }}
              >
                ← Back to Homepage
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Typography sx={labelSx}>Username</Typography>
              <TextField
                fullWidth
                name="username"
                value={form.username}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2, ...fieldSx }}
                placeholder="e.g. emrs_jalah"
                autoComplete="username"
                autoFocus
              />

              <Typography sx={labelSx}>Password</Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                size="small"
                sx={{ mb: 0.5, ...fieldSx }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: "#9ca3af" }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember me + Forgot */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  mt: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <input
                    type="checkbox"
                    id="remember"
                    style={{ accentColor: "#3b0f6e", cursor: "pointer" }}
                  />
                  <Typography
                    component="label"
                    htmlFor="remember"
                    sx={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}
                  >
                    Remember Me
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#5a3200",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 12,
                    textDecoration: "underline",
                    textDecorationColor: "#c9a84c",
                    textUnderlineOffset: "2px",
                    "&:hover": { color: "#3b0f6e" },
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>

              {error && (
                <Box
                  sx={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    px: 1.5,
                    py: 1,
                    mb: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#dc2626", fontSize: 12 }}>
                    ⚠️ {error}
                  </Typography>
                </Box>
              )}

              {/* Login button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.3,
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  background: loading
                    ? "#7c5faa"
                    : "linear-gradient(90deg, #2d0a5e 0%, #4a1f8a 100%)",
                  color: "#f5d97a",
                  border: "1.5px solid #c9a84c",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(59,15,110,0.4)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1e0640 0%, #3b0f6e 100%)",
                    boxShadow: "0 6px 22px rgba(59,15,110,0.5)",
                    color: "#fff",
                  },
                  "&:disabled": { color: "rgba(245,217,122,0.6)" },
                  transition: "all 0.2s ease",
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} sx={{ color: "#f5d97a" }} />
                  ) : null
                }
              >
                {loading ? "Signing in…" : "Login"}
              </Button>
            </form>

            <Divider
              sx={{
                my: 2.5,
                "&::before, &::after": { borderColor: "#e8d48a" },
                color: "#8a6010",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Login Format
            </Divider>

            {/* Login hint box */}
            <Box
              sx={{
                background: "#fffbea",
                border: "1px solid #d4a830",
                borderRadius: "10px",
                p: 1.8,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#5a3200",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 1,
                  fontSize: 12,
                }}
              >
                💡 Login Format
              </Typography>
              {[
                { label: "School", value: "emrs_jalah / Jalah@2024" },
                { label: "Admin", value: "emrs_admin_assam / Admin@EMRS2024" },
              ].map((row, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.6,
                    borderBottom: i < 1 ? "1px solid #e8d48a" : "none",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: 11 }}>
                    {row.label}:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#3b0f6e",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "#a07820",
                textAlign: "center",
                display: "block",
                mt: 2,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              🇮🇳 Government of Assam · Directorate of Tribal Affairs (Plain)
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* ══ FOOTER ══ */}
      <Box
        sx={{
          background: "#2d0a5e",
          py: 1.2,
          px: 3,
          textAlign: "center",
          borderTop: "2px solid #c9a84c",
        }}
      >
        <Typography sx={{ color: "rgba(245,217,122,0.7)", fontSize: 11, fontWeight: 500 }}>
          © 2025 EMRS Assam · National Education Society for Tribal Students (NESTS) ·
          Ministry of Tribal Affairs · Government of India
        </Typography>
      </Box>
    </Box>
  );
};

/* ── Shared styles ── */
const labelSx = {
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
  mb: 0.6,
  display: "block",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#1e293b",
    background: "#fafafa",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#d4c070" },
    "&:hover fieldset": { borderColor: "#c9a84c" },
    "&.Mui-focused fieldset": { borderColor: "#3b0f6e", borderWidth: "1.5px" },
  },
  "& input": {
    color: "#1e293b",
    fontSize: 14,
    "&::placeholder": { color: "#9ca3af", opacity: 1 },
  },
};

export default EMRSLoginPage;