import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  BugReport as BugIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const ReduxDevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authState = useSelector((state) => state.auth);

  // Calculate last saved time when auth state changes
  const lastSaved = React.useMemo(() => {
    if (authState.user || authState.token) {
      return new Date().toLocaleTimeString();
    }
    return null;
  }, [authState.user, authState.token]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Check if data exists in localStorage
  const hasPersistedData = () => {
    try {
      const data = localStorage.getItem('persist:auth');
      return data && JSON.parse(data).user !== 'null';
    } catch {
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        width: 400,
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          backgroundColor: '#1e1e1e',
          color: '#fff',
          borderRadius: 2,
          border: '1px solid #333',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: '#2d2d2d',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugIcon sx={{ color: '#4caf50' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Redux DevTools
            </Typography>
            <Chip
              label="Ctrl+H"
              size="small"
              sx={{
                backgroundColor: '#4caf50',
                color: '#fff',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          </Box>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: '#fff', '&:hover': { backgroundColor: '#444' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: '#444' }} />

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {/* Persistence Status */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#252525', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <StorageIcon sx={{ color: '#4caf50', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                Persistence Status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={hasPersistedData() ? 'Active' : 'Inactive'}
                size="small"
                sx={{
                  backgroundColor: hasPersistedData() ? '#4caf50' : '#666',
                  color: '#fff',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
              {lastSaved && (
                <Typography variant="caption" sx={{ color: '#ccc' }}>
                  Last saved: {lastSaved}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Auth state persists across browser sessions
            </Typography>
          </Box>

          <Accordion
            sx={{
              backgroundColor: '#2d2d2d',
              color: '#fff',
              '&:before': { display: 'none' },
              mb: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{
                '&:hover': { backgroundColor: '#333' },
                minHeight: 48,
              }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>Auth State</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#252525', p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  <strong>Token:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#1a1a1a',
                    p: 1,
                    borderRadius: 1,
                    wordBreak: 'break-all',
                    color: authState.token ? '#4caf50' : '#f44336',
                  }}
                >
                  {authState.token ? `${authState.token.substring(0, 20)}...` : 'null'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  <strong>User:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#1a1a1a',
                    p: 1,
                    borderRadius: 1,
                    color: authState.user ? '#4caf50' : '#f44336',
                  }}
                >
                  {authState.user ? JSON.stringify(authState.user, null, 2) : 'null'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                  <strong>Loading:</strong>{' '}
                  <Chip
                    label={authState.isLoading ? 'true' : 'false'}
                    size="small"
                    sx={{
                      backgroundColor: authState.isLoading ? '#ff9800' : '#4caf50',
                      color: '#fff',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Typography>
              </Box>

              {authState.error && (
                <Box>
                  <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                    <strong>Error:</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      backgroundColor: '#1a1a1a',
                      p: 1,
                      borderRadius: 1,
                      color: '#f44336',
                    }}
                  >
                    {authState.error}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Typography variant="caption" sx={{ color: '#888', display: 'block', textAlign: 'center', mt: 2 }}>
            Press Ctrl+H to toggle • Check browser DevTools Redux tab for full features
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReduxDevTools;