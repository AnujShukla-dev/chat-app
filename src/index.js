const path = require("path");
const http = require("http");
const {generateMessage,generateLocatiopnUrl} =require("./utils/messages")
const {getUser,removeUser,addUser, getUsersInRoom} = require('./utils/user')
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
  socket.on('join',({username,room},callback)=>{
    const {error, user}= addUser({id:socket.id,username,room})
    if(error){
        callback(error)
    }
    socket.join(user.room)

    socket.emit("welcomeMessage",generateMessage(user.username,'Welcome!'));
    socket.broadcast.to(room).emit("welcomeMessage", generateMessage(user.username,user.username+" has joined!"));
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    callback();
  })
  socket.on("messageSend", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user);

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Bad words not allowed");
    }
    io.to(user.room).emit("welcomeMessage", generateMessage(user.username,message));
    callback("delivered!");
  });
  socket.on("sendLocation", ({ latitude, longitude },callback) => {
    const user = getUser(socket.id);
    console.log(user);
    console.log(user);
    io.to(user.room).emit(
      "locationMessage",
      generateLocatiopnUrl(user.username,{ latitude, longitude })
    );
    callback('Location Shared')
  });
  // socket.on('increment',()=>{
  //     count++,
  //     io.emit('countUpdated',count)
  // })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if(user){
        io.to(user.name).emit("welcomeMessage",generateMessage( user.username,user.name +"User has left!"));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    }
   
    

  });
});


// app.get("", (req, res) => {
//     res.render("index");
//   });
server.listen(3000, () => {
  console.log(" Server running on localhost 3000");
}); 
