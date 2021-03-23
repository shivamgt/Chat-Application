const mongoose = require('mongoose');
const Msg = require('./models/message')
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoDb='mongodb+srv://shivamgupta:shivamgupta123@cluster0.5k59m.mongodb.net/message-database?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log('connected');
}).catch(err => console.log(err));

const users = {};

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//If the user establishes the connection with the server
io.on('connection',socket=>{
    //Retrive the message from the database
    Msg.find().then(result=>{
        socket.emit('output-message',result)
    })
    //When the new user joins the chat
    socket.on('new-user-joined',names =>{
        users[socket.id]=names;
        socket.broadcast.emit('user-joined',names);
    });
    //When the user sends the message
    socket.on('send',message=>{
        const msg= new Msg({message, names: users[socket.id]})
        msg.save().then(()=>{
            socket.broadcast.emit('receive', {message:message, names: users[socket.id]})
        })
    });
    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));