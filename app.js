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

app.listen(process.env.PORT, function() {
	console.log(`App.js is listening on port ${process.env.PORT}.`);
});

// Sends the last 10 chat messages.
app.get('/chat', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	queryDB('SELECT * FROM chat_messages LIMIT 10', [], (result) => {
		res.send(result);
	});
});

// socket.io
http.listen(process.env.SOCKET_IO_PORT, function() {
	console.log(`Socket.io is listening on port ${process.env.SOCKET_IO_PORT}.`);
});

io.on('connection', function(socket) {
	socket.on('message', function(msg) {
			var values = [[msg.name, msg.profileImage, msg.message]];
			queryDB('INSERT INTO chat_messages (name, image, content) VALUES ?', [values], (result) => {
				io.emit('message', msg);
			});
	});
});

function queryDB(sql, args, callback) {
	var config = {
		host: process.env.DB_HOST,
		user: "root",
		password: process.env.DB_PASSWORD,
		database: "ico"
	};
	
	var connection = mysql.createConnection(config);
	connection.connect((err) => {
		if (err) throw err;

		if (args.length > 0) {
			connection.query(sql, args, function(err, result) {
				if (err) throw err;
				connection.end();
				callback(result);
			});
		} else {
			connection.query(sql, function(err, result) {
				if (err) throw err;
				connection.end();
				callback(result);
			});
		}
	});
}