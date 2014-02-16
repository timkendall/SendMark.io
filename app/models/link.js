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

  // Floating link, no categories
  if(self.apartOfNames.length === 0) next();

  // Populate _apartOf (list _id's)
  this.apartOfNames.forEach(function( listName, index, array ) {
    mongoose.model('List').findOne( { name: listName, _creator: self._creator }, function( error, list ) {
      if(error) return console.log( error );

      // Create the list if it doesn't exist
      if( !list ) {
        console.log('Creating new list for link.');
        list = new List({
          name: listName,
          _creator: self._creator
        });

        // Save new list,
        list.save(function( error, list ) {
          if(error) return console.log( '!!!!!!: ' + error );
        });
      }

      // Add link to list
      self.pushApartOf(list._id);

      console.log('List and link saved and linked.');
    });
  });

  next();
});

/**
 * Post-save hook
 */

LinkSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);

  // Find categories to push link to
  doc._apartOf.forEach(function( listID, index, array ) {
    mongoose.model('List').findById( listID , function( error, list ) {
      if(error) return  console.log( error );
      if(!list) return;

      // Add list to link
      list.pushItem(doc._id);
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
    },
    /**
     * pushApartOf - using
     *
     * @param {Object} cb
     * @return {Array}
     * @api public
     */
     pushApartOf: function(listID, cb) {
      this._apartOf.push(listID);
      this.save(cb);
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