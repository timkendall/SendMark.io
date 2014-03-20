'use strict';

// Lists routes use lists controller
var mail = require('../controllers/mail');
var authorization = require('./middlewares/authorization');

// Mailgun authorization helper (i.e decide if creator of list is accessor)


module.exports = function(app, passport) {

  // Blindly accept POST data from Mailgun [TODO: Authenticate]
  app.post('/api/4Drf22/mail', mail.parse);

};