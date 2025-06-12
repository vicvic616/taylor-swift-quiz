import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, LinearProgress } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/questions`);
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers

    setSelectedAnswer(answer);
    if (answer === currentQuestion.missingWord) {
      setScore(score + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        navigate('/result', { 
          state: { 
            score, 
            totalQuestions: questions.length,
            timeInSeconds 
          } 
        });
      }
    }, 2000);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const getLyricDisplay = () => {
    const parts = currentQuestion.lyric.split(currentQuestion.missingWord);
    return (
      <>
        {parts[0]}
        <span style={{ 
          backgroundColor: '#ffeb3b', 
          padding: '0 8px',
          borderRadius: '4px',
          margin: '0 4px'
        }}>
          _____
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>

          <Typography variant="h5" sx={{ mb: 4, fontStyle: 'italic' }}>
            "{getLyricDisplay()}"
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
            Song: {currentQuestion.songTitle}
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {currentQuestion.choices.map((choice, index) => (
              <Button
                key={index}
                variant="outlined"
                color={
                  showResult
                    ? choice === currentQuestion.missingWord
                      ? 'success'
                      : selectedAnswer === choice
                      ? 'error'
                      : 'primary'
                    : 'primary'
                }
                onClick={() => handleAnswerClick(choice)}
                disabled={selectedAnswer !== null}
                sx={{
                  py: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                {choice}
              </Button>
            ))}
          </Box>

          {showResult && (
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 3, 
                textAlign: 'center',
                color: selectedAnswer === currentQuestion.missingWord ? 'success.main' : 'error.main'
              }}
            >
              {selectedAnswer === currentQuestion.missingWord 
                ? '✨ Correct! You\'re a true Swiftie! ✨' 
                : `Wrong! The correct answer was "${currentQuestion.missingWord}"`}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Quiz; 