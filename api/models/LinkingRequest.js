/**
 * LinkingRequest.js
 *
 * @description :: A linking request is created in LinkingRequestController.createLinkingRequest, when a 
 				   user presses the sync button in the client. A LinkingRequest model is deleted once another
 				   user acceptes or denies linking.
 				   Relations:
 				   1-1 with patient user
 				   1-1 with guardian user
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

