const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectedDB = require('./Config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const {notfound, errorHandler} = require('./middleware/errorMiddleware');


dotenv.config();
connectedDB();


const port = process.env.PORT || 5000;
app.use(express.json()) //accepet json data in the body
app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notfound)
app.use(errorHandler)

const server = app.listen(port, console.log(`server started on ${port} and heres the link http://localhost:${port}`));
//----------socket io ------------
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected to the socket');

    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log(`user joined ${room}`)       
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit('typing')
    })

    socket.on('stop typing',(room)=>{
        socket.in(room).emit('stop typing')
    })

    socket.on('new message',(newMessageRecieved) =>{

        var chat = newMessageRecieved.chat
        if(!chat.users) return console.log('chat.users not defined')
        chat.users.forEach(user =>{
            if(user._id == newMessageRecieved.sender._id) return ;
            socket.to(user._id).emit('message recieved',newMessageRecieved)
        })
    })
    
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
  })
