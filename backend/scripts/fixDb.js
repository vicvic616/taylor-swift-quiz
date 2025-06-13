import mongoose from 'mongoose';
import Song from '../models/Song.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taylor-swift-quiz';

async function fixDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all songs
    const songs = await Song.find({});
    console.log(`Found ${songs.length} total songs`);

    // Count songs by difficulty
    const difficultyCounts = {
      1: 0,
      2: 0,
      3: 0
    };

    for (const song of songs) {
      if (song.quizLines) {
        song.quizLines.forEach(line => {
          if (line.difficulty) {
            difficultyCounts[line.difficulty] = (difficultyCounts[line.difficulty] || 0) + 1;
          }
        });
      }
    }

    console.log('Current difficulty distribution:');
    console.log(difficultyCounts);

    // If we don't have enough hard questions, let's create some
    if (difficultyCounts[3] < 10) {
      console.log('Adding hard difficulty questions...');
      
      for (const song of songs) {
        if (!song.quizLines || song.quizLines.length === 0) continue;

        // Find complex lines (longer lines with multiple words)
        const complexLines = song.quizLines.filter(line => {
          const words = line.line.split(' ');
          return words.length >= 8 && // Longer lines
                 words.some(word => word.length > 6); // Contains some longer words
        });

        // Convert some complex lines to hard difficulty
        if (complexLines.length > 0) {
          const numToConvert = Math.min(2, complexLines.length); // Convert up to 2 lines per song
          for (let i = 0; i < numToConvert; i++) {
            const lineIndex = song.quizLines.findIndex(l => l.line === complexLines[i].line);
            if (lineIndex !== -1) {
              song.quizLines[lineIndex].difficulty = 3;
            }
          }
          await song.save();
          console.log(`Added hard questions to song: ${song.title}`);
        }
      }

      // Recount after changes
      const newCounts = {
        1: 0,
        2: 0,
        3: 0
      };

      const updatedSongs = await Song.find({});
      for (const song of updatedSongs) {
        if (song.quizLines) {
          song.quizLines.forEach(line => {
            if (line.difficulty) {
              newCounts[line.difficulty] = (newCounts[line.difficulty] || 0) + 1;
            }
          });
        }
      }

      console.log('Updated difficulty distribution:');
      console.log(newCounts);
    }

    console.log('Database check/fix complete');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixDatabase(); 