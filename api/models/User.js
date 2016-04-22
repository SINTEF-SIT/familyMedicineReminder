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
	  		type: 'string'
	  	},

	  	password: {
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
	  		via: 'owner'
	  	},

	  	reminders: {
	  		collections: 'reminders',
	  		via: 'owner'
	  	},
	  	
	  	toJSON: function() {
      		var obj = this.toObject();
      		delete obj.password;
      		return obj;
    	}
  	},

  	// Executes as a new User model is created, before data is input into model
  	beforeCreate: function(user, cb) {
  		// Generates salt
    	bcrypt.genSalt(10, function(err, salt) {
    		// Creates hash based on salt and password
      		bcrypt.hash(user.password, salt, function(err, hash) {
		        if (err) {
		          console.log(err);
		          sails.log(err);
		          cb(err);
		        }else{
		          user.password = hash;
		          sails.log("Password hash created: ", hash);
		          cb(null, user);
		        }
      		});
    	});
  	}
};