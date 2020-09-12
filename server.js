var express = require('express'),
	app = express(),
	bodyParser = require("body-parser"),
	http = require('http').Server(app);
var mysql = require('mysql');
var path = require('path');
var html = require('html');


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var blackjack = require('./controllers/blackjackcontroller.js');

app.get('/', function(req,res) {
	res.sendfile('./public/index.html');
});

app.get('/blackjack', function (req, res){	
	res.sendFile(blackjack.render());
});


//use a session instead?
var authenticated = true;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'test'
});


app.get('/players', function (req, res){	
	con.connect(function(err) {
	  if (err){ throw err};
	  con.query("SELECT * FROM players", function (err, result, fields) {
        if (err) {throw err};
		res.send(result);
	  });
	});
});



app.get('/login', function (req, res){	
	con.connect(function(err) {
	  if (err){ throw err};
	  con.query("SELECT * FROM players WHERE username = "+req.query.username, function (err, result, fields) {
        if (err) {throw err};
		res.send(result);
	  });
	});
});

app.get('/logout', function (req, res){	
	con.connect(function(err) {
	  if (err){ throw err};
	  con.query("update players set balance = "+req.query.balance+", win = "+req.query.win+", loss = "+req.query.loss+" WHERE username = "+req.query.username, function (err, result, fields) {
        if (err) {throw err};
		res.send(result);
	  });
	});
});

app.listen(8080, function (){
	console.log("server started on port 8080");
});



/*
Create database test;
Use test;
Create table players (username VARCHAR(20) key, balance INT default 100, win INT default 0, loss INT default 0);
*/


