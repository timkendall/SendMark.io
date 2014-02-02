'use strict';

// User routes use users controller
var usersC = require('../controllers/users');
var authorization = require('./middlewares/authorization');

module.exports = function(app, passport, UserApp, users) {

  app.get('/account', authorization.ensureAuthenticated, usersC.account);
  app.get('/signin', usersC.signin);
  app.get('/signup', usersC.signup);
  app.get('/signout', usersC.signout);

  // Setting up the users api
  app.post('/signup',
    function createUser(req, res, next){
      // the HTML form names are conveniently named the same as
      // the UserApp fields...
      var user = req.body;

      // Create the user in UserApp
      UserApp.User.save(user, function(err, user){

        // We can just pass through messages like "Password must be at least 5 characters." etc.
        if (err) return res.render('users/signup', {user: false, message: err.message});

          // UserApp passport needs a username parameter
          req.body.username = req.body.login;

          //on to authentication
          next();
      });
    },  passport.authenticate('userapp', { failureRedirect: '/signup', failureFlash: 'Error logging in user' }),

    function serveAccount(req, res, next){
      // console.log(req.user);
      res.redirect('/');
  });

  app.post('/signin',
    passport.authenticate('userapp', { failureRedirect: '/signin', failureFlash: 'Invalid username or password.'}),
    function (req, res) {
        res.redirect('/');
     }
   );

};
