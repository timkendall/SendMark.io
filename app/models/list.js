'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * List Schema
 */
var ListSchema = new Schema({
    name: String,
    creatorUsername: String,
    _creator: {
        type: String, // UserApp user_id
        required: true,
        ref: 'User'
    },
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
    else
        next();
});
/**
 * Post-save hook
 */

ListSchema.post('save', function (doc) {
  // Populate creatorUsername if empty

  // Increment list count
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
    }
};

/**
 * Statics
 */

ListSchema.statics.loadAllOfUsers = function(user, cb) {
    console.log(user.username);

    this.find({
        creatorUsername: user.username
    }).populate('_creator _items').exec(cb);
};

ListSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('_creator _items').exec(cb);
};

mongoose.model('List', ListSchema);