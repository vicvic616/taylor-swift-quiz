import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timeInSeconds: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Score', scoreSchema); 