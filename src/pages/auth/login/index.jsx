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
import HomeIcon from "@mui/icons-material/Home";

/* ══════════════════════════════════════════════════════
   HOMEPAGE-MATCHING BACKGROUND
   Sandy parchment base with subtle dark-brown geometric
   pattern — mirrors the homepage's texture exactly.
══════════════════════════════════════════════════════ */
const HomepageBg = () => (
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
    {/* Base — sandy parchment matching homepage */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #e8d9b0 0%, #dcc990 35%, #d4bc7a 65%, #dcc990 100%)",
      }}
    />

    {/* Geometric pattern — matching homepage's subtle diamond grid */}
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, opacity: 0.12 }}
    >
      <defs>
        <pattern
          id="homepage-geo"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Diamond outline — same as homepage */}
          <polygon
            points="30,8 52,30 30,52 8,30"
            fill="none"
            stroke="#5a3200"
            strokeWidth="1"
          />
          {/* Inner diamond dot */}
          <polygon
            points="30,24 36,30 30,36 24,30"
            fill="none"
            stroke="#5a3200"
            strokeWidth="0.7"
          />
          {/* Centre dot */}
          <circle cx="30" cy="30" r="1.5" fill="#5a3200" />
          {/* Corner connectors */}
          <line x1="0" y1="0" x2="8" y2="0" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="0" x2="52" y2="0" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="0" x2="60" y2="8" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="60" x2="8" y2="60" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="60" x2="0" y2="52" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="60" x2="52" y2="60" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="60" x2="60" y2="52" stroke="#5a3200" strokeWidth="0.5" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#homepage-geo)" />
    </svg>

    {/* Centre vignette so card area is slightly lighter */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 65% 60% at center, rgba(240,225,185,0.5) 0%, transparent 100%)",
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
      {/* ══ TOP HEADER BAR — matches homepage navbar style ══ */}
      <Box
        sx={{
          background: "#3d1a00",
          borderBottom: "3px solid #c9a84c",
          px: { xs: 2, md: 4 },
          py: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 60,
          flexShrink: 0,
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo + Title — same pattern as homepage navbar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              background: "rgba(201,168,76,0.2)",
              border: "1.5px solid #c9a84c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ fontSize: 22, color: "#f5d97a" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#f5d97a",
                fontWeight: 800,
                fontSize: { xs: 11, md: 13 },
                lineHeight: 1,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Assam
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: 13, md: 15 },
                lineHeight: 1.2,
              }}
            >
              EMRS Management System
            </Typography>
          </Box>
        </Box>

        {/* Nav links — same as homepage */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 3 } }}>
          {["Home", "About", "Gallery"].map((item) => (
            <Typography
              key={item}
              component={Link}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                display: { xs: "none", md: "block" },
                "&:hover": { color: "#f5d97a" },
                transition: "color 0.15s ease",
              }}
            >
              {item}
            </Typography>
          ))}
          <Box
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: "6px",
              border: "1.5px solid #c9a84c",
              background: "rgba(201,168,76,0.15)",
            }}
          >
            <Typography sx={{ color: "#f5d97a", fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>
              EMRS LOGIN
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
        <HomepageBg />

        {/* ── Login Card — earthy brown palette matching homepage ── */}
        <Card
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 440,
            borderRadius: "16px",
            background: "#fdf6e3",
            border: "2px solid #c9a84c",
            boxShadow:
              "0 10px 48px rgba(90,50,0,0.22), 0 2px 8px rgba(180,130,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Card header — dark brown matching homepage's navbar/section headers */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #3d1a00 0%, #5a2800 60%, #3d1a00 100%)",
              py: 3.5,
              px: 3,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              borderBottom: "2.5px solid #c9a84c",
            }}
          >
            {/* Decorative diamond motifs — matching homepage's ornamental divider */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                display: "flex",
                gap: 0.5,
                opacity: 0.35,
              }}
            >
              {[12, 18, 12].map((s, i) => (
                <Box
                  key={i}
                  sx={{
                    width: s,
                    height: s,
                    background: "#c9a84c",
                    transform: "rotate(45deg)",
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                display: "flex",
                gap: 0.5,
                opacity: 0.35,
              }}
            >
              {[12, 18, 12].map((s, i) => (
                <Box
                  key={i}
                  sx={{
                    width: s,
                    height: s,
                    background: "#c9a84c",
                    transform: "rotate(45deg)",
                  }}
                />
              ))}
            </Box>

            {/* Icon circle */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(201,168,76,0.15)",
                border: "2.5px solid #c9a84c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 0 24px rgba(201,168,76,0.25)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 36, color: "#f5d97a" }} />
            </Box>

            <Typography
              sx={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.3 }}
            >
              Welcome to the
            </Typography>
            <Typography
              sx={{ color: "#f5d97a", fontWeight: 700, fontSize: 14, mt: 0.5 }}
            >
              Eklavya Model Residential School
            </Typography>
          </Box>

          {/* Form body */}
          <CardContent sx={{ px: 3.5, pt: 3, pb: 3 }}>

            {/* Back to Homepage link */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 2.5,
                pb: 2,
                borderBottom: "1px dashed #c9a84c",
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
                  "&:hover": { color: "#3d1a00" },
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
                    style={{ accentColor: "#5a2800", cursor: "pointer" }}
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
                    "&:hover": { color: "#3d1a00" },
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

              {/* Login button — earthy brown matching homepage's "Access EMRS Portal" button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.4,
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  background: loading
                    ? "#8a6040"
                    : "linear-gradient(90deg, #5a2800 0%, #7a3c00 50%, #5a2800 100%)",
                  color: "#f5d97a",
                  border: "1.5px solid #c9a84c",
                  boxShadow: loading ? "none" : "0 4px 18px rgba(90,40,0,0.4)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #3d1a00 0%, #5a2800 100%)",
                    boxShadow: "0 6px 24px rgba(90,40,0,0.5)",
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

            {/* Ornamental divider — matches homepage's ◆ · ◆ · ◆ divider */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                my: 2.5,
              }}
            >
              <Box sx={{ flex: 1, height: "1px", background: "#c9a84c", opacity: 0.5 }} />
              <Box sx={{ display: "flex", gap: 0.6, alignItems: "center" }}>
                {[6, 9, 6].map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: s,
                      height: s,
                      background: "#c9a84c",
                      transform: "rotate(45deg)",
                      opacity: i === 1 ? 1 : 0.6,
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ flex: 1, height: "1px", background: "#c9a84c", opacity: 0.5 }} />
            </Box>

            {/* Login hint box */}
            <Box
              sx={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid #c9a84c",
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
                    borderBottom: i < 1 ? "1px solid rgba(201,168,76,0.4)" : "none",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: 11 }}>
                    {row.label}:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5a2800",
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
                color: "#8a6010",
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

      {/* ══ FOOTER — matching homepage footer ══ */}
      <Box
        sx={{
          background: "#3d1a00",
          py: 1.2,
          px: 3,
          textAlign: "center",
          borderTop: "2px solid #c9a84c",
        }}
      >
        <Typography sx={{ color: "rgba(245,217,122,0.75)", fontSize: 11, fontWeight: 500 }}>
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
  color: "#3d1a00",
  mb: 0.6,
  display: "block",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#1e293b",
    background: "#fff",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#c9a84c" },
    "&:hover fieldset": { borderColor: "#8a6010" },
    "&.Mui-focused fieldset": { borderColor: "#5a2800", borderWidth: "1.5px" },
  },
  "& input": {
    color: "#1e293b",
    fontSize: 14,
    "&::placeholder": { color: "#9ca3af", opacity: 1 },
  },
};

export default EMRSLoginPage;