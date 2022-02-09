const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { createServer } = require('http');
const ws = require('./config/ws');

//If in the production enviornment
if (process.env.NODE_ENV === 'development') {
    //Load the process variable from .env file.
    dotenv.config();
}

//created a express app to handle our API.
const app = express();
const PORT = process.env.PORT || 4000;

//parse the incoming JSON message and put it into req.body
app.use(express.json());

//create a http server using the app.
const chatapp = createServer(app);

//create a websocket server using the http server.
ws(chatapp);

//If in the production enviornment
if (process.env.NODE_ENV === 'production') {  
    //set path to build folder for static files.
    app.use(express.static(path.join(__dirname, '/client/build')));

    //every get path on this app should give us the index.html
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build/index.html'));
    })
}

//every other route in this app will give invalid url.
app.all('*', (req, res) => {
    res.status(500).send('Invalid URL.');
})

//server is listening on given port.
chatapp.listen(PORT, () => {
    console.log(`[listen] Chat Server is listening on ${PORT}.`);
}) 