const path = require("path");
const http = require("http");
const {generateMessage,generateLocatiopnUrl} =require("./utils/messages")
const express = require("express");
const socketio = require("socket.io");
const app = express();
const Filter = require("bad-words");
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
io.on("connection", (socket) => {
  console.log("New Websocket connection");
  socket.emit("welcomeMessage",generateMessage('Welcome!'));
  socket.broadcast.emit("welcomeMessage", generateMessage("A new user has joined!"));
  socket.on("messageSend", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Bad words not allowed");
    }
    io.emit("welcomeMessage", generateMessage(message));
    callback("delivered!");
  });
  socket.on("sendLocation", ({ latitude, longitude },callback) => {
    
    io.emit(
      "locationMessage",
      generateLocatiopnUrl({ latitude, longitude })
    );
    callback('Location Shared')
  });
  // socket.on('increment',()=>{
  //     count++,
  //     io.emit('countUpdated',count)
  // })

  socket.on("disconnect", () => {
    io.emit("welcomeMessage",generateMessage( "User has left!"));
  });
});


// app.get("", (req, res) => {
//     res.render("index");
//   });
server.listen(3000, () => {
  console.log(" Server running on localhost 3000");
}); 
