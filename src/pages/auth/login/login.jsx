import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider, //-----
  FormControlLabel,
  Link, //<a href
  TextField, // <input
  Typography, //<p
  Paper //<p
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';



  


export default function SignInPage() {
  const navigate = useNavigate();

  const handleLogin = () => {

  // here you can later call backend API also

  localStorage.setItem("token", "dummy_token"); // save login token

  navigate("/amf");   // 🔴 AFTER LOGIN GO TO ASSET FORM
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
      {/* xs, sm, md, lg  */}
      <Container maxWidth="xs"> 
        <Paper
          elevation={6}
          sx={{
            p: 4, //padding and m:1 // margin
            borderRadius: 3,
            backgroundColor: '#0b1220', // bg color
            color: '#fff' // text color
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Sign in
          </Typography>

          <Box component="form" noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              placeholder="your@email.com"
              variant="outlined"
              InputLabelProps={{ style: { color: '#9aa4bf' } }}
              InputProps={{ style: { color: '#fff' } }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              InputLabelProps={{ style: { color: '#9aa4bf' } }}
              InputProps={{ style: { color: '#fff' } }}
            />

            <FormControlLabel
              control={<Checkbox sx={{ color: '#9aa4bf' }} />}
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Button
  fullWidth
  variant="contained"
  onClick={handleLogin}
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

            <Divider sx={{ mb: 2, color: '#9aa4bf' }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ mb: 1, color: '#fff', borderColor: '#2a3553' }}
            >
              Sign in with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ color: '#fff', borderColor: '#2a3553' }}
            >
              Sign in with Facebook
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="#9aa4bf">
                Don’t have an account?{' '}
                <Link component={RouterLink} to="/signup" underline="hover" color="#4ea8ff">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
