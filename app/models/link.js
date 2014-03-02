'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		List,
		_ = require('lodash');

process.nextTick(function() {
	List = mongoose.model('List');
});

/**
 * List Schema
 */
var LinkSchema = new Schema({
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

	next();
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
		_list.removeItem(doc._id);
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