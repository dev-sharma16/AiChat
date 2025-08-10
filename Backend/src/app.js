const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes')

const app = express();

// Environment-based CORS configuration
const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://ai-chat-sandy-kappa.vercel.app', // actual Vercel URL
    process.env.FRONTEND_URL // Environment variable for production
].filter(Boolean);

// Express CORS
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json())

app.use(cookieParser())

app.use('/auth', authRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        message: "AI Chat Backend is running!", 
        status: "healthy",
        timestamp: new Date().toISOString()
    })
})

// const PORT = process.env.EXPRESS_PORT

// app.listen(PORT || 3000,()=>{
//     console.log(`Express Server is started at PORT : ${PORT}`);
// })

module.exports = app;