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
  }
};

