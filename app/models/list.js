'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

/**
 * List Schema
 */
var ListSchema = new Schema({
	name: String,
	created: {
		type: Date,
		default: Date.now
	},
	public: {
		type: Boolean,
		default: false
	},
	count : {
		type: Number,
		default: 0
	},
	_creator: {
		type: String, // UserApp user_id
		required: true,
		ref: 'User'
	},
	_items: [{
		type: Schema.ObjectId,
		ref: 'Link'
	}]
});

/**
 * Virtuals
 */


/**
 * Validations
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

/**
 * Pre-save hook
 */
ListSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.name))
		next(new Error('Missing list name'));

	next();
});

/**
 * Middleware
 */

ListSchema.post('save', function (doc) {
  // Populate creatorUsername if empty

  // Increment list count
});

ListSchema.post('remove', function (doc) {
	// Remove self from items _lists
	doc._items.forEach(function (_item) {
		_item.removeList(doc._id);
	})
});


/**
 * Methods
 */
ListSchema.methods = {
	/**
	 * findSimilarTypes - return lists with similar names; for fun
	 *
	 * @param {Object} cb
	 * @return {Array}
	 * @api public
	 */
	findSimilarTypes: function(cb) {
		return this.model('List').find({ name: this.name }, cb);
	},
	/**
	 * addItem - add a link to _items
	 *
	 * @param {Object} cb
	 * @return {Array}
	 * @api public
	 */
	addItem: function(linkID, cb) {
		this._items.push(linkID);
		this.count++;
		this.save(cb);
	 },
	 /**
	 * removeItem - remove a link from _items
	 *
	 * @param {Object} cb
	 * @return {Array}
	 * @api public
	 */
	 removeItem: function(linkID, cb) {
	 	// Find the link in _items and remove
		_.pull(this._items, linkID);
	  this.count--;
	  this.save(cb);
	 }
};

/**
 * Statics
 */

ListSchema.statics.loadAllOfUsers = function(user, cb) {
	this.find({
		_creator: user._id
	}).populate('_creator _items').exec(cb);
};

ListSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('_creator _items').exec(cb);
};

ListSchema.statics.addUncategorized = function(linkID, creator) {
	this.findOne({ name: 'Uncategorized', _creator: creator }, function(err, list) {
		if(err) return console.log(err);
		if(!list) return console.log('No "Uncategorized" list found for user ' + creator);

		list.addItem(linkID);
	});
};

mongoose.model('List', ListSchema);