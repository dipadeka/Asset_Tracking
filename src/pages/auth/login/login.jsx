import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { loginUser } from '../../../redux/slices/authSlice';

import {
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConstructionIcon from '@mui/icons-material/Construction';

/* ─── keyframes injected once ─── */
const keyframeStyles = `
  @keyframes floatA {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(18px, -22px) scale(1.04); }
    66%       { transform: translate(-12px, 14px) scale(0.97); }
  }
  @keyframes floatB {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-20px, 16px) scale(1.06); }
    70%       { transform: translate(14px, -10px) scale(0.96); }
  }
  @keyframes floatC {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(10px, 20px) scale(1.03); }
  }
  @keyframes dashMove {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: -200; }
  }
  @keyframes pulseRing {
    0%, 100% { opacity: 0.18; transform: scale(1); }
    50%       { opacity: 0.06; transform: scale(1.18); }
  }
  @keyframes shimmerBar {
    0%   { transform: translateX(-100%) rotate(-25deg); }
    100% { transform: translateX(320%) rotate(-25deg); }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('asset-login-kf')) {
  const s = document.createElement('style');
  s.id = 'asset-login-kf';
  s.textContent = keyframeStyles;
  document.head.appendChild(s);
}

/* ─── SVG mesh lines (static, rendered once) ─── */
function MeshLines() {
  return (
    <Box component="svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(167,243,208,0.22)" />
          <stop offset="100%" stopColor="rgba(167,243,208,0)" />
        </linearGradient>
      </defs>
      {/* diagonal grid */}
      {[...Array(9)].map((_, i) => (
        <line key={`d${i}`}
          x1={i * 180 - 100} y1="0" x2={i * 180 + 700} y2="900"
          stroke="rgba(167,243,208,0.07)" strokeWidth="1"
          strokeDasharray="6 14"
          style={{ animation: `dashMove ${14 + i * 1.4}s linear infinite` }}
        />
      ))}
      {/* horizontal lines */}
      {[120, 280, 440, 600, 760].map((y, i) => (
        <line key={`h${i}`}
          x1="0" y1={y} x2="1440" y2={y}
          stroke="rgba(167,243,208,0.05)" strokeWidth="1"
          strokeDasharray="4 20"
          style={{ animation: `dashMove ${20 + i * 2}s linear infinite` }}
        />
      ))}
      {/* triangle accent top-left */}
      <polygon points="0,0 340,0 0,260"
        fill="rgba(4,120,87,0.28)" />
      {/* triangle accent bottom-right */}
      <polygon points="1440,900 1100,900 1440,640"
        fill="rgba(5,150,105,0.2)" />
      {/* corner diamond */}
      <rect x="1320" y="30" width="60" height="60" rx="6"
        fill="none" stroke="rgba(167,243,208,0.18)" strokeWidth="1.5"
        transform="rotate(45 1350 60)" />
      <rect x="60" y="820" width="44" height="44" rx="4"
        fill="none" stroke="rgba(167,243,208,0.14)" strokeWidth="1"
        transform="rotate(45 82 842)" />
    </Box>
  );
}

export default function AssetSignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = { ...data, role: 1 };
    const resultAction = await dispatch(loginUser(payload));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      setTimeout(() => navigate('/asset/dashboard/new'), 900);
    } else if (loginUser.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      /* rich multi-stop background */
      background: `
        linear-gradient(135deg,
          #022c22 0%,
          #064e3b 22%,
          #065f46 45%,
          #047857 68%,
          #065f46 82%,
          #022c22 100%
        )
      `,
      position: 'relative',
      overflow: 'hidden',
      p: 2,
    }}>

      {/* ── floating orbs ── */}
      {/* orb 1 — large, top-left */}
      <Box sx={{
        position: 'absolute', top: '-120px', left: '-80px',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(6,78,59,0.08) 55%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'floatA 13s ease-in-out infinite',
      }} />
      {/* orb 2 — medium, bottom-right */}
      <Box sx={{
        position: 'absolute', bottom: '-100px', right: '-60px',
        width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,150,105,0.2) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'floatB 17s ease-in-out infinite',
      }} />
      {/* orb 3 — small accent, top-right */}
      <Box sx={{
        position: 'absolute', top: '8%', right: '6%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,243,208,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'floatC 10s ease-in-out infinite',
      }} />
      {/* orb 4 — small accent, bottom-left */}
      <Box sx={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'floatA 15s ease-in-out infinite reverse',
      }} />

      {/* ── pulsing ring behind card ── */}
      <Box sx={{
        position: 'absolute',
        width: 560, height: 560, borderRadius: '50%',
        border: '1px solid rgba(167,243,208,0.14)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'pulseRing 6s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute',
        width: 680, height: 680, borderRadius: '50%',
        border: '1px solid rgba(167,243,208,0.07)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'pulseRing 6s ease-in-out infinite 1.5s',
      }} />

      {/* ── SVG mesh lines ── */}
      <MeshLines />

      {/* ── dot grid ── */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── vignette overlay ── */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(2,44,34,0.55) 100%)',
      }} />

      {/* Back to portal link */}
      <Box sx={{
        position: 'absolute', top: 20, left: 24,
        display: 'flex', alignItems: 'center', gap: 0.8,
        cursor: 'pointer',
        color: 'rgba(167,243,208,0.75)',
        fontSize: '13px', fontWeight: 600,
        letterSpacing: '0.5px',
        textDecoration: 'none',
        transition: 'color 0.2s',
        '&:hover': { color: '#a7f3d0' },
        zIndex: 10,
      }}
        component={RouterLink} to="/"
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        BACK TO PORTAL
      </Box>

      {/* ── Card ── */}
      <Box sx={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '20px',
        boxShadow: `
          0 32px 80px rgba(0,0,0,0.35),
          0 0 0 1px rgba(255,255,255,0.12),
          0 0 60px rgba(16,185,129,0.12)
        `,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
        /* subtle shimmer sweep on hover */
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
          animation: 'shimmerBar 4s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}>

        {/* Green header band */}
        <Box sx={{
          background: 'linear-gradient(135deg, #022c22 0%, #065f46 45%, #059669 100%)',
          px: 4, pt: 3.5, pb: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          /* inner highlight strip */
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(167,243,208,0.4), transparent)',
          },
        }}>
          {/* Icon circle */}
          <Box sx={{
            width: 72, height: 72, borderRadius: '50%',
            border: '2px solid rgba(167,243,208,0.4)',
            background: 'rgba(167,243,208,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 1.5,
            boxShadow: '0 0 24px rgba(16,185,129,0.3)',
          }}>
            <ConstructionIcon sx={{ fontSize: 34, color: 'rgba(255,255,255,0.92)' }} />
          </Box>

          <Typography sx={{
            color: '#ffffff', fontWeight: 800, fontSize: '20px',
            letterSpacing: '0.5px', fontFamily: '"Georgia", serif',
          }}>
            Asset Management Portal
          </Typography>
          <Typography sx={{ color: 'rgba(167,243,208,0.85)', fontSize: '13px', mt: 0.3, textAlign: 'center' }}>
            Infrastructure & Asset Tracking — Assam
          </Typography>
          <Typography sx={{ color: 'rgba(167,243,208,0.5)', fontSize: '11.5px', mt: 0.3 }}>
            Directorate of Tribal Affairs
          </Typography>
        </Box>

        {/* Form body */}
        <Box sx={{ px: 4, pt: 3, pb: 3.5, position: 'relative', zIndex: 1 }}>
          <Typography sx={{
            textAlign: 'center', fontWeight: 700, fontSize: '15px',
            color: '#065f46', mb: 2.5,
          }}>
            Sign in with your asset account
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              placeholder="name@assam.gov.in"
              variant="outlined"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#059669' },
                  '&.Mui-focused fieldset': { borderColor: '#065f46', borderWidth: '2px' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#065f46' },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 5, message: 'Minimum 5 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#9ca3af' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#059669' },
                  '&.Mui-focused fieldset': { borderColor: '#065f46', borderWidth: '2px' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#065f46' },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />

            {/* Forgot password */}
            <Box sx={{ textAlign: 'right', mt: 0.5, mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" underline="hover"
                sx={{ color: '#059669', fontSize: '12.5px', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.4,
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '1.5px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #022c22 0%, #065f46 50%, #059669 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(5,150,105,0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #014737, #065f46)',
                  boxShadow: '0 6px 28px rgba(5,150,105,0.6)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
                mb: 0.5,
              }}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>

            {/* Login format hint box */}
            <Box sx={{
              mt: 2.5,
              border: '1px solid #d1fae5',
              borderRadius: '10px',
              p: '12px 16px',
              background: '#f0fdf4',
            }}>
              <Typography sx={{ color: '#065f46', fontSize: '12.5px', fontWeight: 700, mb: 0.5 }}>
                💡 Login format
              </Typography>
              <Typography sx={{ color: '#047857', fontSize: '12px' }}>
                Official: <Box component="span" sx={{ fontWeight: 700 }}>name@assam.gov.in</Box>
              </Typography>
              <Typography sx={{ color: '#047857', fontSize: '12px' }}>
                Password: Your assigned credential
              </Typography>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: '#e5e7eb' }} />

            {/* Footer links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#6b7280', fontSize: '12.5px', mb: 0.5 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup" underline="hover"
                  sx={{ color: '#059669', fontWeight: 600 }}>
                  Request Access
                </Link>
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '12.5px' }}>
                EMRS School Login?{' '}
                <Link component={RouterLink} to="/emrs/login" underline="hover"
                  sx={{ color: '#2563eb', fontWeight: 600 }}>
                  Go to EMRS Portal →
                </Link>
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>

      {/* Bottom attribution */}
      <Typography sx={{
        color: 'rgba(167,243,208,0.3)', fontSize: '11px',
        mt: 3, textAlign: 'center', zIndex: 5, position: 'relative',
      }}>
        Government of Assam · Directorate of Tribal Affairs (Plain)<br />
        Designed & Developed by IntelliSight Consulting Pvt. Ltd.
      </Typography>

    </Box>
  );
}