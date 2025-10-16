const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = require('./router.js');
const app = express();

//creating a regular http server from express
const http = require('http');
const server = http.createServer(app);

//socket io setup
const initSocket = require('./socket/chatsocket.js');

initSocket(server);

app.use(express.json());
app.use(cors());
app.use('/', router);

// Start the server

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
