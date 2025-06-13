import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Debug() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing connection to:', `${API_URL}/api/quiz/test`);
      const response = await axios.get(`${API_URL}/api/quiz/test`);
      console.log('Response:', response.data);
      setTestResult(response.data);
    } catch (err) {
      console.error('Connection test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom color="primary">
            API Connection Debug
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Current API URL: {API_URL}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={testConnection}
            disabled={loading}
            sx={{ mb: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Test Connection'}
          </Button>

          {error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error">
                Error: {error}
              </Typography>
            </Box>
          )}

          {testResult && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="h6" color="success.dark">
                Connection Successful!
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Message: {testResult.message}
              </Typography>
              <Typography variant="body2">
                Timestamp: {testResult.timestamp}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Debug; 