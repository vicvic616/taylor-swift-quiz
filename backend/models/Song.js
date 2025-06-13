import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  album: {
    type: String,
    required: true
  },
  releaseYear: Number,
  // Store only quiz-worthy lyrics instead of entire songs
  quizLines: [{
    line: {
      type: String,
      required: true
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      default: 2,  // 1-3 scale
      validate: {
        validator: function(v) {
          return Number.isInteger(v) && v >= 1 && v <= 3;
        },
        message: props => `${props.value} is not a valid difficulty level! Must be 1, 2, or 3.`
      }
    }
  }],
  popularity: {
    type: Number,
    default: 50,  // 0-100 scale
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Add index on difficulty for faster querying
songSchema.index({ 'quizLines.difficulty': 1 });

// Pre-save middleware to ensure difficulty is a number
songSchema.pre('save', function(next) {
  if (this.quizLines) {
    this.quizLines.forEach(line => {
      if (line.difficulty) {
        line.difficulty = Number(line.difficulty);
      }
    });
  }
  next();
});

export default mongoose.model('Song', songSchema); 