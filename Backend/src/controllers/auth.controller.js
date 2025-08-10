const User = require("../models/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Cross-site for production
    maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
    path: "/",
};

async function registerUser(req,res){
    const {username, email, password} = req.body

    if(!username || !email || !password) {
        return res
        .status(400)
        .json({success: false,message: "Username, Email and Password are required"})
    }

    const isUserExists = await User.findOne({ 
        $or: [
            { username: username },
            { email: email }
        ]
    })
    if(isUserExists) return res.status(409).json({success: false,message: "Username already in use"})

    const user = await User.create({
        username: username,
        email: email, 
        password: await bcrypt.hash(password,10)
    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.cookie("user",token, cookieOptions)

    const {password: _, ...userWithoutPassword} = user.toObject()

    res.status(201).json({
        success: true,
        message: "User is successfully registered",
        userWithoutPassword
    })
}

async function loginUser(req,res){
    const {usernameOrEmail, password} = req.body

    const isUserExists = await User.findOne({ 
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })
    if(!isUserExists) return res.status(400).json({ success:false,message:"User not found"})
    
    const isPasswordValid = await bcrypt.compare(password,isUserExists.password)
    if(!isPasswordValid) return res.status(400).json({success:false,message:"Password is invalid.!"})

    const token = jwt.sign({id:isUserExists._id},process.env.JWT_SECRET)

    res.cookie("user",token, cookieOptions)
    
    const {password: _, ...userWithoutPassword} = isUserExists.toObject()

    return res
    .status(200)
    .json({
        success: true,
        message: `${isUserExists.username} is successfully logined.!`,
        user: userWithoutPassword
    })
}

async function currentUser(req,res){
    const user = req.user

    return res
    .status(200)
    .json({
        success: true,
        message: "User details :-",
        user
    })
}

async function logoutUser(req,res){
    res.clearCookie("user")
    
    res
    .status(200)
    .json({
        success: true,
        message: "User logout successfully"
    })
}

async function changePassword(req,res){
    const userId = req.user.id
    const {oldPassword, newPassword} = req.body

    const user = await User.findById({_id:userId})
    
    const isPasswordValid = await bcrypt.compare(oldPassword,user.password)
    if(!isPasswordValid) return res.status(400).json({success: false, message: "Invalid old password"})

    const newPasswordToSave = await bcrypt.hash(newPassword,10)
    
    await User.findByIdAndUpdate(userId,{ password: newPasswordToSave });

    return res.status(200).json({
        success: true,
        message: "Password changed successfully..!"
    })
}

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    logoutUser,
    changePassword
}