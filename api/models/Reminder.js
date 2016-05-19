/**
 * Reminder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	attributes: {
  		serverId: {
  			type: 'integer',
  			primaryKey: true,
  			unique: true,
  			autoIncrement: true
  		},
  		ownerId: {
  			model: 'user'
  		},

      name: {
        type: 'string',
        required: true
      },

      date: {
        type: 'string',
        required: true
      },

      endDate: {
        type: 'string',
        required: true
      },

  		medicine: {
	  		model: 'medication'
	  	},

      dosage: {
        type: 'float'
      },

  		isActive: {
  			type: 'boolean',
        defaultsTo: true
  		}, 

      days: {
        type: 'string',
        defaultsTo: '0000000'
      },

      timeTaken: {
        type: 'string',
        required: true,
        defaultsTo: '0'
      },
      
      hasSentNotification: {
        type: 'boolean',
        defaultsTo: false
      }
  	}
};

