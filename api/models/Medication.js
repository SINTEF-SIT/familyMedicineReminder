/**
 * Medication.js
 *
 * @description :: Model for representing medication. A medication must be associated with a user,
 				   but doesn't have to associated with a reminder. But it can be linked to several
 				   reminders - meaning a medication can have zero or unlimited reminders. Attribute
 				   'unit' has to one of the values in ValidationService.validUnits, error occurs 
 				   otherwise. Relations:
 				   1-1 with user
 				   0-N with reminder
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		serverId: {
			type: 'int',
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

		count: {
			type: 'float'
		},

		unit: {
			type: 'string',
			enum: ValidationService.validUnits
		},

		reminders: {
			collection: 'reminder',
			via: 'medicine'
		} 
	}
};

