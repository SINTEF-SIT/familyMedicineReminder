/**
 * Jwt.js
 *
 * @description :: Model for representing a JSON Web Token (JWT) used in the authentification process.
 				   It's created and associated with a new user right after its creation in UserController.create.
 				   Token-string is an encrypted JSON object which contains userID, expiry and other attributes.
 				   Relation:
 				   owner: 1-1 with User
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

	    token: {
	    	type: 'string',
	    	primaryKey: true,	
	  		unique: true
	    },
		expiry: {
		  	type: 'string'
		},
		owner: {
			model: 'user',
			required: true
		},
		revoked: {
		  	type: 'boolean',
		  	defaultsTo: false 
		}
  	}
};

