'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		List,
		_ = require('lodash'),
		request = require('request'),
		cheerio = require('cheerio');

process.nextTick(function() {
	List = mongoose.model('List');
});

/**
 * List Schema
 */
var LinkSchema = new Schema({
		title: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
		url: {
				type: String,
				required: true
		},
		created: {
				type: Date,
				default: Date.now
		},
		tags: [ String ],
		popularity: {
				type: Number,
				default: 0
		},
		selected: {
			type: Boolean,
			default: false
		},
		_lists: [{
			type: Schema.ObjectId,
			ref: 'List'
		}],
		_creator: {
				type: String, // UserApp user_id
				required: false,
				ref: 'User'
		}
});

/**
 * Virtuals
 */


/**
 * Validations
 */
var validatePresenceOf = function (value) {
		return value && value.length;
};

/**
 * Middleware
 */

LinkSchema.pre('save', function (next) {
	var self = this;

	if (!this.isNew) return next();

	if (!validatePresenceOf(this.url))
		next(new Error('Missing link URL'));

	// Get page title
	request(self.url, {rejectUnauthorized: false}, function (error, response, html) {
	  if (error || response.statusCode !== 200) {
	  	console.log(error);
	  	//console.log(response.statusCode);
	  	next();
	  }

	  // Extract page title and description
	  var $ = cheerio.load(html);
	  var title = $('title').text();
	  var description = $('meta[property="og:description"]').attr('content');

	  // Save to doc
	  self.title = title;
	  self.description = description;

	  next();

	});
});

LinkSchema.post('save', function (doc) {
	// Add link to its _lists
	doc._lists.forEach(function (_list) {
		List.findOne({ _id: _list }, function (err, list) {
			if (err) return console.log(err);
			if (!list) return;

			list.addItem(doc._id);
		});
	});


});

LinkSchema.post('remove', function (doc) {
	// Remove self from _lists
	doc._lists.forEach(function (_list) {
		List.findOne({ _id: _list}, function (err, list) {
			list.removeItem(doc._id);
		});
	})
});

/**
 * Methods
 */
LinkSchema.methods = {
		/**
		 * findSimilarTypes - return lists with similar names; for fun
		 *
		 * @param {Object} cb
		 * @return {Array}
		 * @api public
		 */
		findSimilar: function (cb) {
				return this.model('Link').find({ url: this.url }, cb);
		},
		addList: function (list)  {
			this._lists.push(list);
			this.save();
		},
		removeList: function (list) {
			_.pull(this._lists, list);
			this.save();
		}
};

/**
 * Statics
 */

LinkSchema.statics.load = function (id, cb) {
		this.findOne({
				_id: id
		}).populate('_creator').exec(cb);
};

mongoose.model('Link', LinkSchema);