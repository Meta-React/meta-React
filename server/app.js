const express = require('express');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const indexRoutes = require('./routes/indexRoutes');
const { setupSocket } = require('./sockets/gameSocket');

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'", '*'],
            },
        },
    })
);

app.use(cors());
app.use(express.json());

app.use('/', indexRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

setupSocket(io);

module.exports = server;