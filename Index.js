//Node Server Which Will handle socket io connections
const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket =>{
    console.log('New Connection');
    //if any new users joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{
        console.log('New user joined: ${name}')
       users[socket.id] = name;
       socket.broadcast.emit('user-joined', name);
    });
    
    //if someone sends a message, broadcost it to other people
    socket.on('send', message =>{
        console.log('Message received: ${message} from ${users[socket.id]}');
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]}); 
    });

    //if someone leaves the chat, let others know
    socket.on('disconnect', () =>{
        console.log('user disconnected: ${users[socket.id]}');
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];  
    });
});
