var jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()
const request = require('request-promise')
var mongoose = require('mongoose')
var User = require('../models/user.js')
var credential = require('../credential.js')
var cert = require('fs').readFileSync('rsa.private')
var GoogleAuth = require('google-auth-library')
var auth = new GoogleAuth;
var client = new auth.OAuth2(credential.googleAuth.clientID, '', '');

/*
  FB test user: 
    email: alice_zorvhps_lin@tfbnw.net
    password: alicelin
*/

var generateJWT = (obj) => {
  return jwt.sign(obj, cert, { algorithm: 'RS256' });
}

var checkIDExists = (method, id, res) => {
  // check in DB
  //    NO => return "go register first."
  //    YES => generate JWT Token.
  User.findOne({
    OAuthid: id,
    method: method,
  }, (err, doc) => {
    if (err) {
      res.status(500).send('Error checking ID.')
      return console.error(err)
    }
    if (doc) { // found user
      res.json({
        token: generateJWT({ _id: doc._id, })
      })
      return;
    } else { // user not found
      res.status(401).send('Need register.')
    }
  })
};

var registerUser = (profile, res) => {
  var newUser = new User(profile)
  newUser.save(function(err, user) {
    if (err) {
      if (err.code === 11000) { // user duplicated
        res.status(403).send('User already exists.')
      } else {
        res.status(500).send('Error saving new user.')
      }
      return console.log("Save newuser", newUser, "error:", err)
    }
    res.json({
      token: generateJWT({ _id: user._id })
    })
    console.log("New user saved:", user)
  })
}

var getFBProfile = (id, token) => {
  return request({
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${id}`,
    qs: {
      access_token: token,
      fields: 'name, link, is_verified, picture, email',
    }
  })
};

module.exports = (function() {
  'use strict';

  router.get('/fb/:id/:token', (req, res) => {
    getFBProfile(req.params.id, req.params.token).then(fbRes => {
      fbRes = JSON.parse(fbRes)
      checkIDExists('FB', req.params.id, res)
      return console.log("Facebook return:", fbRes)
    })
  })

  router.get('/google/:token', (req, res) => {
    client.verifyIdToken(
      req.params.token,
      credential.googleAuth.clientID,
      function(err, login) {
        if (err) {
          res.status(401).send('Google token error')
          return console.log('[Warning] Verify google token error:', err)
        }
        var payload = login.getPayload();
        checkIDExists('Google', payload.sub, res)
        return console.log("Google return:", payload)
      });
  })

  router.post('/register/fb', (req, res) => {
    getFBProfile(req.body.id, req.body.token).then(fbRes => {
      fbRes = JSON.parse(fbRes)
      console.log(">>>>", fbRes)
      registerUser({
        method: 'FB',
        OAuthid: req.body.id,
        nickname: fbRes.name,
        email: fbRes.email,
        image: fbRes.picture.data.url,
      }, res)
    })
  })

  router.post('/register/google', (req, res) => {
    client.verifyIdToken(req.body.token,
      credential.googleAuth.clientID,
      (err, login) => {
        if (err) {
          res.status(401).send('Google token error')
          return console.log('[Warning] Verify google token error:', err)
        }
        var payload = login.getPayload();
        registerUser({
          method: 'Google',
          OAuthid: payload.sub,
          nickname: payload.name,
          email: payload.email,
          image: payload.picture,
        }, res);
      })
  })

  return router;
})();
