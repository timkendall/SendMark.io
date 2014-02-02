'use strict';

// Lists routes use lists controller
var lists = require('../controllers/lists');
var authorization = require('./middlewares/authorization');

// List authorization helper (i.e decide if creator of list is accessor)
var hasAuthorization = function(req, res, next) {
    if (req.list.user._id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/lists', lists.all);
    app.post('/lists', authorization.ensureAuthenticated, lists.create);
    app.get('/lists/:listId', lists.show);
    app.put('/lists/:listId', authorization.ensureAuthenticated, hasAuthorization, lists.update);
    app.del('/lists/:listId', authorization.ensureAuthenticated, hasAuthorization, lists.destroy);

    // Finish with setting up the listId param (i.e provide req.list to route)
    app.param('listId', lists.list);

};