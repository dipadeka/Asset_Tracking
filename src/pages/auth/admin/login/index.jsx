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
  Paper
} from '@mui/material';

export default function AdminSignInPage() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {

    try {

      const payload = {
        ...data,
        role: 1
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      );

      if (response.data.success) {

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/dashboard/new");
        }, 900);

      }

    } catch (error) {

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error");
      }

    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#0b1220',
            color: '#fff'
          }}
        >

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Admin Sign in
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL */}

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              placeholder="your@email.com"
              variant="outlined"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{ style: { color: '#9aa4bf' } }}
              InputProps={{ style: { color: '#fff' } }}
            />

            {/* PASSWORD */}

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Minimum 5 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ style: { color: '#9aa4bf' } }}
              InputProps={{ style: { color: '#fff' } }}
            />

            <FormControlLabel
              control={<Checkbox sx={{ color: '#9aa4bf' }} />}
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                mb: 1,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Sign in
            </Button>

            <Box textAlign="center" mb={2}>
              <Link component={RouterLink} to="/forgot-password" underline="hover" color="#9aa4bf">
                Forgot your password?
              </Link>
            </Box>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}