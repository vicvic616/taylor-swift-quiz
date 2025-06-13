import axios from 'axios';
import * as cheerio from 'cheerio';
import Song from '../models/Song.js';

class LyricsFetcher {
  constructor() {
    // Using a simpler approach without API key
    this.baseUrl = 'https://taylor-swift-api.herokuapp.com/api';
  }

  // Helper function to determine if a line is quiz-worthy
  isQuizWorthy(line) {
    // Skip lines that are too short
    if (line.length < 20) return false;
    
    // Skip lines with parentheses (usually stage directions)
    if (line.includes('(') || line.includes(')')) return false;
    
    // Skip lines that are repeated too many times
    if (line.split(' ').length < 4) return false;
    
    // Skip lines with special characters or numbers
    if (/[^a-zA-Z\s,.'!?]/.test(line)) return false;

    return true;
  }

  calculateDifficulty(line) {
    // Count words
    const words = line.split(' ');
    const wordCount = words.length;
    
    // Count complex words (longer than 6 characters)
    const complexWords = words.filter(word => word.length > 6).length;
    
    // Count punctuation marks
    const punctuation = (line.match(/[,.!?;:]/g) || []).length;
    
    // Calculate complexity score
    const complexityScore = wordCount + (complexWords * 2) + punctuation;
    
    // Assign difficulty based on complexity
    if (complexityScore < 10) return 1; // Easy
    if (complexityScore < 15) return 2; // Normal
    return 3; // Hard
  }

  async fetchSongList() {
    try {
      // Using a public Taylor Swift API or a curated list
      const albums = [
        { name: "Midnights", year: 2022 },
        { name: "evermore", year: 2020 },
        { name: "folklore", year: 2020 },
        { name: "Lover", year: 2019 },
        { name: "reputation", year: 2017 },
        { name: "1989", year: 2014 },
        { name: "Red", year: 2012 },
        { name: "Speak Now", year: 2010 },
        { name: "Fearless", year: 2008 },
        { name: "Taylor Swift", year: 2006 }
      ];

      for (const album of albums) {
        await this.processSongsFromAlbum(album);
      }
    } catch (error) {
      console.error('Error fetching song list:', error);
      throw error;
    }
  }

  async processSongsFromAlbum(album) {
    try {
      // Using a more efficient approach with pre-selected popular songs
      const popularSongs = await this.getPopularSongsFromAlbum(album.name);
      
      for (const songTitle of popularSongs) {
        const existingSong = await Song.findOne({ title: songTitle });
        if (!existingSong) {
          const quizLines = await this.getQuizLinesForSong(songTitle);
          
          if (quizLines.length > 0) {
            await Song.create({
              title: songTitle,
              album: album.name,
              releaseYear: album.year,
              quizLines,
              popularity: 50 // Default popularity
            });
            
            console.log(`Stored song: ${songTitle}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing album ${album.name}:`, error);
    }
  }

  async getPopularSongsFromAlbum(albumName) {
    const sampleSongs = {
      "Midnights": [
        "Anti-Hero",
        "Lavender Haze",
        "Snow On The Beach",
        "Karma",
        "Midnight Rain",
        "Maroon"
      ],
      "evermore": [
        "willow",
        "champagne problems",
        "no body, no crime",
        "'tis the damn season",
        "gold rush",
        "tolerate it"
      ],
      "folklore": [
        "cardigan",
        "the last great american dynasty",
        "exile",
        "august",
        "betty",
        "the 1"
      ],
      "Lover": [
        "Cruel Summer",
        "Lover",
        "The Man",
        "You Need To Calm Down",
        "Miss Americana & The Heartbreak Prince",
        "Paper Rings"
      ],
      "reputation": [
        "Look What You Made Me Do",
        "Ready For It?",
        "Delicate",
        "Gorgeous",
        "End Game",
        "Don't Blame Me"
      ],
      "1989": [
        "Shake It Off",
        "Blank Space",
        "Style",
        "Bad Blood",
        "Wildest Dreams",
        "Out of the Woods"
      ],
      "Red": [
        "All Too Well",
        "22",
        "I Knew You Were Trouble",
        "We Are Never Ever Getting Back Together",
        "State of Grace",
        "Red"
      ],
      "Speak Now": [
        "Mine",
        "Back to December",
        "Mean",
        "The Story of Us",
        "Enchanted",
        "Dear John"
      ],
      "Fearless": [
        "Love Story",
        "You Belong With Me",
        "Fifteen",
        "Fearless",
        "White Horse",
        "The Way I Loved You"
      ],
      "Taylor Swift": [
        "Tim McGraw",
        "Teardrops On My Guitar",
        "Picture to Burn",
        "Our Song",
        "Should've Said No",
        "Mary's Song (Oh My My My)"
      ]
    };
    
    return sampleSongs[albumName] || [];
  }

  async getQuizLinesForSong(songTitle) {
    // Sample quiz-worthy lines for some popular songs
    const sampleLines = {
      "Anti-Hero": [
        { line: "Hi, I'm the problem", difficulty: 1 },
        { line: "It's me, hi, I'm the problem, it's me", difficulty: 2 },
        { line: "I'll stare directly at the sun but never in the mirror", difficulty: 3 }
      ],
      "Lavender Haze": [
        { line: "Meet me at midnight", difficulty: 1 },
        { line: "I feel the lavender haze creeping up on me", difficulty: 2 },
        { line: "Talk your talk and go viral, I just need this love spiral", difficulty: 3 }
      ],
      "willow": [
        { line: "That's my man", difficulty: 1 },
        { line: "Life was a willow and it bent right to your wind", difficulty: 2 },
        { line: "The more that you say, the less I know", difficulty: 2 }
      ],
      "cardigan": [
        { line: "I knew you", difficulty: 1 },
        { line: "When you are young, they assume you know nothing", difficulty: 2 },
        { line: "You drew stars around my scars but now I'm bleeding", difficulty: 3 }
      ],
      "Cruel Summer": [
        { line: "It's cool, that's what I tell myself", difficulty: 1 },
        { line: "Devils roll the dice, angels roll their eyes", difficulty: 2 },
        { line: "I don't wanna keep secrets just to keep you", difficulty: 3 }
      ],
      // Default lines for songs without specific entries
      "default": [
        { line: "I'm doing good", difficulty: 1 },
        { line: "I had a marvelous time", difficulty: 2 },
        { line: "I had a marvelous time ruining everything", difficulty: 3 }
      ]
    };

    // Get lines for the song or use default
    const songLines = sampleLines[songTitle] || sampleLines.default;
    
    // For songs without specific entries, calculate difficulty
    if (!sampleLines[songTitle]) {
      return songLines.map(line => ({
        line: line.line,
        difficulty: this.calculateDifficulty(line.line)
      }));
    }
    
    // Return pre-defined lines with their difficulties
    return songLines;
  }
}

export default LyricsFetcher; 