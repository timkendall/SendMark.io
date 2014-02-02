'use strict';

var mongoose = require('mongoose'),
    UserAppStrategy = require('passport-userapp').Strategy,
    config = require('./config'),
    _ = require('lodash');


module.exports = function(passport, UserApp, users) {

    //var users = [];

    // Initialzie UserApp
    UserApp.initialize({ appId: config.userapp.clientID });

    // Passport session setup
    passport.serializeUser(function(user, done) {
      console.log("serializing user " + user);

      done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {

      console.log("deserializing user " + username);

      var user = _.find(users, function (user) {
        return user.username == username;
      });
      if (user === undefined) {
        done(new Error('No user with username "' + username + '" found.'));
      } else {
        done(null, user);
      }
    });

    // Use the UserAppStrategy within Passport
    passport.use(
      new UserAppStrategy({
        appId: config.userapp.clientID
      },
      function (userprofile, done) {

        console.log("userprofile: " + userprofile);

        process.nextTick(function () {
          var exists = _.any(users, function (user) {
            return user.id == userprofile.id;
          });

          if (!exists) {
            users.push(userprofile);
          }

          return done(null, userprofile);
        });
      }
    ));
};