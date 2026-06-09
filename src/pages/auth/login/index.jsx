// src/pages/auth/login/index.jsx
// ─────────────────────────────────────────────────────────────
//  EMRS Portal Login page for school and admin users.
//  Route: /emrs/login
//
//  After login:
//    role = "school" → /dashboard/emrs  (SchoolEMRSWrapper)
//    role = "admin"  → /dashboard/admin (EMRSAdminDashboard)
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
    await new Promise((r) => setTimeout(r, 500));
    const result = login(form.username.trim(), form.password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/emrs");
      }
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1976d2 70%, #42a5f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, "&:hover": { color: "#fff" } }}
        >
          Back to Portal
        </Button>
      </Box>

      <Card
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 4,
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #0d47a1, #1976d2)",
            py: 4,
            px: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <SchoolIcon sx={{ fontSize: 38, color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, letterSpacing: 0.5 }}>
            EMRS Portal
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
            Eklavya Model Residential School — Assam
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mt: 0.5 }}>
            Ministry of Tribal Affairs · NESTS
          </Typography>
        </Box>

        <CardContent sx={{ px: 4, py: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#1a237e", mb: 3, textAlign: "center" }}
          >
            Sign in with your school account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              size="small"
              sx={{ mb: 2.5 }}
              placeholder="e.g. emrs_jalah"
              autoComplete="username"
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              size="small"
              sx={{ mb: 1 }}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Box
                sx={{
                  background: "#ffebee",
                  border: "1px solid #ffcdd2",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                  mb: 2,
                  mt: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "#c62828", fontSize: 13 }}>
                  ⚠️ {error}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.3,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 15,
                background: "linear-gradient(to right, #1565c0, #1976d2)",
                boxShadow: "0 4px 15px rgba(25,118,210,0.35)",
                "&:hover": {
                  background: "linear-gradient(to right, #0d47a1, #1565c0)",
                  boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
                },
              }}
              startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : null}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              background: "#f0f4ff",
              border: "1px solid #c5cae9",
              borderRadius: 2,
              p: 1.5,
              mb: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "#3949ab", fontWeight: 600, display: "block", mb: 0.5 }}>
              💡 Login format
            </Typography>
            <Typography variant="caption" sx={{ color: "#5c6bc0" }}>
              School: <strong>emrs_jalah</strong> / <strong>Jalah@2024</strong>
            </Typography>
            <br />
            <Typography variant="caption" sx={{ color: "#5c6bc0" }}>
              Admin: <strong>emrs_admin_assam</strong> / <strong>Admin@EMRS2024</strong>
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{ color: "#90a4ae", textAlign: "center", display: "block", mt: 1 }}
          >
            Government of Assam · Directorate of Tribal Affairs
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EMRSLoginPage;
