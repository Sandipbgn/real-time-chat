const { Server } = require("socket.io");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function setupSocketIO(server) {
    const io = new Server(server,
        {
            cors: {
                origin: '*'
            }
        }
    );

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('No token found'));
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication failed'));
            }
            socket.userId = decoded.userId;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('searchMessages', async ({ query }) => {
            try {
                const results = await prisma.message.findMany({
                    where: {
                        content: {
                            mode: 'insensitive',
                            contains: query
                        }
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                });

                socket.emit('searchResults', results);
            } catch (error) {
                console.error('Search error:', error);
                socket.emit('searchResults', []);
            }
        });

        // Initial load of messages
        socket.on('requestHistory', ({ skip, take }) => {
            prisma.message.findMany({
                skip: skip,
                take: take,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            username: true,
                            email: true
                        }
                    }
                }
            })
                .then(messages => {
                    socket.emit('loadHistory', messages.reverse());
                })
                .catch(error => {
                    console.error('Error loading chat history:', error);
                });
        });

        socket.on('sendMessage', async (message) => {
            try {

                const content = JSON.parse(message).content;
                const savedMessage = await prisma.message.create({
                    data: {
                        content: content,
                        userId: socket.userId
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                });
                io.emit('receiveMessage', savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('messageError', { error: 'Message could not be sent' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = setupSocketIO;
