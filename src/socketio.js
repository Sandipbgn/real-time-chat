const { Server } = require("socket.io");

function setupSocketIO(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('message', (msg) => {
            console.log('message: ' + msg);
            socket.broadcast.emit('message', msg);
        });
    });

    return io;
}

module.exports = setupSocketIO;
