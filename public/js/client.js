const socket =io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var audio=new Audio('media/ting.mp3'); 

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // Scroll down
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position=='left'){
        audio.play();
    }
}

const names = prompt("Enter your name to join ");
socket.emit('new-user-joined',names);

socket.on('user-joined', names=>{
    append(`${names} joined the chat`,'right')
})
socket.on('receive', data=>{
    append(`${data.names}: ${data.message}`,'left')
})
socket.on('left', names=>{
    append(`${names} left the chat`,'right')
})

socket.on('output-message', data=>{
    if(data.length){
        data.forEach(data => {
            append(`Sender: ${data.message}`,'left')
        });
    }
})

//If the form gets submitted, then send the server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})