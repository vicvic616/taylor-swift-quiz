import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/quiz/leaderboard`);
        setScores(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
            🏆 Swiftie Leaderboard 🏆
          </Typography>

          <TableContainer sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Time</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                  </TableRow>
                ) : scores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No scores yet. Be the first!</TableCell>
                  </TableRow>
                ) : (
                  scores.map((score, index) => (
                    <TableRow
                      key={score._id}
                      sx={{
                        backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'inherit',
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{score.playerName}</TableCell>
                      <TableCell align="center">{score.score}</TableCell>
                      <TableCell align="center">{formatTime(score.timeInSeconds)}</TableCell>
                      <TableCell align="right">
                        {new Date(score.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/quiz')}
            >
              Play Again
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

export default Leaderboard; 