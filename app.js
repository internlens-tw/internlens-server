var express = require('express')
var app = express()
var PORT = 9487
var mongoose = require('mongoose')
var favicon = require('serve-favicon')
var logger = require('morgan')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var errorHandler = require('errorhandler')
var path = require('path')

var User = require('./models/user.js')

var routes = {
  auth: require('./routes/auth'),
}

mongoose.connect('mongodb://localhost/interlens')

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'asldfjkljwer'
}));
app.use(logger('dev'));
app.use(methodOverride());


// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});


// routes
app.get('/', function(req, res) {
  res.send('hi~~~')
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.send({ user: req.user });
});

app.use('/auth', routes.auth)

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var server = app.listen(PORT, function() {
  "use strict";
  let host = server.address().address
  let port = server.address().port
  console.log("Server listening to %s:%s", host, port)
})

// Checks authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401) // Unauthorized error
}

module.exports = app;
