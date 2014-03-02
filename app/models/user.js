'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		List;

process.nextTick(function() {
	List = mongoose.model('List');
});

/**
 * User Schema
 */
var UserSchema = new Schema({
	_id: {type: String, index: {unique: true, dropDups: true}},
	provider: String,
	username: String,
	name: { familyName: String, givenName: String },
	email: String,
	emails: [ { value: String } ],
	permissions: { permissionName: Boolean },
	features: { featureName: Boolean },
	properties: { propertyName: { value: Schema.Types.Mixed, override: Boolean } },
	subscription: { price_list_id: String, plan_id: String, override: Boolean },
	lastLoginAt: Date,
	updatedAt: Date,
	createdAt: Date,
	_raw: { /* raw UserApp User profile */ },
	_lists: [{
		type: Schema.ObjectId,
		ref: 'List'
	}]
});

/**
 * Virtuals
 */


/**
 * Validations
 */

/**
 * Pre-save hook
 */


/**
 * Post-save hook
 */

UserSchema.post('save', function (doc) {
  // Create an 'Uncategorized' List
  List.create({ name: 'Uncategorized', creator: this._id }, function(err, list) {
  	if(err) return console.log(err);
  	doc.addList(list._id);
  });
});

/**
 * Methods
 */
UserSchema.methods = {
		/**
		 * UpdateAll - update all of user's fields
		 *
		 * @param {Object} updatedUser
		 * @return {void}
		 * @api public
		 */
		updateAll: function (updatedUser) {
			for (var field in Schema.paths) {
				if ((field !== '_id') && (field !== '__v')) {
						if (updatedUser[field] !== undefined) {
								this[field] = updatedUser[field];
						}
				}
			}

			this.save();
		},
		/**
		 * loadLists - get user's lists
		 *
		 * @param
		 * @return {void}
		 * @api public
		 */
		loadLists: function(callback) {
			this.populate('_lists', callback);
			return this.lists; // Need to populate
		},
		/**
		 * addList - get user's lists
		 *
		 * @param {string} list _id
		 * @return {void}
		 * @api public
		 */
		addList: function(listID) {
			this._lists.push(listID);
			this.save();
		}

};

/**
 * Statics
 */
UserSchema.statics.load = function(id, cb) {
		this.findOne({
				_id: id
		}).exec(cb);
};
/*
UserSchema.statics.returnObjectID = function(id, cb) {
		this.findOne({
				id: id
		}).exec(cb);
};*/

mongoose.model('User', UserSchema);