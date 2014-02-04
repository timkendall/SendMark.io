'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
    provider: String,
    id: {type: String, index: {unique: true, dropDups: true}},
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
    _raw: { /* raw UserApp User profile */ }
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
    }
};

/**
 * Statics
 */
UserSchema.statics.load = function(id, cb) {
    this.findOne({
        id: id
    }).exec(cb);
};
/*
UserSchema.statics.returnObjectID = function(id, cb) {
    this.findOne({
        id: id
    }).exec(cb);
};*/

mongoose.model('User', UserSchema);