import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

function Home() {
  const navigate = useNavigate();

  const startQuiz = (difficulty) => {
    navigate('/quiz', { state: { difficulty } });
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
          textAlign: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Taylor Swift Lyrics Quiz
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            Test your Swiftie knowledge! Complete the lyrics from Taylor's songs.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => startQuiz('1')}
              sx={{ fontSize: '1.2rem', py: 1.5 }}
            >
              Easy Quiz - The BF or Dad Mode
            </Button>
            
            <Button
              variant="contained"
              color="warning"
              size="large"
              onClick={() => startQuiz('2')}
              sx={{ fontSize: '1.2rem', py: 1.5 }}
            >
              Normal Quiz - Casual Listener Mode
            </Button>
            
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => startQuiz('3')}
              sx={{ fontSize: '1.2rem', py: 1.5 }}
            >
              Hard Quiz - Legendary Swiftie Mode
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/leaderboard')}
            sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
          >
            View Leaderboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 