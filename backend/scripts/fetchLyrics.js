import dotenv from 'dotenv';
import mongoose from 'mongoose';
import LyricsFetcher from '../services/lyricsFetcher.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taylor-swift-quiz';

async function fetchLyrics() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const lyricsFetcher = new LyricsFetcher();
    await lyricsFetcher.fetchSongList();

    console.log('Finished fetching lyrics');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fetchLyrics(); 