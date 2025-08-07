const express = require('express')
const cors = require('cors');

const app = express();

// Express CORS
app.use(cors({
    origin: 'http://localhost:5173', // Allow only Vite frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/',(req,res)=>{
    res.status(200).json({message: "This is the response of the from the server"})
})

module.exports = app;