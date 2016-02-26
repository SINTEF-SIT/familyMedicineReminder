/**
 * Reminder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	attributes: {
  		reminderID: {
  			type: 'integer',
  			primaryKey: true,
  			unique: true,
  			autoIncrement: true
  		},
  		userID: {
  			model: 'User'
  		},
  		medicationID: {
        // Implement once Medication model and logic is
	  		// model: 'medication'
	  	},
  		name: {
  			type: 'string',
        required: true
  		},
  		active: {
  			type: 'boolean',
        defaultsTo: true
  		}, 
	  	
	  	time: {
	  		type: 'datetime'//,
        //required: true
	  	},
	  	amount: {
	  		type: 'float'
	  	},
	  	unit: {
	  		type: 'string',
	  		enum: ['milliliter', 'pill', 'inhalation', 'mg', 'mcg', 'unit', 'gram']
	  	},
      frequency: {
        type: 'string',
        defaultsTo: '0000000'
      }
  	}
};

