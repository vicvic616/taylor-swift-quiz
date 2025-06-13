import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: Number,
  lyric: String,
  missingWord: String,
  choices: [String],
  songTitle: String,
  album: String,
  difficulty: Number
});

export default mongoose.model('Question', questionSchema); 