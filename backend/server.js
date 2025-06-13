import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz.js';
import { generateQuestions } from './utils/questionGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taylor-swift-quiz')
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Check if we need to seed the database
    return mongoose.connection.db.collection('questions').countDocuments();
  })
  .then(async (count) => {
    if (count === 0) {
      console.log('Seeding database with questions...');
      
      // Generate questions for each difficulty level
      const easyQuestions = generateQuestions(1, 10);
      const normalQuestions = generateQuestions(2, 10);
      const hardQuestions = generateQuestions(3, 10);
      
      // Combine all questions
      const allQuestions = [...easyQuestions, ...normalQuestions, ...hardQuestions];
      
      // Insert questions into database
      await mongoose.connection.db.collection('questions').insertMany(allQuestions);
      console.log('Database seeded with questions');
    } else {
      console.log('Questions already exist in database');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/quiz', quizRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Taylor Swift Quiz API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 