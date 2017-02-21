var express = require('express')
var app = express()
var PORT = 9487

app.get('/', function(req, res) {
	res.send('Hello~~~ :)')
})


var server = app.listen(PORT, function() {
	"use strict";
	let host = server.address().address
	let port = server.address().port
	console.log("Server listening to %s:%s", host, port)
})