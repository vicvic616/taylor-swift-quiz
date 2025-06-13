import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Leaderboard from './components/Leaderboard';
import Debug from './pages/Debug';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff69b4', // Pink color for Taylor Swift theme
    },
    secondary: {
      main: '#9c27b0', // Purple as secondary color
    },
    background: {
      default: '#fdf2f8', // Light pink background
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 