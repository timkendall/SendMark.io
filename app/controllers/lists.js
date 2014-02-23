'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    List = mongoose.model('List'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Load all of a users lists
 */
exports.all = function(req, res, next) {
    console.log("loading users lists");

    List.loadAllOfUsers(req.user, function(err, lists) {
        if (err) return next(err);
        if (!lists) return next(new Error('Failed to load lists.'));

        res.jsonp(lists);
    });
    /*
    res.jsonp([
        { name: "A list" },
        { name: "Another list" },
        { name: "Last list" }
    ]);
    */
};

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
    list.creatorUsername = req.user.username;

    // A pain but load user with id to get _id
    User.load(req.user.id, function (error, user) {
        list._creator = user._id;

        // Correct way to access UserApp user
        console.log('Creating list for ' + req.user.username + ', with user_id: ' + req.user.id);


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

    console.log('List Controller - attempting to destroy list: ' + list);

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

