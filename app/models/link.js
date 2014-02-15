'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    apartOfNames: [{
      type: String
    }],
    _apartOf: [{
      type: Schema.ObjectId,
      ref: 'List'
    }],
    tags: [ String ],
    popularity: {
        type: Number,
        default: 0
    },
    creatorEmail: {
        type: String,
        required: true,
    },
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
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.url))
    next(new Error('Missing link URL'));

  var self = this;

  if(!this.apartOfNames) next();
  // Populate _apartOf (list _id's)
  this.apartOfNames.forEach(function( listName, index, array ) {
    mongoose.model('List').findOne( { name: listName, _creator: self._creator }, function( error, list ) {
      if(error) return console.log( error );
      // Create the list if it doesn't exist
      if( !list ) {
        console.log('here');
        var list = new mongoose.model('List')({ name: listName, _creator: self._creator });

        list.save(function( error, list ) {
          if(error) console.log( '!!!!!!: ' + error );
          else self._apartOf.push(list._id);
        });
      }
      console.log("Still doing foreach");
      // Push this list's _id to _apartOf
      self._apartOf.push(list._id);
    });
  });

  next();
});

/**
 * Post-save hook
 */

LinkSchema.post('save', function (doc) {
  console.log('%s has been saved', doc._id);

  // Find categories to push link to
  doc._apartOf.forEach(function( list_id, index, array ) {
    mongoose.model('List').findById( list_id , function( error, list ) {
      if(error) return  console.log( error );
      if(!list) return;

      console.log("Still doing foreach");
      // Push this link to list
      list._items.push(doc_id);
    });

  });
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