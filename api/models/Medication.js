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
			type: 'string'
		},

		amount: {
			type: 'float'
		},

		unit: {
			type: 'string',
			enum: ['milliliter', 'pill', 'inhalation', 'mg', 'mcg', 'unit', 'gram']
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

