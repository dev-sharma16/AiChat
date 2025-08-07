# AI Chat Application

A real-time chat application powered by Google's Gemini AI with a modern React frontend and Node.js backend. Users can have conversations with an AI assistant that maintains context throughout the chat session.

## ✨ Features

- **Real-time Communication**: Instant messaging using Socket.IO
- **AI-Powered Responses**: Integration with Google Gemini 2.0 Flash model
- **Chat History**: Maintains conversation context throughout the session
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Connection Status**: Visual indicators for connection state
- **Typing Indicators**: Shows when AI is generating a response
- **Auto-scroll**: Automatically scrolls to latest messages

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Google Generative AI** - AI integration with Gemini model
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Socket.IO Client** - Real-time client communication
- **Lucide React** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Google AI API Key** (Gemini API access)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-chat-application
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory (assuming it's in a separate folder)
cd frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3000`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## 🏗 Project Structure

```
ai-chat-application/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   └── service/
│   │       └── ai.service.js   # Gemini AI service
│   ├── server.js               # Main server file with Socket.IO
│   ├── package.json
│   └── .env                    # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/         # React components
    │   ├── hooks/
    │   │   └── useSocket.js    # Custom Socket.IO hook
    │   ├── App.jsx             # Main App component
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Global styles
    ├── package.json
    └── vite.config.js
```

## 🔧 API Endpoints

### REST Endpoints
- `GET /` - Health check endpoint

### Socket.IO Events

#### Client to Server
- `message` - Send a chat message to the AI

#### Server to Client
- `message-response` - Receive AI response
- `connect` - Connection established
- `disconnect` - Connection lost

## 💡 How It Works

1. **Frontend Connection**: React app connects to the backend via Socket.IO
2. **Message Sending**: User types a message and clicks send
3. **Real-time Communication**: Message is sent to backend through Socket.IO
4. **AI Processing**: Backend processes the message using Google Gemini AI
5. **Context Maintenance**: Chat history is maintained for contextual responses
6. **Response Delivery**: AI response is sent back to frontend in real-time
7. **UI Updates**: Frontend displays the conversation with typing indicators

## 🎨 Key Components

### Backend Components
- **server.js** - Main server setup with Socket.IO integration
- **app.js** - Express application configuration
- **ai.service.js** - Google Gemini AI integration service

### Frontend Components
- **App.jsx** - Main application container
- **useSocket.js** - Custom hook for Socket.IO connection management
- **ChatMessage** - Individual message display component
- **ChatInput** - Message input component
- **ConnectionStatus** - Connection state indicator
- **TypingIndicator** - Shows when AI is typing

## ⚙️ Configuration

### CORS Configuration
The application is configured to allow connections from:
- Frontend: `http://localhost:5173`
- Methods: GET, POST, PUT, DELETE
- Credentials: Enabled

### Socket.IO Configuration
- Real-time bidirectional communication
- Automatic reconnection
- CORS enabled for development

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure backend server is running on port 3000
   - Check if frontend is trying to connect to the correct URL

2. **AI Not Responding**
   - Verify your Gemini API key is valid
   - Check API key permissions and quotas

3. **CORS Errors**
   - Ensure CORS is properly configured for your frontend URL
   - Check that credentials are enabled if needed

### Development Tips

- Use browser developer tools to monitor Socket.IO connections
- Check server logs for API errors
- Ensure both frontend and backend are running simultaneously

## 📝 Scripts

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented)

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Socket.IO for real-time communication
- React and Vite communities for excellent development tools

---

**Note**: Make sure to obtain a valid Google Gemini API key and keep it secure. Never commit API keys to version control.
