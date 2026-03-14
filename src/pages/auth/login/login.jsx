import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';

import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function SignInPage() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role: 1 };
      const response = await axios.post("http://localhost:5000/api/auth/login", payload);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(response.data.message);
        setTimeout(() => navigate("/dashboard/new"), 900);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error");
      }
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '10px',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(212,175,55,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#d4af37', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': { color: '#8a95b0' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
    '& .MuiFormHelperText-root': { color: '#f87171' },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #060d1f 0%, #0d1b3e 50%, #0a1628 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* background elements */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(212,175,55,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(78,168,255,0.06) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/*  grid lines */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      {/* Left branding panel - hidden on small screens */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        borderRight: '1px solid rgba(212,175,55,0.15)',
        position: 'relative',
      }}>
        <Box sx={{
          width: 80, height: 80,
          background: 'linear-gradient(135deg, #d4af37, #f0c040)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 3,
          boxShadow: '0 8px 32px rgba(212,175,55,0.3)',
        }}>
          <AccountBalanceIcon sx={{ fontSize: 42, color: '#0a1628' }} />
        </Box>

        <Typography sx={{
          fontSize: '13px', fontWeight: 700, letterSpacing: '4px',
          color: '#d4af37', mb: 1, textTransform: 'uppercase'
        }}>
          ASSAM EMRS
        </Typography>

        <Typography sx={{
          fontSize: '28px', fontWeight: 800, color: '#ffffff',
          textAlign: 'center', lineHeight: 1.3, mb: 2,
          fontFamily: '"Georgia", serif',
        }}>
          EMRS & Asset<br />Management System
        </Typography>

        <Typography sx={{
          color: '#5a6a8a', fontSize: '14px', textAlign: 'center',
          maxWidth: 300, lineHeight: 1.7
        }}>
          A unified digital platform for managing Eklavya Model Residential Schools and Government Assets
        </Typography>

        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
          {[
            { label: 'Directorate of Tribal Affairs', sub: 'Government of Assam' },
            { label: 'Digital India Initiative', sub: 'Empowering Tribal Education' },
            { label: 'Secure & Transparent', sub: 'Data-driven Governance' },
          ].map((item, i) => (
            <Box key={i} sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
              p: 1.5, border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#d4af37', flexShrink: 0,
                boxShadow: '0 0 8px rgba(212,175,55,0.6)'
              }} />
              <Box>
                <Typography sx={{ color: '#c8d0e0', fontSize: '13px', fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ color: '#5a6a8a', fontSize: '11px' }}>
                  {item.sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right login panel */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 460px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center', gap: 2, mb: 4
          }}>
            <Box sx={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #d4af37, #f0c040)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AccountBalanceIcon sx={{ fontSize: 24, color: '#0a1628' }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#d4af37', fontSize: '10px', fontWeight: 700, letterSpacing: '2px' }}>
                ASSAM EMRS
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                Asset Management System
              </Typography>
            </Box>
          </Box>

          {/* Top accent line */}
          <Box sx={{
            height: 3,
            background: 'linear-gradient(90deg, #d4af37, #4ea8ff, transparent)',
            borderRadius: '2px', mb: 4
          }} />

          <Typography sx={{
            fontSize: '26px', fontWeight: 800, color: '#ffffff', mb: 0.5,
            fontFamily: '"Georgia", serif',
          }}>
            Welcome Back
          </Typography>
          <Typography sx={{ color: '#5a6a8a', fontSize: '14px', mb: 4 }}>
            Sign in to your EMRS account
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>

            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              placeholder="your@email.com"
              variant="outlined"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                style: { color: '#fff' },
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#5a6a8a', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 5, message: "Minimum 5 characters" }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                style: { color: '#fff' },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#5a6a8a', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#5a6a8a' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    sx={{
                      color: '#3a4a6a',
                      '&.Mui-checked': { color: '#d4af37' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#8a95b0', fontSize: '13px' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link component={RouterLink} to="/forgot-password" underline="hover"
                sx={{ color: '#4ea8ff', fontSize: '13px' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.4,
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '1px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d4af37, #e8c547)',
                color: '#0a1628',
                boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c49e2a, #d4af37)',
                  boxShadow: '0 6px 28px rgba(212,175,55,0.5)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
                mb: 2.5,
              }}
            >
              SIGN IN
            </Button>

            <Divider sx={{
              mb: 2.5,
              '&::before, &::after': { borderColor: 'rgba(255,255,255,0.08)' },
              color: '#5a6a8a', fontSize: '12px'
            }}>
              or continue with
            </Divider>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon sx={{ fontSize: '18px !important' }} />}
                sx={{
                  color: '#c8d0e0', borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px', py: 1.1, fontSize: '13px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon sx={{ fontSize: '18px !important' }} />}
                sx={{
                  color: '#c8d0e0', borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px', py: 1.1, fontSize: '13px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                  },
                }}
              >
                Facebook
              </Button>
            </Box>

            <Box sx={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', p: 2, textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#5a6a8a', fontSize: '13px', mb: 0.5 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup" underline="hover"
                  sx={{ color: '#4ea8ff', fontWeight: 600 }}>
                  Sign up
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ color: '#5a6a8a', fontSize: '13px' }}>
                Admin access?{' '}
                <Link component={RouterLink} to="/admin/signin" underline="hover"
                  sx={{ color: '#d4af37', fontWeight: 600 }}>
                  Login here
                </Link>
              </Typography>
            </Box>

          </Box>

          <Typography sx={{
            textAlign: 'center', color: '#2a3553', fontSize: '11px', mt: 3
          }}>
            Government of Assam · Directorate of Tribal Affairs (Plain)
          </Typography>

          <Typography sx={{
            textAlign: 'center', color: '#2a3553', fontSize: '11px', mt: 0.5
          }}>
            Designed and Developed by{' '}
            <Box component="span" sx={{ color: '#3a4a6a', fontWeight: 600 }}>
              IntelliSight Consulting Private Limited
            </Box>
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}
