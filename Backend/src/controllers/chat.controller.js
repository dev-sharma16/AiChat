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

    //if chathistory is empty then dont save into db
    if(!chatHistory?.[0]?.parts?.text) return 

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

const handleLoadAllChats = async (socket, userId) => {
    try {
        console.log("fetching all the chats.!");
        if(!userId){
            throw new Error 
        }

        const response = await Conversation.find( {userId} )

        console.log(response);
    
        socket.emit("load-all-chats", {
            message: "chats fetched successfully",
            chats: response
        });
    } catch (error) {
        console.error("Error fetching all chats:", error);
        socket.emit("message-error", {
            error: "Failed to fetch all chats"
        });
    }
}

const handleLoadChat = async (socket, chat) => {
    const reloadedCovo = await Conversation.findById({ _id: chat._id });
    if(!reloadedCovo) throw new Error("Chat not found");

    const redisKey = socket.data.redisKey
    await client.del(redisKey);

    resetChatSession();

    for(const msg of reloadedCovo.messages){
        chatHistory.push({
            role: msg.role,
            parts: { text: msg.parts.text }
        })

        await client.rPush(
            redisKey,
            JSON.stringify({
                role: msg.role,
                parts: { text: msg.parts.text }
            })
        )
    }

    //todo: make a permanent solution for updating doc rather then deleting old one and then creating new one
    await Conversation.findByIdAndDelete({_id:chat._id })

    console.log(`Conversation ${chat._id} loaded back into Redis`);

    socket.emit("reloaded-chat", reloadedCovo.messages)
}

module.exports = {
    handleChatMessage,
    chatHistory,
    handleChatSave,
    resetChatSession,
    handleLoadAllChats,
    handleLoadChat
};

