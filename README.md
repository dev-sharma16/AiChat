# AI Chat Application

Real-time AI chat with persistent memory, multi-session support, and live data access via MCP tools.

## Features

- **Multi-Session Chat** - Create, save, and switch between chat sessions
- **Long-term Memory** - AI remembers conversations across sessions using vector storage
- **Real-time Data** - Stock prices, weather, time via MCP tools
- **User Authentication** - Secure login with JWT
- **Live Updates** - Socket.IO for instant messaging

## Tech Stack

**Backend:** Node.js, Express, Socket.IO, MongoDB, Redis, Pinecone  
**Frontend:** React, Vite, Tailwind CSS, Socket.IO Client  
**AI:** Google Gemini 2.0 Flash, Vector embeddings  
**APIs:** Alpha Vantage (stocks), Weather API

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd ai-chat-application

# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 2. Environment Setup

**Backend (.env):**
```env
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
PORT=3000
VANTAGE_API_KEY=your_stock_api_key
WEATHER_API_KEY=your_weather_key
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
PINECONE_API_KEY=your_pinecone_key
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Run Application
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)  
cd frontend && npm run dev
```

Visit: http://localhost:5173

## Project Structure

```
ai-chat-application/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Auth & chat logic
│   │   ├── db/             # MongoDB & Redis config
│   │   ├── middleware/     # Authentication
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── service/        # AI, MCP tools, vectors
│   │   └── socket/         # Socket.IO handlers
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── config/        # App configuration
    │   ├── hooks/         # Custom hooks
    │   ├── pages/         # Page components
    │   └── store/         # Redux store
    └── package.json
```

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register user
- `POST /login` - Login user
- `GET /user` - Current user (protected)
- `GET /logout` - Logout (protected)
- `POST /change-password` - Change password (protected)

### Socket Events

**Client → Server:**
- `message` - Send chat message
- `newChat` - Start new session
- `reload-chat` - Load previous chat

**Server → Client:**
- `message-response` - AI response
- `load-all-chats` - User's chat history
- `new-chat-started` - New session confirmed
- `reloaded-chat` - Previous chat loaded

## How It Works

1. **Authentication** - JWT-based login with HTTP-only cookies
2. **Chat Sessions** - Create unlimited chats, auto-saved to MongoDB
3. **Memory System** - Active chats in Redis, embeddings in Pinecone
4. **AI Processing** - Gemini AI with context from vector memory
5. **Real-time Data** - MCP tools fetch live stocks/weather/time

## Configuration

**Memory Flow:** Redis (active) → MongoDB (persistent) → Pinecone (vectors)  
**Transport:** Polling mode for Render compatibility  
**CORS:** Dynamic origin handling with credentials

## Deployment

### Backend (Render)
- Root directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Add all environment variables

### Frontend (Vercel)
- Root directory: `frontend`  
- Framework: Vite
- Build: `npm run build`
- Set `VITE_BACKEND_URL` to Render URL

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI API key |
| `FRONTEND_URL` | Frontend URL for CORS |
| `VANTAGE_API_KEY` | Stock/crypto data |
| `WEATHER_API_KEY` | Weather data |
| `MONGO_URL` | MongoDB connection |
| `JWT_SECRET` | JWT signing key |
| `REDIS_URL` | Redis connection |
| `PINECONE_API_KEY` | Vector database |

## Scripts

**Backend:** `npm start` | `npm run dev`  
**Frontend:** `npm run dev` | `npm run build`

## License

ISC License