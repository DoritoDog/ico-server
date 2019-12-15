const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

require('dotenv').load();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql');

const ethereum = require('./ethereum.js');

var Client = require('coinbase').Client;
var client = new Client({'apiKey': process.env.COINBASE_API_KEY,
                         'apiSecret': process.env.COINBASE_API_SECRET});

// Express routing
app.get('/', (req, res) => {
	res.send('Node JS Application');
});

app.listen(process.env.PORT, () => {
	console.log(`App.js is listening on port ${process.env.PORT}.`);
});

// Sends the last 10 chat messages.
app.get('/chat', (req, res) => {
	setHeaders(res);
	
	queryDB('SELECT name, image, content FROM chat_messages LIMIT 10', [], result => {
		for (var i = 0; i < result.length; i++) {
			var chatMessage = result[i];
			result[i] = {
				name: chatMessage.name,
				profileImage: chatMessage.image,
				message: chatMessage.content
			};
		}

		res.send(result);
	});
});

app.post('/balance', (req, res) => {
	setHeaders(res);

	let balance = ethereum.getBalance(req.body.address);
	res.send(balance.toString());
});

app.post('/transaction', (req, res) => {
	setHeaders(res);

	let hash = ethereum.transferTokens(req.body.to, req.body.amount, req.body.privateKey);
	res.send(hash);
});

app.post('/contribution', (req, res) => {
	setHeaders(res);

	let contribution = ethereum.getContribution(req.body.address);
	res.send(contribution);
});

// Called when Coinbase detects a transaction to a wallet.
app.post('/notification', (req, res) => {
	setHeaders(res);

	client.getNotification(req.body.id, function(error, notification) {
		if (error) throw error;

		let amount = notification.additional_data.amount.amount;
		let currency = notification.additional_data.amount.currency;
		let address = notification.data.address;

		if (currency === 'BTC' || currency === 'LTC') {
			queryDB('SELECT wallet_address FROM users WHERE bitcoin_address = ?', [[address]], response => {
				ethereum.mintToken(response[0].wallet_address, amount);
			});
		}
	});

	res.status(200);
  res.send();
});

// socket.io
http.listen(process.env.SOCKET_IO_PORT, function() {
	console.log(`Socket.io is listening on port ${process.env.SOCKET_IO_PORT}.`);
});

var clients = 0;
io.on('connection', socket => {
	clients++;
	io.emit('update', { clients });

	socket.on('message', msg => {
			var values = [[msg.name, msg.profileImage, msg.message]];
			queryDB('INSERT INTO chat_messages (name, image, content) VALUES ?', [values], response => {

				io.emit('message', msg);
				queryDB('DELETE FROM chat_messages WHERE id = ?', [response.insertId - 10]);
			});
	});

	socket.on('disconnect', function() {
		clients--;
		io.emit('update', { clients });
	});
});

// Args are automatically escaped.
// The callback parameter is not required.
function queryDB(sql, args, callback) {
	var config = {
		host: process.env.DB_HOST,
		user: "root",
		password: process.env.DB_PASSWORD,
		database: "ico"
	};
	
	var connection = mysql.createConnection(config);
	connection.connect(err => {
		if (err) throw err;

		if (args.length > 0) {
			connection.query(sql, args, (err, result) => {
				if (err) throw err;
				connection.end();

				if (typeof callback !== 'undefined') callback(result);
			});
		} else {
			connection.query(sql, (err, result) => {
				if (err) throw err;
				connection.end();

				if (typeof callback !== 'undefined') callback(result);
			});
		}
	});
}

function setHeaders(res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
}
