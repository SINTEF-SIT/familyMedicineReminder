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

		if (!req.body.name) {
			sails.log.debug("No name!");
			return res.failure("The medication has to have a name.");
		}
		if (!req.body.count) {
			sails.log.debug("No count!")
			return res.failure("The medication needs an amount.");
		}
		if (!req.body.unit) {
			sails.log.debug("No unit!")
			return res.failure("The medication has to have a dosage unit.");
		}

		if (ValidationService.validUnits.indexOf(req.body.unit) === -1) {
			return res.failure(req.body.unit + " is not a valid unit");
		}

		Medication.create({
			ownerId: 	userID,
			name: 		req.body.name,
			count: 	    req.body.count,
			unit: 		req.body.unit
		})
		.then(function(created) {
			sails.log.debug("Medication created: " + created);
			res.send(created.toJSON());
			// Handle possible change notifications to guardian(s) or child
			NotificationService.handleChangeNotifications(userID, 'Created a new medication', req);
			return Promise.resolve(created);
		})
		.catch(function(err) {
			sails.log.error(err);
			res.send({"message" : "Could not create medication"});
		});
	},

	get: function(req, res) {
		var userID = req.param('userID');

		User.findOne({'userID' : userID})
		.populate('medications')
		.then(function(user) {
			if (typeof user === 'undefined')	return Promise.reject("No such user");
			sails.log.debug(user);
			res.send(user.medications);
			return 
		})
		.catch(function(err) {
			sails.log.error(err);
			return res.send({"message" : err});
		});
	},

	//TODO: Add validations
	put: function (req, res) {
		var userID = req.param('userID');
		var medicationID = req.param('medicationID');

		Medication.update({'serverId' : medicationID}, {
			name: 		req.body.name,
			count: 	    req.body.count,
			unit: 		req.body.unit 
		})
		.then( medication => {
			sails.log.debug("User " + userID + " updated medication " + medication[0]);
			res.send(medication[0]);
			// Handle possible change notifications to guardian(s) or child
			return NotificationService.handleChangeNotifications(userID, 'Changed an existing medication', req);
		})
		.catch(err => {
			sails.log.error(err);
			res.send("Could not save medication");
		});
	},

	delete: function(req, res) {
		var userID = req.param('userID');
		var medicationID = req.param('medicationID');

		Medication.destroy({serverId : medicationID})
		.then(function(destroyed) {
			if (typeof destroyed === 'undefined') {
				return Promise.reject("Could not delete medication: was undefined");
			} else {
				sails.log.debug("User " + userID + " deleted a medication.");
				res.send(true);
				return Promise.resolve();
			}
		})
		.catch(function(err) {
			sails.log.error(err);
			res.send(false);
		});
	}
};