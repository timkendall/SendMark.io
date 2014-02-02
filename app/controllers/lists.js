'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    List = mongoose.model('List'),
    _ = require('lodash');


/**
 * Find list by id
 */
exports.list = function(req, res, next, id) {
    List.load(id, function(err, list) {
        if (err) return next(err);
        if (!list) return next(new Error('Failed to load list ' + id));
        req.list = list;
        next();
    });
};

/**
 * Create a list
 */
exports.create = function(req, res) {
    var list = new List(req.body);
    list.creator = req.user._id;

    list.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                list: list
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * Update a list
 */
exports.update = function(req, res) {
    var list = req.list;

    list = _.extend(list, req.body);

    list.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                list: list
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * Delete a list
 */
exports.destroy = function(req, res) {
    var list = req.list;

    list.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                list: list
            });
        } else {
            res.jsonp(list);
        }
    });
};

/**
 * Show a list
 */
exports.show = function(req, res) {
    res.jsonp(req.list);
};

