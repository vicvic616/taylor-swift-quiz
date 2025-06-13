import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, LinearProgress } from '@mui/material';
import axios from 'axios';

// Use localhost for development, fall back to production URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('Using API URL:', API_URL); // Debug log

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const difficulty = location.state?.difficulty || '2'; // Default to normal if no difficulty set

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions from:', `${API_URL}/api/quiz/questions?difficulty=${difficulty}`); // Debug log
        const response = await axios.get(`${API_URL}/api/quiz/questions`, {
          params: { 
            difficulty: difficulty,
            count: '10'
          }
        });
        console.log('Questions received:', response.data); // Debug log
        if (!Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('No questions available for this difficulty level');
        }
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [difficulty]);

  // Show error state
  if (error) {
    return (
      <Container>
        <Box sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Error loading questions: {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.missingWord;
    setShowResult(true);
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(score + 1);
      }
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        navigate('/result', { 
          state: { 
            score: isCorrect ? score + 1 : score, 
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
    if (!currentQuestion) return '';
    return currentQuestion.lyric.replace('_____', '_____');
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
            Song: {currentQuestion.song} from {currentQuestion.album}
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