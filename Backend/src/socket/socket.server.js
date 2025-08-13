const { Server } = require('socket.io')

function setupSocketServer(httpServer) {
    // Environment-based CORS configuration
    const allowedOrigins = [
        "http://localhost:5173", // Local development
        "https://ai-chat-sandy-kappa.vercel.app", // actual Vercel URL
        process.env.FRONTEND_URL // Environment variable for production
    ].filter(Boolean); // Remove undefined values
    
    const io = new Server( httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    // io.on("connection", ()=>{
    //     console.log("A user is connecteddddd.!");
    // })

    return io;
}

module.exports = { setupSocketServer }