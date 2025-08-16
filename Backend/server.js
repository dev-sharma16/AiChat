require('dotenv').config();
const app = require('./src/app')
// const { createServer } = require("http");
// const { Server } = require("socket.io");
const http = require('http')
const { setupSocketServer }  = require('./src/socket/socket.server')
const { setupChatRoutes } = require('./src/routes/chat.routes');
const MCPTools = require('./src/service/mcp.service');
const connectDb = require('./src/db/db')
const { connectRedisDb } = require('./src/db/redisDb')

connectDb(); //? db connection for mongo db
connectRedisDb(); //? db connection for redis db

// const httpServer = createServer(app);
const mcpTools = new MCPTools();

//* setting up Socet.io sever
const httpServer = http.createServer(app)
const io = setupSocketServer(httpServer)

//* Passing IO Instanse to chat routes
setupChatRoutes(io);

// const PORT = process.env.SOCKET_IO_PORT || 3007
const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log(`Socket Io server is running on PORT: ${PORT}`);
    console.log("Available MCP Tools:", mcpTools.getAvailableTools().map(t => t.name))
})
