/**
 * MedicationController
 *
 * @description :: Server-side logic for managing medications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	add: function(req,res) {
		//var userID = req.params(id);

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
			sails.log.err("Could not create medication", err);
			return res.error({ "message" : "Could not create medication" });
		});
	},

	get: function(req, res) {
		Medication.find()
		.then(function(medications) {
			return res.success(medications);
		})
		.catch(function(err) {
			return res.error({message: err });
		});
	}
};

