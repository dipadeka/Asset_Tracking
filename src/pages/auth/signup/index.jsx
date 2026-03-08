import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  TextField,
  Typography,
  Paper
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function SignUpPage() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {

    try {

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 1
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      if (response.data.success) {

        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/signin");
        }, 500);

      }

    } catch (error) {

      const message =
        error?.response?.data?.message ||
        "Registration failed";

      toast.error(message);

    }

  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#0b1220",
            color: "#fff"
          }}
        >

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Create account
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            {/* NAME */}

            <TextField
              fullWidth
              label="Name"
              margin="normal"
              {...register("name", {
                required: "Name is required"
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputLabelProps={{ style: { color: "#9aa4bf" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            {/* EMAIL */}

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{ style: { color: "#9aa4bf" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            {/* PASSWORD */}

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Minimum 5 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ style: { color: "#9aa4bf" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            {/* CONFIRM PASSWORD */}

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputLabelProps={{ style: { color: "#9aa4bf" } }}
              InputProps={{ style: { color: "#fff" } }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, py: 1.2 }}
            >
              Sign up
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ mb: 1 }}
            >
              Sign up with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="#9aa4bf">
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signin"
                  underline="hover"
                  color="#4ea8ff"
                >
                  Sign in
                </Link>
              </Typography>
            </Box>

          </Box>

        </Paper>
      </Container>
    </Box>
  );
}