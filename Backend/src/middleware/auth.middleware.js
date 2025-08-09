const jwt = require('jsonwebtoken')
const User = require("../models/user.model")

async function authMiddleware(req,res,next){
    const token = req.cookies.user
    if(!token) return res.status(401).json({message: "Unauthorized access, please login first"})

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken) return res.status(400).json({message: "Unauthorized token, login first.!"})
        
        const user = await User.findById({_id: decodedToken.id}).select('-password')

        req.user = user;

        next();
    } catch (error) {
        return res.status(401)
        .json({
            message: "Unautorized token"
        })
    }
}

module.exports = authMiddleware