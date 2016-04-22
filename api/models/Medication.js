/**
 * Medication.js
 *
 * @description :: Model for representing medications
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		medicationID: {
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

