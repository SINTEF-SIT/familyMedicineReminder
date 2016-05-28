/**
 * Reminder.js
 *
 * @description :: Model for reminder. Created and edited by client in ReminderController.
                   Relation:
                   ownerId: 1-1 with User
                   medicine: 0-1 with Medication
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
      
      // Reset each night in config/schedule.js
      hasSentNotification: {
        type: 'boolean',
        defaultsTo: false
      }
  	}
};

