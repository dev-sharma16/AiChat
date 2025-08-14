const jwt = require('jsonwebtoken')
const User = require("../models/user.model")

async function authMiddleware(req,res,next){
     //? added this section to make auth middleware work with socket.Io also
    const fail = (code, message) => {
        if (res && typeof res.status === 'function') {
            return res.status(code).json({ message });
        }
        return next(new Error(message));
    };

    const token = req.cookies.user
    if(!token) return fail(401, "Unauthorized access, please login first");

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken) return fail(401, "Unauthorized access, please login first");
        
        const user = await User.findById({_id: decodedToken.id}).select('-password')

        req.user = user;

        next();
    } catch (error) {
        return fail(401, "Unauthorized token");
    }
}

module.exports = authMiddleware