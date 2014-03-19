'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	fs = require('fs'),
	UserApp = require('userapp'),
	passport = require('passport'),
	logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 3000;

// Initializing system variables
var config = require('./config/config'),
	mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if (stat.isFile()) {
			if (/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory()) {
			walk(newPath);
		}
	});
};
walk(models_path);

// Bootstrap passport config
require('./config/passport')(passport, UserApp);

var app = express();

// Express settings
require('./config/express')(app, passport, db);

// Create server for Socket.io
var server = http.createServer(app)

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Scoket.io
io.sockets.on('connection', function (socket) {
	socket.emit('created-remote-test', { link: 'Hey' });

	socket.on('created-local-test', function(data) {
		console.log(data);
	 });
});


// Bootstrap routes
var routes_path = __dirname + '/app/routes';
var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if (stat.isFile()) {
			if (/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath)(app, passport, UserApp);
			}
		// We skip the app/routes/middlewares directory as it is meant to be
		// used and shared by routes as further middlewares and is not a
		// route by itself
		} else if (stat.isDirectory() && file !== 'middlewares') {
			walk(newPath);
		}
	});
};
walk(routes_path);


// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

// Initializing logger
logger.init(app, passport, mongoose);

// Start Mail Listener (must do this AFTER models are initalized)
var emailController = require('./app/controllers/mail');

emailController.configListener();
emailController.start();


// Expose app
exports = module.exports = app;
