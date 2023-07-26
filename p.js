//this is the server's code 
const Io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080', 'https://admin.socket.io']
    }
});


Io.on('connection', socket => {
    socket.on('custom-emit', (Number, String, Object, room) => {
        console.log(Number, String, Object);
        room('additional was succesful!');
    });

    socket.on('db', (String, Number, Array, db) => {
        console.log(String, Number, Array);
        db('nazanm boche dnya lamn bwa ba zendane!')
    });

    socket.broadcast.emit('fromserver', 'it is me from the server');
});




//this is the client's code 
const { io } = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    socket.emit('custom-emit', 10, 'karin', { '1': "king" }
        , room => { console.log(room); });
    // emit atwanet callbacke bo danet balam la axere axereawa agadarba
    socket.emit('db', 'request', 11, ['to', 'the', 'server', 'is', 'emited'], nazanm => {
        console.log(nazanm);
    });
    socket.on('fromserver', String => {
        console.log(String);
    });
});



// server dashboard!
const { instrument } = require('@socket.io/admin-ui');
instrument(Io, { auth: false });


//creating name space 
//second socket
const userIo = Io.of('/userio');
userIo.on('connection', socket => {

    console.log('another userio is connected! that is ' + socket.username);
});
const socketio = io('http://localhost:3000/userio', { auth: { token: 'Test' } });

// using meddleware (use) that is important for auth and takes two prams 
userIo.use((socket, next) => {
    if (socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token);
        next();
    } else {
        next(new Error('Please send token'));
    }

});

function getUsernameFromToken(token) {
    return token;
}
//third socket 
const thirdio = Io.of('/third');
thirdio.on('connection', socket => {
    console.log('third io is connected!');
});

const thirdSocket = io('http://localhost:3000/third');