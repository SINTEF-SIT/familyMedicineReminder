/**
 * User
 *
 * @description :: Model for users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
	  		collections: 'reminders',
	  		via: 'owner'
	  	},

	  	jsonWebToken: {
	      collection: 'jwt',
	      via: 'owner'
    	}
  	}
};