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
  		ownerID: {
  			model: 'User'
  		},
  		name: {
  			type: 'string'
  		},
  		active: {
  			type: 'boolean'
  		}, 
	  	medicationID: {
	  		model: 'medication'
	  	},
	  	time: {
	  		type: 'datetime'
	  	},
	  	amount: {
	  		type: 'double'
	  	},
	  	unit: {
	  		type: 'string',
	  		enum: ['milliliter', 'pill', 'inhalation', 'mg', 'mcg', 'unit', 'gram']
	  	}
  }
};

