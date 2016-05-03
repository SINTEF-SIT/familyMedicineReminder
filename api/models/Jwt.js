/**
 * Jwt.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
  	} //,

  	// Should not be possible anyway, but this checks that token is not null
  	/*
  	beforeCreate: function(jwt, cb) {
		if (jwt.token === null) {
			jwt.token = 'Something wrong happend when generating JWT';
			sail.log.error('User',jwt.owner,'has token null. Something went wrong in generating JWT');
		} 

		cb(null, jwt);	
	}
	*/
};

