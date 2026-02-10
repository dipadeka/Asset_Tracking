import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper
} from '@mui/material';

// -------------------- Forgot Password Page --------------------
export default function ForgotPasswordPage() {
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
            <Link component={RouterLink} to="/signin" underline="hover" color="#4ea8ff">
              Back to sign in
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}