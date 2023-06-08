const path = require("path");
const http = require('http');
const express =  require('express');
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app);
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
// let count =0;
io.on('connection',(socket)=>{
    console.log('New Websocket connection')
    
     socket.emit('welcomeMessage','Welcome!')
     socket.broadcast.emit('welcomeMessage','A new user has joined')
     socket.on('messageSend',(message)=>{
        io.emit('welcomeMessage',message)
     })
    // socket.on('increment',()=>{
    //     count++,
    //     io.emit('countUpdated',count)
    // })

    socket.on('disconnect',()=>{
        io.emit('welcomeMessage',"User has left")
    })
})


// app.get("", (req, res) => {
//     res.render("index");
//   });
server.listen(3000,()=>{
     console.log(' Server running on localhost 3000')
})