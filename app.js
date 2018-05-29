const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

require('dotenv').load();

// Express routing
app.get('/', function(req, res) {
	res.send('Hello World!');
});

app.listen(process.env.PORT, function() {
	console.log('App.js is running on port 8080.');
});

// socket.io
http.listen(process.env.PORT, function(){
	console.log(process.env.PORT);
});

io.on('connection', function(socket){
	socket.on('message', function(msg){
			console.log(msg.name + ': ' + msg.message);
			io.emit('message', msg);
	});
});