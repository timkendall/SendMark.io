'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Link = mongoose.model('Link'),
  _ = require('lodash');

/**
 * Find link by id
 */
exports.link = function (req, res, next, id) {
  Link.load(id, function(err, link) {
    if (err) return next(err);
    if (!link) return next(new Error('Failed to load link ' + id));
    req.link = link;
    next();
  });
};

/**
 * Create a link
 */
exports.create = function(req, res) {
  var link = new List(req.body);
  link._creator = req.user.id;

  link.save(function (err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        link: link
      });
    } else {
        res.jsonp(link);
      }
    });
};

/**
 * Update a link
 */
exports.update = function(req, res) {
  var link = req.link;

  link = _.extend(link, req.body);

  link.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        link: link
      });
    } else {
      res.jsonp(link);
    }
  });
};

/**
 * Delete a link
 */
exports.destroy = function(req, res) {
  var link = req.link;

  link.remove(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        link: link
      });
    } else {
      res.jsonp(link);
    }
  });
};

/**
 * Show a link
 */
exports.show = function(req, res) {
  res.jsonp(req.link);
};

