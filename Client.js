const socket = io('http://localhost:8000');

//Get DOM elements in respective js varaibles
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Function which will append event info to the container
const append = (message, position) =>{
    console.log('Appending message: ${message} at position: ${position}');
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};

//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
console.log('New user name: ${name}');
socket.emit('new-user-joined', name);

//If the new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    console.log('${name} joined the chat');
   append(`${name} joined the chat`, `right`);
});
 
//If server sends a message, receive it
socket.on('receive', data =>{
    console.log('Received message: ${data.message} from ${data.name}');
    append(`${data.name}: ${data.message}`, `left`);
});
 
//If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    console.log('${name} left the chat');
    append(`${name} left the chat`, `left`);
});

//If the form gets submitted, send server the message
form.addEventListener('submit', e=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.Value = '';
});
