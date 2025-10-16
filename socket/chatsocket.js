const socketio = require("socket.io");

function initSocket(server) {
    const io = socketio(server, {
        cors : {
            origin : "*",
            methods : ["GET", "POST"]
            }
        });
        
        io.on("connection", (socket) => {
            console.log("New client connected: ", socket.id);

            socket.on("chat message", (msgObj) => {
                console.log(`Message from ${msgObj.username}: ${msgObj.text}`);
                socket.broadcast.emit("chat message",{
                    username : msgObj.username,
                    text : msgObj.text
                }); //broadcasting to everyone other than sender   
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected : ", socket.id);
            });
        }); 
    }

module.exports = initSocket;
