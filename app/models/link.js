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
var validatePresenceOf = function(value) {
		return value && value.length;
};

/**
 * Pre-save hook
 */
LinkSchema.pre('save', function(next) {
	var self = this;

	if (!this.isNew) return next();

	if (!validatePresenceOf(this.url))
		next(new Error('Missing link URL'));

	next();
});

/**
 * Post-save hook
 */

LinkSchema.post('save', function(doc) {
})

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
		findSimilar: function(cb) {
				return this.model('Link').find({ url: this.url }, cb);
		}
};

/**
 * Statics
 */

LinkSchema.statics.load = function(id, cb) {
		this.findOne({
				_id: id
		}).populate('_creator').exec(cb);
};

mongoose.model('Link', LinkSchema);