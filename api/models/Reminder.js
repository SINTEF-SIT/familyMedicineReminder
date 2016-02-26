/**
 * Reminder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	attributes: {
  		reminderID: {
  			type: 'string',
  			primaryKey: true,
  			unique: true,
  			autoIncrement: true
  		},
  		userID: {
  			model: 'User'
  		},
  		medicationID: {
	  		//model: 'medication'
	  	},
  		name: {
  			type: 'string'
  		},
  		active: {
  			type: 'boolean'
  		}, 
	  	
	  	time: {
	  		type: 'datetime'
	  	},
	  	amount: {
	  		type: 'float'
	  	},
	  	unit: {
	  		type: 'string',
	  		enum: ['milliliter', 'pill', 'inhalation', 'mg', 'mcg', 'unit', 'gram']
	  	}
  	}
};
