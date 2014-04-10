'use strict';

// Lists routes use links controller
var links = require('../controllers/links');
var authorization = require('./middlewares/authorization');

// Link authorization helper (i.e decide if creator of list is accessor)
var hasAuthorization = function(req, res, next) {
  if (req.link._creator._id !== req.user._id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(app, passport) {

  app.post('/links', passport.authenticate('userapp'), links.create);
  app.get('/links/:linkId', links.show);
  app.put('/links/:linkId', passport.authenticate('userapp'), hasAuthorization, links.update);
  app.del('/links/:linkId', passport.authenticate('userapp'), hasAuthorization, links.destroy);

  // Finish with setting up the listId param (i.e provide req.list to route)
  app.param('linkId', links.link);

};