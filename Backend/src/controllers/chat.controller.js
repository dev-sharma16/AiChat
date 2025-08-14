const generateResponse = require('../service/ai.service');
const { client } = require("../db/redisDb")
const Conversation = require("../models/conversation.model")

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
];

let conversationSaved = false;

const handleChatMessage = async (socket, data) => {
    try {
        console.log("message is received..!");
        console.log("Received prompt: ", data);

        chatHistory.push({
            role: "user",
            parts: { text: data}
        });

        await client.rPush(
            socket.data.redisKey,
            JSON.stringify({role:"user", parts: {text: data}})
        )
        
        const response = await generateResponse(chatHistory, data);
        console.log("AI-Response: ", response);
        
        chatHistory.push({
            role: "model",
            parts: { text: response.text}
        });

        await client.rPush(
            socket.data.redisKey,
            JSON.stringify({role:"model", parts: {text: response.text}})
        )

        //? 'emit' is used to fire the event from the server/client side like sending a response to the user
        socket.emit("message-response", {
            response: response.text,
            toolUsed: response.toolsUsed 
        });

    } catch (error) {
        console.error("Error handling chat message:", error);
        socket.emit("message-error", {
            error: "Failed to process message"
        });
    }
};

const handleChatSave = async (socket) => {
    if (conversationSaved) return; // prevent duplicate save
    conversationSaved = true;
    try {
        await Conversation.create({
            userId: socket.request.user._id,
            title: chatHistory?.[0]?.parts?.text,
            messages: chatHistory
        })

        // Delete Redis cache for this session
        const redisKey = socket.data.redisKey
        await client.del(redisKey);
        console.log(`Redis cache cleared for key: ${redisKey}`);

    } catch (error) {
        console.error("Error saving chat in mongoDb:", error);
        socket.emit("message-error", {
            error: "Failed to save message"
        });
    }
};

const resetChatSession = () => {
    chatHistory.length = 0;
    conversationSaved = false;
};

module.exports = {
    handleChatMessage,
    chatHistory,
    handleChatSave,
    resetChatSession
};

