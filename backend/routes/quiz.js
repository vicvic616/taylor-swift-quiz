import express from 'express';
import Question from '../models/Question.js';
import Score from '../models/Score.js';

const router = express.Router();

// Get quiz questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit score
router.post('/scores', async (req, res) => {
  const { playerName, score, timeInSeconds } = req.body;
  
  try {
    const newScore = new Score({
      playerName,
      score,
      timeInSeconds
    });
    
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1, timeInSeconds: 1 })
      .limit(10);
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 