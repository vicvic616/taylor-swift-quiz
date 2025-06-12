# Taylor Swift Lyrics Quiz

A full-stack web application that tests your knowledge of Taylor Swift lyrics! Built with React, Node.js, Express, and MongoDB.

## Features

- Multiple choice quiz with Taylor Swift lyrics
- Score tracking and timing
- Leaderboard with top scores
- Modern, responsive UI
- MongoDB integration for persistent storage

## Tech Stack

- **Frontend**: React, Material-UI, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your frontend URL

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Add environment variable:
   - `VITE_API_URL`: Your backend URL

## License

MIT 