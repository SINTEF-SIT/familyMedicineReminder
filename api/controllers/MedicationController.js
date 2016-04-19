/**
 * MedicationController
 *
 * @description :: Server-side logic for managing medications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// Executes when API is called with POST at /user/:userID/medication
	// Returns all the medications of the user specified by 'userID'
	//
	// Fails if no such user exists or an error occurred when saving the user

	add: function(req,res) {	
		var userID = req.param('userID');

		/*
		*  Validations
		*/

		if (!req.body.name) 	return res.failure("The medication has to have a name.");
		if (!req.body.amount) 	return res.failure("The medication needs an amount.");
		if (!req.body.unit) 	return res.failure("The medication has to have a dosage unit.");

		if (ValidationService.validUnits.indexOf(req.body.unit) === -1) {
			return res.failure(req.body.unit + " is not a valid unit");
		}

		User.findOne({'userID' : userID})
		.populate('medications')
		.then(function(user) {
			if (typeof user === 'undefined')	return Promise.reject("No such user");
			user.medications.add({
				name: 	req.body.name,
				amount: req.body.amount,
				unit: 	req.body.unit
			});
			user.save(function(err) {
				if (err)	return Promise.reject("Error when saving user.");
			})
			res.send({'message': 'medication saved successfully'});
		})
		.catch(function(err) {
			sails.log.error(err);
			res.send({"message" : err});
		});
	},

	get: function(req, res) {
		var userID = req.param('userID');

		User.findOne({'userID' : userID})
		.populate('medications')
		.then(function(user) {
			if (typeof user === 'undefined')	return Promise.reject("No such user");
			sails.log.debug(user);
			res.send({"medications" : user.medications});
			return 
		})
		.catch(function(err) {
			sails.log.error(err);
			return res.send({"message" : err});
		});
	}
};