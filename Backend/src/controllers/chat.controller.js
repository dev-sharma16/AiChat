const { generateResponse, generateVector} = require('../service/ai.service');
const { client } = require("../db/redisDb")
const Conversation = require("../models/conversation.model")
const { createMemory, queryMemory } = require("../service/vector.service")

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

//* this controller handle receiving the user message and sending the ai response to the user and store the current conovo in redis
const handleChatMessage = async (socket, data) => {
    try {
        console.log("message is received..!");
        console.log("Received prompt: ", data);
        
        // saving the user message in stm
        chatHistory.push({
            role: "user",
            parts: { text: data}
        });

        // saving the user message in redis
        await client.rPush(
            socket.data.redisKey,
            JSON.stringify({role:"user", parts: {text: data}})
        )

        // converting the user message into vector 
        const vectors = await generateVector(data)
        // console.log("Vectors : ",vectors);

        // checking for related memory in vector databse
        const memory = await queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
                user: socket.request.user._id.toString()
            } 
        })
        console.log(memory);
        
        //saving the converted vector into vector database
        await createMemory({
            vectors,
            metadata: {
                chat: data,
                user: socket?.request?.user?._id 
            },
            messageId: `${socket?.request?.user?._id}_${Date.now()}` || null,
        })
        .then(()=>{console.log("User Message is saved in vectory db")})
        .catch(err => console.log("Error in saving User Message in vector db:", err))

        // passing the user response to ai 
        const response = await generateResponse(chatHistory, data, memory);
        console.log("AI-Response: ", response);
        
        // saving the ai message in stm
        chatHistory.push({
            role: "model",
            parts: { text: response.text}
        });

        // saving the ai message in redis
        await client.rPush(
            socket.data.redisKey,
            JSON.stringify({role:"model", parts: {text: response.text}})
        )

        // converting the ai response into vector 
        const aiVectors = await generateVector(response.text)
        // console.log("Vectors : ",vectors);

        //saving the converted vector into vector database
        await createMemory({
            vectors: aiVectors,
            metadata: {
                chat: response.text,
                user: "ai" 
            },
            messageId: `ai_${Date.now()}`,
        })
        .then(()=>{console.log("Ai Message is saved in vectory db")})
        .catch(err => console.log("Error in saving Ai Message in vector db:", err))


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

//* this controller saves the current convo in mongo db 
const handleChatSave = async (socket) => {
    if (conversationSaved) return; // prevent duplicate save
    conversationSaved = true;

    //if chathistory is empty then dont save into db
    if(!chatHistory?.[0]?.parts?.text) return 

    try {
        const filter = {
            userId: socket.request.user._id,
            title: chatHistory?.[0]?.parts?.text
        }

        //* UPSERT METHOD : checking if document is existed or not if it is then it update the the messages and if not then create it
        await Conversation.findOneAndUpdate (
            filter,
            {
                $set: {
                    userId: socket.request.user._id,
                    title: chatHistory?.[0]?.parts?.text,
                    messages: chatHistory, // full snapshot overwrite
                    updatedAt: new Date()
                }
            },
            //by turning upsert this true mongodb can update the doc if its exists or create new if it's not 
            { upsert: true } 
        )

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

//* this controller loads all the previous chats from mongodb of the user and send them to frontend
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


//* this controller open the previous chat in current redis and in current covo session so user can continue
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

