import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz.js';
import Question from './models/Question.js';
import { questions } from './data/questions.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection and Seeding
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taylor-swift-quiz';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Check if questions exist
    const count = await Question.countDocuments();
    if (count === 0) {
      // If no questions exist, seed the database
      await Question.insertMany(questions);
      console.log('Database seeded with questions');
    } else {
      console.log('Questions already exist in database');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', quizRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Taylor Swift Quiz API is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 