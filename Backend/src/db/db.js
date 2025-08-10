const mongoose = require('mongoose')

function connectDb(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to DB.!");
    })
    .catch((error)=>{
        console.log("Error in connecting DB.! ",error);
    })
}

module.exports = connectDb