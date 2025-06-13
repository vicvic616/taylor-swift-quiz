import { lyricsLibrary } from '../data/lyrics.js';

// Common words to exclude from questions
const commonWords = [
  'the', 'and', 'but', 'for', 'with', 'that', 'this', 'from', 'have',
  'was', 'were', 'are', 'you', 'your', 'they', 'their', 'there', 'here',
  'what', 'when', 'where', 'why', 'how', 'which', 'who', 'whom', 'whose',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might',
  'must', 'into', 'onto', 'upon', 'about', 'around', 'through', 'between',
  'among', 'before', 'after', 'during', 'while', 'until', 'unless', 'since',
  'because', 'although', 'though', 'even', 'if', 'whether', 'either', 'neither',
  'both', 'each', 'every', 'any', 'all', 'some', 'none', 'no', 'yes', 'not'
];

// Helper function to get random words from a string
const getRandomWords = (text, count = 3) => {
  const words = text.split(' ').filter(word => 
    word.length > 3 && // Only words longer than 3 characters
    !word.includes("'") && // No contractions
    !word.includes('"') && // No quotes
    !word.includes('?') && // No question marks
    !word.includes('!') && // No exclamation marks
    !word.includes('.') && // No periods
    !word.includes(',') && // No commas
    !word.includes('(') && // No parentheses
    !word.includes(')') && // No parentheses
    !word.includes('[') && // No brackets
    !word.includes(']') && // No brackets
    !word.includes('{') && // No braces
    !word.includes('}') && // No braces
    !word.includes('-') && // No hyphens
    !word.includes('_') && // No underscores
    !word.includes('&') && // No ampersands
    !word.includes('*') && // No asterisks
    !word.includes('#') && // No hash symbols
    !word.includes('@') && // No at symbols
    !word.includes('$') && // No dollar signs
    !word.includes('%') && // No percent signs
    !word.includes('^') && // No caret symbols
    !word.includes('+') && // No plus signs
    !word.includes('=') && // No equals signs
    !word.includes('|') && // No pipe symbols
    !word.includes('\\') && // No backslashes
    !word.includes('/') && // No forward slashes
    !word.includes('<') && // No less than symbols
    !word.includes('>') && // No greater than symbols
    !word.includes('~') && // No tilde symbols
    !word.includes('`') && // No backticks
    !word.includes(';') && // No semicolons
    !word.includes(':') && // No colons
    !word.includes(' ') // No spaces
  );
  
  if (words.length < count) return [];
  
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random lyrics from a song
const getRandomLyrics = (song, count = 1) => {
  const shuffled = [...song.lyrics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random songs from an album
const getRandomSongs = (album, count = 1) => {
  const songs = lyricsLibrary[album];
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random albums
const getRandomAlbums = (count = 1) => {
  const albums = Object.keys(lyricsLibrary);
  const shuffled = [...albums].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get similar words for choices
function getSimilarWords(lyrics, targetWord) {
  // Split lyrics into words and filter them
  const words = lyrics.split(/\s+/).filter(word => {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
    return cleanWord.length >= 4 && 
           cleanWord !== targetWord && 
           !commonWords.includes(cleanWord);
  });

  // Shuffle the words and return up to 3 similar words
  return shuffleArray([...new Set(words)]).slice(0, 3);
}

// Helper function to check if a question is unique
const isUniqueQuestion = (question, existingQuestions) => {
  return !existingQuestions.some(q => 
    q.lyric === question.lyric || 
    q.missingWord === question.missingWord
  );
};

// Helper function to get random songs based on difficulty
function getRandomSongsByDifficulty(difficulty) {
  const allSongs = [];
  Object.entries(lyricsLibrary).forEach(([album, songs]) => {
    Object.entries(songs).forEach(([title, data]) => {
      allSongs.push({ album, title, ...data });
    });
  });

  // Filter songs based on difficulty
  let filteredSongs;
  switch (difficulty) {
    case 1: // Easy - Most popular songs
      filteredSongs = allSongs.filter(song => song.popularity === 3);
      // If not enough songs, include some popularity 2 songs
      if (filteredSongs.length < 5) {
        filteredSongs = allSongs.filter(song => song.popularity >= 2);
      }
      break;
    case 2: // Normal - Moderately popular songs
      filteredSongs = allSongs.filter(song => song.popularity === 2);
      // If not enough songs, include some popularity 1 or 3 songs
      if (filteredSongs.length < 5) {
        filteredSongs = allSongs.filter(song => song.popularity >= 1);
      }
      break;
    case 3: // Hard - Less popular songs
      filteredSongs = allSongs.filter(song => song.popularity === 1);
      // If not enough songs, include some popularity 2 songs
      if (filteredSongs.length < 5) {
        filteredSongs = allSongs.filter(song => song.popularity <= 2);
      }
      break;
    default:
      filteredSongs = allSongs;
  }

  // If still not enough songs, use all songs
  if (filteredSongs.length < 5) {
    filteredSongs = allSongs;
  }

  return filteredSongs;
}

// Add shuffleArray function at the top level
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Main function to generate questions
export async function generateQuestions(difficulty, count = 10) {
  console.log('Generating questions with difficulty:', difficulty, 'count:', count);
  const questions = [];
  const usedLyrics = new Set();
  let attempts = 0;
  const maxAttempts = 100; // Increased max attempts

  // Filter songs by difficulty
  const filteredSongs = [];
  for (const [album, albumSongs] of Object.entries(lyricsLibrary)) {
    for (const [songTitle, songData] of Object.entries(albumSongs)) {
      // More flexible difficulty matching
      if (difficulty === 1 && songData.popularity === 1) {
        filteredSongs.push({ ...songData, album, title: songTitle });
      } else if (difficulty === 2 && songData.popularity === 2) {
        filteredSongs.push({ ...songData, album, title: songTitle });
      } else if (difficulty === 3 && songData.popularity === 3) {
        filteredSongs.push({ ...songData, album, title: songTitle });
      }
    }
  }

  if (filteredSongs.length === 0) {
    throw new Error(`No songs available for difficulty level ${difficulty}`);
  }

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
    const randomLyric = randomSong.lyrics[Math.floor(Math.random() * randomSong.lyrics.length)];

    // Skip if lyric is too short or already used
    if (randomLyric.split(' ').length < 3 || usedLyrics.has(randomLyric)) {
      continue;
    }

    // Get words that are at least 3 characters long
    const words = randomLyric.split(' ')
      .map(word => word.toLowerCase().replace(/[.,!?]/g, ''))
      .filter(word => word.length >= 3);

    if (words.length < 3) {
      continue;
    }

    const correctWord = words[Math.floor(Math.random() * words.length)];
    const similarWords = words.filter(word => word !== correctWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    if (similarWords.length < 3) {
      continue;
    }

    const question = {
      lyric: randomLyric.replace(new RegExp(correctWord, 'i'), '_____'),
      missingWord: correctWord,
      choices: [...similarWords, correctWord].sort(() => Math.random() - 0.5),
      album: randomSong.album,
      song: randomSong.title
    };

    questions.push(question);
    usedLyrics.add(randomLyric);
  }

  if (questions.length < count) {
    console.log(`Warning: Could only generate ${questions.length} questions after ${attempts} attempts`);
    if (questions.length === 0) {
      throw new Error(`Could not generate any questions for difficulty level ${difficulty}`);
    }
  }

  console.log('Generated', questions.length, 'questions');
  return questions;
} 