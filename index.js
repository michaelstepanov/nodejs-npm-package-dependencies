require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3000;

require('./config/app')(app);

http.listen(port, () => {
    console.log(`Listening on *:${port}...`);
});