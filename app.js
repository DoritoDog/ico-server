const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

require('dotenv').load();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql");

// Express routing
app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.get('/chat', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.send(lastMessages);
});

app.listen(process.env.PORT, function() {
	console.log(`App.js is listening on port ${process.env.PORT}.`);
});

// socket.io
http.listen(process.env.SOCKET_IO_PORT, function() {
	console.log(`Socket.io is listening on port ${process.env.SOCKET_IO_PORT}.`);
});

io.on('connection', function(socket) {
	socket.on('message', function(msg) {
			insertMessage(msg);
			io.emit('message', msg);
	});
});

var lastMessages = [];
function insertMessage(msg) {
	console.log(msg.name + ': ' + msg.message);

	lastMessages.push(msg);
	if (lastMessages.length > 10) lastMessages.shift();
}