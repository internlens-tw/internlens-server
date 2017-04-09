const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const User = require('../models/user.js');
const Article = require('../models/article.js');
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

            req.user = user;
            next();
            return console.log('Authenticate', user);
        });
    });
};

module.exports = (() => {
    'use strict';

    router.post('/new', isAuthenticated, (req, res) => {
        // req.body: {
        //  token: <JWT token>,
        //  <other columns>...
        // }
        delete req.body.token;
        req.body.userid = req.user._id;

        const post = new Article(req.body);
        post.save(function(err, newPost) {
            if (err) {
                res.status(500).send('Error saving new user.');
                return console.log('Save new article', post, 'error:', err);
            }
            res.send('success.');
            console.log('New article saved:', post);
        });
    });

    return router;
})();
