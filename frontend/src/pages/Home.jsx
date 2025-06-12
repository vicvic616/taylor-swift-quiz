import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';

function Home() {
  const navigate = useNavigate();

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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/quiz')}
              sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
            >
              Start Quiz
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/leaderboard')}
              sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
            >
              Leaderboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 