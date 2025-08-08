const { handleChatMessage } = require('../controllers/chat.controller');

const setupChatRoutes = (io) => {
    // * there is two inbuilt events 'connection' and 'disconnect' and you built custom events according to the usage
    io.on("connection", (socket) => {    
        console.log("A user is connected.!");
        
        //? 'on' is used to listen the event from the server/client side like receiving/processing a response from the user
        socket.on("disconnect", (reason) => {
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