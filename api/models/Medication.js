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

		name: {
			type: 'string',
			required: true
		},

		amount: {
			type: 'float'
		},

		unit: {
			type: 'string',
			enum: ValidationService.validUnits
		},

		approved: {
			type: 'boolean',
			defaultsTo: false
		},

		reminders: {
			collection: 'reminder',
			via: 'medication'
		},

		owner: {
			model: 'user'
		} 
	}
};

