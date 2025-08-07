require('dotenv').config();
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/service/ai.service')

const httpServer = createServer(app);

// Environment-based CORS configuration
const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://your-app-name.vercel.app", // Replace with your actual Vercel URL
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

//* Adding Short term memory for per chat session
const chatHistory = [
    // {
    //     role: "user",
    //     parts: [ { text: 'who was the PM if india in 2019'} ]
    // },
    // {
    //     role: "model",
    //     parts: [ { text: 'the prime minister of India in 2019 in Narendra Modi'} ]
    // }
]

// * there is two inbuilt events 'connection' and 'disconnect' and you built custom events according to the usage
io.on("connection", (socket) => {    
    console.log("A user is connected.!");
    socket.on("disconnect", (reason) => {
        console.log("A user is disconnected.!");
    });

    //? 'on' is used to listen the event from the server/client side like receiving/processing a response from the user
    socket.on("message", async (data)=>{
        //? in the 'data' we receive the data from frontend in form of text or json or binary(for files)
        console.log("message is received..!");
        console.log("Received prompt: ",data);

        chatHistory.push({
            role: "user",
            parts: [{ text: data}]
        })
        // console.log(data); 
        
        const response = await generateResponse(chatHistory)
        console.log("AI-Response: ",response);
        
        chatHistory.push({
            role: "model",
            parts: [{ text: response}]
        })

        //? 'emit' is used to fire the event from the server/client side like sending a response to the user
        socket.emit("message-response", {response})
    })
});

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log("App is running on PORT: 3000");
})
