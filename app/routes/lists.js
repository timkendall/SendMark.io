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

module.exports = function(app, passport) {

	// Show all of current users lists
	app.get('/lists', passport.authenticate('userapp'), lists.all);

	app.post('/lists', passport.authenticate('userapp'), lists.create);
	app.get('/lists/:listId', lists.show);
	app.put('/lists/:listId', passport.authenticate('userapp'), hasAuthorization, lists.update);
	app.del('/lists/:listId', passport.authenticate('userapp'), hasAuthorization, lists.destroy);

	// Finish with setting up the listId param (i.e provide req.list to route)
	app.param('listId', lists.list);

};