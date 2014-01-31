'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        user: req.user,
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        user: false,
        message:req.flash('error')
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
 /*
exports.create = function(req, res, next, UserApp) {

    // the HTML form names are conveniently named the same as
    // the UserApp fields...
    var user = req.body;

    // Create the user in UserApp
    UserApp.User.save(user, function(err, user){

      // We can just pass through messages like "Password must be at least 5 characters." etc.
      if (err) return res.render('signup', {user: false, message: err.message});

      // UserApp passport needs a username parameter
      req.body.username = req.body.login;

      //on to authentication
      next();
    });
};
*/

/**
 * Send User
 */
exports.account = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
 /*
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};*/