/**
 * LinkingRequest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	  	requestID: {
	  		type: 'string',
	  		primaryKey: true,
	  		unique: true
	  	},
    
      patientID: {
	  		type: 'string',
	  	},
      
      guardianID: {
	  		type: 'string',
	  	},
      
      latestMessage: {
        type: 'string'
      }
  }
};

