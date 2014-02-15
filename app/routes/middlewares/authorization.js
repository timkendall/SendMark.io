'use strict';

/**
 * Generic require login routing middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};