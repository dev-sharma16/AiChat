const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    parts: { 
        text: String
    }
})

const ConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [ MessageSchema ],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
})

const Conversation = mongoose.model("Conversation", ConversationSchema)

module.exports = Conversation;