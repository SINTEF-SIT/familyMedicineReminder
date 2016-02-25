/**
 * Medication.js
 *
 * @description :: Model for representing medications
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		medicationID: {
			type: 'string',
			primaryKey: true,
			unique: true
		},

		name: {
			type: 'string'
		},

		amount: {
			type: 'float'
		},

		unit: {
			type: 'string'
		},

		approved: {
			type: 'boolean',
			defaultsTo: false
		}
		/*reminders: {
			collection: reminder,
			via: medicationID
		}*/
	}
};

