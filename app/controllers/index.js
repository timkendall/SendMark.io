'use strict';

exports.render = function (req, res) {

    /*
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
    */
    res.render('index'); // Need to send  user?
};

exports.redirect = function (req, res) {
  res.redirect('/');
};
