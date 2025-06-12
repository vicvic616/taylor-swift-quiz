import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  lyric: {
    type: String,
    required: true
  },
  missingWord: {
    type: String,
    required: true
  },
  choices: [{
    type: String,
    required: true
  }],
  songTitle: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  }
});

export default mongoose.model('Question', questionSchema); 