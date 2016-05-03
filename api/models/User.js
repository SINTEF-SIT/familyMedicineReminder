/**
 * User
 *
 * @description :: Model for users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

	attributes: {
		
	  	userID: {
	  		type: 'string',
	  		primaryKey: true,
	  		unique: true
	  	},

	  	username: {
	  		type: 'string',
	  		required: false,
	  		unique: false
	  	},

	  	password: {
	  		type: 'string',
	  		required: true
	  	},
		
		userRole: {
	  		type: 'string'
	  	}, 
		  
		//gcm-token for push notifications.
		token: {
	  		type: 'string'
	  	},
		  
		gracePeriod: {
	  		type: 'string'
	  	},

	  	guardians: {
	  		collection: 'user',
	  		via: 'children'
	  	},

	  	children: {
	  		collection: 'user',
	  		via: 'guardians'
	  	},

	  	medications: {
	  		collection: 'medication',
	  		via: 'ownerId'
	  	},

	  	reminders: {
	  		collection: 'reminder',
	  		via: 'ownerId'
	  	},

	  	jsonWebToken: {
	      collection: 'jwt',
	      via: 'owner'
    	},

    	// Remove password before JSON object is printed

	  	toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
  	},

  	// Executes as a new User model is created, before data is input into model
  	beforeCreate: function(user, cb) {
  		// Generates salt
    	bcrypt.genSalt(8, function(err, salt) {
    		// Creates hash based on salt and password
      		bcrypt.hash(user.password, salt, function(err, hash) {
		        if (err) {
		          console.log(err);
		          sails.log(err);
		          cb(err);
		        }else{
		          user.password = hash;
		          sails.log("Password hash generated: ", hash);
		          cb(null, user);
		        }
      		});
    	});
  	}
};