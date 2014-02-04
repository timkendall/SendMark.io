'use strict';

var mongoose = require('mongoose'),
  UserAppStrategy = require('passport-userapp').Strategy,
  User = mongoose.model('User'),
  config = require('./config'),
  _ = require('lodash');


module.exports = function (passport, UserApp, users) {

  //var users = [];
  // Initialzie UserApp
  UserApp.initialize({
    appId: config.userapp.clientID
  });

  // Passport session setup
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {

    User.load(id, function (err, user) {
      if (err) return done(err);
      if (!user) return done(new Error('Failed to load user ' + id));

      done(null, user);
    });

  });

  // Use the UserAppStrategy within Passport
  passport.use(
  new UserAppStrategy({
    appId: config.userapp.clientID
  }, function handleUserProfile(userprofile, done) {

    process.nextTick(function () {

      // See if userprofile exists locally
      User.load(userprofile.id, function createUpdateLocal(error, user) {
        if (error) done(new Error(error));
        if (!user) {

          console.log('User doesnt exits locally, attempting to create.');

          var user = new User(userprofile);

          user.save(function (error) {
            if (error) {
              console.log(error);
              done(new Error('Unable to save local copy of user' + userprofile.username));
            } else {
              console.log('Successfully saved local copy of user ' + userprofile.username);
            }
          });
        } else {

          // Compare times
          var updatedAt = new Date(userprofile.updatedAt);
          var cachedUpdatedAt = new Date(user.updatedAt);

          // Update local copy
          if (updatedAt.getTime() !== cachedUpdatedAt.getTime()) {

            // Refresh all fields
            user.updateAll(userprofile);
            console.log("Updated local cache of user " + userprofile.username);
          }
        }

        return done(null, userprofile);
      });
    });
  }));
};