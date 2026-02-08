import * as React from 'react';
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
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

// -------------------- Forgot Password Page --------------------
export function ForgotPasswordPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #0f1b2d, #050a12)'
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: '#0b1220', color: '#fff' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Forgot password
          </Typography>

          <Typography variant="body2" color="#9aa4bf" mb={2}>
            Enter your email and we’ll send you a reset link.
          </Typography>

          <TextField
            fullWidth
            label="Email"
            placeholder="your@email.com"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <Button fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }}>
            Send reset link
          </Button>

          <Box textAlign="center" mt={3}>
            <Link href="#" underline="hover" color="#4ea8ff">
              Back to sign in
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// -------------------- Sign Up Page --------------------
export default function SignUpPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: '#0b1220', color: '#fff' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Create account
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            margin="normal"
            InputLabelProps={{ style: { color: '#9aa4bf' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <Button fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }}>
            Sign up
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} sx={{ mb: 1 }}>
            Sign up with Google
          </Button>

          <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
            Sign up with Facebook
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="#9aa4bf">
              Already have an account?{' '}
              <Link href="#" underline="hover" color="#4ea8ff">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

