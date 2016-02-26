/**
 * MedicationController
 *
 * @description :: Server-side logic for managing medications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	add: function(req,res) {
		
		//var userID = req.params(id);

		/*
		*  Validations
		*/

		if (!req.body.name) 	return res.failure("The medication has to have a name.");
		if (!req.body.amount) 	return res.failure("The medication needs an amount.");
		if (!req.body.unit) 	return res.failure("The medication has to have a dosage unit.");

		if (ValidationService.validMedicationUnits.indexOf(req.body.unit) === -1) {
			return res.failure(req.body.unit + " is not a valid unit");
		}

		Medication.create({
			name: 	req.body.name,
			amount: req.body.amount,
			unit: 	req.body.unit
		})
		.then(function(medication) {
			sails.log.info("Created medication", medication);
			return res.success();
		})
		.catch(function(err) {
			sails.log.error("Could not create medication", err);
			return res.error("Internal server error when adding medication");
		});
	},

	get: function(req, res) {
		Medication.find()
		.then(function(medications) {
			sails.log.info("God medications: ", medications);
			return res.success(medications);
		})
		.catch(function(err) {
			sails.log.error(err);
			return res.error("Internal server error when retrieving medications.");
		});
	}
};

