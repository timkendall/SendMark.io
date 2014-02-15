'use strict';

var authorization = require('./middlewares/authorization');

module.exports = function(app, passport) {

  // User routes use users controller
  var users = require('../controllers/users');

  // Render login and signup
  //app.get('/login', users.renderLogin);
  //app.get('/signup', users.renderSignup);
};
