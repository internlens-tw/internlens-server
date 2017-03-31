const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const User = require('../models/user.js');
const publicKey = require('fs').readFileSync('rsa.public');

const isAuthenticated = (req, res, next) => {
    if (req.body.token === undefined) {
        return res.status(401).send('Please login.');
    }

    jwt.verify(req.body.token, publicKey, (err, _id) => {
        if (err) {
            res.status(401).send('Authtication error.');
            return console.log('JWT verify:', err);
        }
        User.findById(_id, (err, user) => {
            if (err) {
                res.status(500).send('Database error.');
                return console.log('Find decoded JWT token', err);
            }

            if (user === undefined) {
                res.status(403);
                return console.log('User _id', _id, 'not found.');
            }

            next();
            return console.log('Authenticate', user);
        });
    });
};

module.exports = (() => {
    'use strict';

    router.post('/new', isAuthenticated, (req, res) => {
        // req.body: {
        //	token: <JWT token>,
        // }
        res.send('Server undone XDDD');
        return console.log('Authenticate success!');
    });

    return router;
})();
