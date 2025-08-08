require('dotenv').config();
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const { setupChatRoutes } = require('./src/routes/chat.routes');
const MCPTools = require('./src/service/mcp.service');

const httpServer = createServer(app);
const mcpTools = new MCPTools();

// Environment-based CORS configuration
const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://ai-chat-sandy-kappa.vercel.app", // actual Vercel URL
    process.env.FRONTEND_URL // Environment variable for production
].filter(Boolean); // Remove undefined values

const io = new Server(httpServer, { 
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});
//? io:- a whole server and socket:- a sigle user and inside that callback fire when the new connection was created

//* Setup Socket.io chat routes
setupChatRoutes(io);

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log("App is running on PORT: 3000");
    console.log("Available MCP Tools:", mcpTools.getAvailableTools().map(t => t.name))
})
