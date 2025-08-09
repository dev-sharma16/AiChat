const express = require("express")
const {registerUser,loginUser,currentUser,logoutUser,changePassword} = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/user', authMiddleware, currentUser)

router.get('/logout', authMiddleware, logoutUser)

router.post('/change-password', authMiddleware, changePassword)

module.exports = router