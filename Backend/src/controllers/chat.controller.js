const generateResponse = require('../service/ai.service');

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

const handleChatMessage = async (socket, data) => {
    try {
        console.log("message is received..!");
        console.log("Received prompt: ", data);

        chatHistory.push({
            role: "user",
            parts: [{ text: data}]
        });
        
        const response = await generateResponse(chatHistory, data);
        console.log("AI-Response: ", response);
        
        chatHistory.push({
            role: "model",
            parts: [{ text: response.text}]
        });

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

module.exports = {
    handleChatMessage,
    chatHistory
};