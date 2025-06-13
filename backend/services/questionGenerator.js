import Song from '../models/Song.js';

class QuestionGenerator {
  constructor() {
    this.difficultyWeights = {
      1: 0.5,  // Easy questions are more likely
      2: 0.3,  // Medium questions have medium probability
      3: 0.2   // Hard questions are less likely
    };
  }

  // Helper to shuffle array
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Helper to get a random item from an array
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Helper to check if a word is good for quiz
  isGoodWord(word) {
    if (!word) return false;
    
    // Clean the word
    word = word.trim().toLowerCase();
    
    // Minimum length check
    if (word.length < 3) return false;
    
    // Skip common words
    const commonWords = new Set([
      'the', 'and', 'but', 'for', 'you', 'she', 'him', 'her', 'they',
      'was', 'were', 'are', 'will', 'have', 'had', 'has', 'not', 'with',
      'this', 'that', 'what', 'when', 'where', 'who', 'why', 'how'
    ]);
    
    if (commonWords.has(word)) return false;
    
    return true;
  }

  // Helper to find words to remove based on difficulty
  findWordsToRemove(line, difficulty) {
    const words = line.split(' ');
    const goodWords = words.filter(word => this.isGoodWord(word));
    
    if (goodWords.length === 0) {
      return [words[Math.floor(words.length / 2)]];
    }
    
    // For hard mode (difficulty 3), remove two consecutive words
    if (difficulty === 3) {
      for (let i = 0; i < words.length - 1; i++) {
        if (this.isGoodWord(words[i]) && this.isGoodWord(words[i + 1])) {
          return [words[i], words[i + 1]];
        }
      }
      // Fallback to first two good words if no consecutive ones found
      return goodWords.slice(0, 2);
    }
    
    // For easy/medium mode, remove one word
    return [this.getRandomItem(goodWords)];
  }

  // Generate wrong choices that make sense
  async generateChoices(correctWords, songTitle, difficulty) {
    const isHardMode = difficulty === 3;
    const correctAnswer = isHardMode ? correctWords.join(', ') : correctWords[0];
    const choices = new Set([correctAnswer]);
    
    // Get words from other songs
    const songs = await Song.find({ title: { $ne: songTitle } });
    const potentialWords = [];
    
    // Extract potential words from all songs
    songs.forEach(song => {
      if (song.quizLines) {
        song.quizLines.forEach(quizLine => {
          const words = quizLine.line.split(' ');
          if (isHardMode) {
            // For hard mode, get pairs of words
            for (let i = 0; i < words.length - 1; i++) {
              if (this.isGoodWord(words[i]) && this.isGoodWord(words[i + 1])) {
                potentialWords.push(`${words[i]}, ${words[i + 1]}`);
              }
            }
          } else {
            // For easy/medium mode, get single words
            words.forEach(word => {
              if (this.isGoodWord(word)) {
                potentialWords.push(word);
              }
            });
          }
        });
      }
    });

    // If we don't have enough potential words, add some defaults
    if (potentialWords.length < 3) {
      if (isHardMode) {
        potentialWords.push(...[
          'heart, soul',
          'love, hate',
          'day, night',
          'sun, moon',
          'life, death',
          'dream, reality'
        ]);
      } else {
        potentialWords.push(...[
          'heart',
          'love',
          'dream',
          'life',
          'soul',
          'mind'
        ]);
      }
    }

    // Shuffle and select random wrong answers
    this.shuffleArray(potentialWords);
    for (const word of potentialWords) {
      if (choices.size >= 4) break;
      if (word !== correctAnswer) {
        choices.add(word);
      }
    }

    return this.shuffleArray([...choices]);
  }

  // Generate a single question
  async generateQuestion(difficulty = 2) {
    try {
      // Ensure difficulty is a valid number between 1 and 3
      difficulty = Number(difficulty);
      if (isNaN(difficulty) || difficulty < 1 || difficulty > 3) {
        console.warn(`Invalid difficulty ${difficulty}, defaulting to 2`);
        difficulty = 2;
      }

      // Get songs with the specified difficulty
      const songs = await Song.find({
        'quizLines.difficulty': difficulty
      });

      if (!songs || songs.length === 0) {
        throw new Error(`No songs found with difficulty ${difficulty}`);
      }

      // Select a random song
      const song = this.getRandomItem(songs);
      
      // Get valid quiz lines for the selected difficulty
      const validLines = song.quizLines.filter(line => line.difficulty === difficulty);

      if (validLines.length === 0) {
        throw new Error(`No valid lines found for difficulty ${difficulty} in song ${song.title}`);
      }

      const quizLine = this.getRandomItem(validLines);
      const wordsToRemove = this.findWordsToRemove(quizLine.line, difficulty);
      
      // Generate choices including the correct word(s)
      const choices = await this.generateChoices(wordsToRemove, song.title, difficulty);

      // Create the question text with blank(s)
      let questionText = quizLine.line;
      wordsToRemove.forEach(word => {
        questionText = questionText.replace(word, '_____');
      });

      return {
        lyric: questionText,
        missingWord: difficulty === 3 ? wordsToRemove.join(', ') : wordsToRemove[0],
        choices,
        songTitle: song.title,
        album: song.album,
        difficulty
      };
    } catch (error) {
      console.error('Error generating question:', error);
      throw error;
    }
  }

  // Generate multiple questions
  async generateQuestions(count = 10) {
    const questions = [];
    for (let i = 0; i < count; i++) {
      const question = await this.generateQuestion();
      questions.push(question);
    }
    return questions;
  }
}

export default QuestionGenerator; 