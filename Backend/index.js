const express = require('express');
const app = express();
const { port } = require('./App/config');
const apiRouter = require('./App/routes/api');
const bodyParser = require('body-parser');
const {initRealTimeRankGameConcept} = require('./rank_game_concept')
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
initRealTimeRankGameConcept(io)

require('./App/mongodb/mongoose');
app.use(bodyParser.json());
app.use('/api/', apiRouter);
app.use(cors());

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port})`);
});
