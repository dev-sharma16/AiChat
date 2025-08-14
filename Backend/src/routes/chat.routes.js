const { handleChatMessage, handleChatSave, resetChatSession } = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware')
const cookieParser = require('cookie-parser')

const setupChatRoutes = (io) => {
    // * there is two inbuilt events 'connection' and 'disconnect' and you built custom events according to the usage

    //? io:- a whole server and socket:- a sigle user and inside that callback fire when the new connection was created

    //* this will take the express middleware and cover to SocketIo middleware format 
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

    //? '.use' is used to add middleware
    io.use(wrap(cookieParser()))
    io.use(wrap(authMiddleware));
    io.use((socket, next) => {
        if(socket.request.user) next();
        else next( new Error("Unauthorized") );
    });

    io.on("connection", (socket) => {    
        console.log("A user is connected.!");

        // Create a stable redis key for this user
        socket.data.redisKey = `${socket.request.user._id}:current`;

        resetChatSession();
        
        //? 'on' is used to listen the event from the server/client side like receiving/processing a response from the user
        socket.on("disconnect", async(reason) => {
            await handleChatSave(socket)
            console.log("A user is disconnected.!");
        });

        socket.on("message", async (data) => {
            //? in the 'data' we receive the data from frontend in form of text or json or binary(for files)
            await handleChatMessage(socket, data);
        });
    });
};

module.exports = {
    setupChatRoutes
};