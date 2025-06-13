import express from 'express';
import { generateQuestions } from '../utils/questionGenerator.js';
import Score from '../models/Score.js';

const router = express.Router();

// Helper function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Test backend connection
router.get('/test', (req, res) => {
  res.json({ message: 'Backend connection successful!' });
});

// Get quiz questions
router.get('/questions', async (req, res) => {
  try {
    console.log('Received request for questions with query:', req.query);
    
    const difficulty = parseInt(req.query.difficulty) || 1;
    const count = 10; // Always get 10 questions
    
    console.log('Parsed difficulty:', difficulty, 'count:', count);
    
    // Generate fresh questions for this request
    const questions = await generateQuestions(difficulty, count);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(404).json({ 
        message: `No questions available for difficulty level ${difficulty}` 
      });
    }
    
    console.log('Generated', questions.length, 'questions');
    res.json(questions);
    
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ message: error.message || 'Error generating questions' });
  }
});

// Submit score
router.post('/scores', async (req, res) => {
  try {
    const { name, score, difficulty, timeInSeconds } = req.body;
    
    // TODO: Implement score submission to database
    
    res.json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Error submitting score' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    // TODO: Implement leaderboard retrieval from database
    
    res.json({ message: 'Leaderboard retrieved successfully' });
  } catch (error) {
    console.error('Error retrieving leaderboard:', error);
    res.status(500).json({ message: 'Error retrieving leaderboard' });
  }
});

export default router; 