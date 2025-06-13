import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/leaderboard`);
      setScores(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading scores:', error);
      setIsLoading(false);
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case '1': return 'Easy';
      case '2': return 'Normal';
      case '3': return 'Hard';
      default: return 'Mixed';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '1': return 'text-green-500';
      case '2': return 'text-yellow-500';
      case '3': return 'text-red-500';
      default: return 'text-purple-500';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Leaderboard</h1>
        <p className="text-gray-600 text-center mb-6">Top Swiftie Scores</p>

        <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scores.map((score, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score.playerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(score.timeInSeconds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getDifficultyColor(score.difficulty)}`}>
                      {getDifficultyLabel(score.difficulty)}
                    </span>
                  </td>
                </tr>
              ))}
              {scores.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No scores yet. Be the first to play!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 