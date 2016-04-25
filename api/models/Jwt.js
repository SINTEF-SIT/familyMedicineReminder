/**
 * Jwt.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    token: 'string',
	uses: {
	  	collection: 'use',
	  	via: 'jsonWebToken'
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

