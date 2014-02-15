'use strict';

module.exports = function(app, passport, UserApp) {

    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

    // Redirect all else to index (Angular HTML5)
    //app.get('*', index.render);

};
