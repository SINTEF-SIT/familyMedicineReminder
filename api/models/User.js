/**
 * User
 *
 * @description :: Model for user. Created in UserController.create. A user is initiated with both guardian
 				   and children attributes, but only uses one of them depending on their userRole conversly.
 				   userRole is either guardian or child (normal user). The password is random-generated,
 				   salted and hashes before saved in passwor attribute. It has no functionality now, but is
 				   included to support further development - especially the ability to delete your user/data
 				   through an website if phone is lost or similar.
 				   Includes user-specific settings modifiable in client settings; receiveChangeNotification
 				   and gracePeriod. These are changed on the server in LinkingRequestController.
 				   
 				   Relations:
 				   guardians: 0-N with User
 				   children: 0-N with User
 				   medication: 0-N with Medication
 				   reminders: 0-N with Reminders
 				   jsonWebToken: 1-1 with Jwt
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
		
		// Can be guardian or child
		userRole: {
	  		type: 'string'
	  	}, 
		  
		//Google Cloud Messaging (GCM) token for push notifications.
		token: {
	  		type: 'string',
	  		required: true,
	  		size: 200,
	  		defaultsTo: 'null'
	  	},
		  
		gracePeriod: {
	  		type: 'string',
	  		defaultsTo: "30"
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

    	receiveChangeNotification: {
    		type: 'boolean',
    		defaultsTo: true
    	},

    	lastSeen: {
    		type: 'string',
    		defaultsTo: 'never'
    	},

    	// Removes password before JSON object is printed
	  	toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
  	},

  	// Executes as a new User model is created, before data is input into model
  	// The function takes the random-generated password given the user, then salt and hashes it
  	beforeCreate: function(user, cb) {
  		// Generates salt - 8 is the number of times it's salted
    	bcrypt.genSalt(8, function(err, salt) {
    		// Creates hash based on salt and password
      		bcrypt.hash(user.password, salt, function(err, hash) {
		        if (err) {
					console.log(err);
					sails.log(err);
					cb(err);
		        } else {
		        	// Overwrite the current password before it's saved in model
					user.password = hash;
					sails.log("Password hash generated: ", hash);
					cb(null, user);
		        }
      		});
    	});
  	}
};