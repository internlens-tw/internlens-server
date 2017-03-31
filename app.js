'use strict';

const express = require('express');
const app = express();
const PORT = 9487;
const mongoose = require('mongoose');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const path = require('path');

const routes = {
    auth: require('./routes/auth'),
};

mongoose.connect('mongodb://localhost/interlens');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'asldfjkljwer',
}));
app.use(logger('dev'));
app.use(methodOverride());


// error handling middleware should be loaded after the loading the routes
if ('development' === app.get('env')) {
    app.use(errorHandler());
}
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DEconstE');
    res.setHeader('Access-Control-Allow-Headers',
        'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


// routes
app.get('/', function(req, res) {
    res.send('hi~~~');
});

app.use('/auth', routes.auth);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

const server = app.listen(PORT, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server listening to %s:%s', host, port);
});

module.exports = app;
