import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { score, totalQuestions, timeInSeconds } = location.state || {
    score: 0,
    totalQuestions: 10,
    timeInSeconds: 0
  };

  const handleSubmit = async () => {
    if (!playerName.trim()) return;

    try {
      await axios.post(`${API_URL}/api/quiz/scores`, {
        playerName: playerName.trim(),
        score,
        timeInSeconds
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            Quiz Complete!
          </Typography>

          <Typography variant="h5" sx={{ my: 3 }}>
            Your Score: {score}/{totalQuestions}
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Time: {formatTime(timeInSeconds)}
          </Typography>

          {!submitted ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Enter your name"
                variant="outlined"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!playerName.trim()}
                sx={{ mb: 2 }}
              >
                Submit to Leaderboard
              </Button>
            </Box>
          ) : (
            <Typography variant="h6" color="success.main" sx={{ mb: 3 }}>
              Score submitted successfully!
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Result; 