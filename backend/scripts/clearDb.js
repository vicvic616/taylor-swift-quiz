import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Song from '../models/Song.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taylor-swift-quiz';

async function clearDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Song.deleteMany({});
    console.log('Cleared songs collection');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearDatabase(); 