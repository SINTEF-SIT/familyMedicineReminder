 /**
 * ReminderController
 *
 * @description :: Server-side logic for managing reminders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// Executes when API is called with POST at /user/:userID/reminder
	// Creates new reminder on gived userID, and 
	createReminder: function(req, res) {
		// Extracts variable from URL
		sails.log.debug('in create reminder');
		var userID = req.param('userID');
		sails.log.info('User ' + userID + ' creates a reminder');

		// Model.create( { Record(s) to Create } )
		// Creates an object of the model with the given attributes

		Reminder.create({
			ownerId:  		userID,
			name: 			req.body.name,
			date: 			req.body.date,
			endDate: 		req.body.endDate,
			isActive: 		req.body.active,
			dosage: 		req.body.dosage,
			days: 			req.body.days 
		})
		.then(function(reminder) {
			if(typeof medication === "undefined") {
				return Promise.resolve(reminder);
			}
			return Medication.findOne({'ownerId' : userID, 'serverId' : req.body.medicine })
			.populate('reminders')
			.then(medication => {
				sails.log.debug(medication);
				medication.reminders.add(reminder.serverId);
				medication.save(err => {
					if (err) return Promise.reject("Error associating medication with reminder.");
					else Promise.resolve(reminder);
				});
			});
		})
		.then((reminder) => {
			res.send(reminder.toJSON());
		})
		.catch(function(err) {
			sails.log.error('Could not create reminder:', err);
			return res.send(err);
		});
	},

	// Executes when API is called with GET at /user/:id/reminder/
	// Gets all the reminders registered to the userID
	getReminders: function(req, res) {
		// Extracts variables from URL
		var userID = req.param('userID');

		sails.log.debug('User '+ userID +' retrieves all reminders');

		// Model.find( { Criteria } )
		// Finds all objects satisfying the criteria
		Reminder.find({ ownerId: userID })
		// Runs if all went well
		.then(function(reminders) {
			sails.log.debug('Reminders: ', reminders);
			return res.send(reminders);
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not retrieve reminders: ' + err);
			return res.send( {'message' : 'Could not retrieve reminders' });
		});
	},

	// Executes when API is called with PUT at /user/:userID/reminder/:reminderID
	// Modifies already existing reminders
	updateReminder: function(req, res) {
		// Extracts variables from URL
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');

		sails.log.debug('User '+ userID +' updates reminder ' + reminderID);

		// Modifies :userID's reminder :reminderID 
		// Model.update({Find Criteria}, {Updated Records})
		Reminder.update({ reminderID: reminderID}, {
			ownerId:  		userID,
			name: 			req.body.name,
			date: 			req.body.date,
			endDate: 		req.body.endDate,
			isActive: 		req.body.active,
			dosage: 		req.body.dosage,
			days: 			req.body.frequency
		})
		// Runs if all went well
		.then(function(reminder) {
			if (typeof reminder === 'undefined')	return Promise.reject('No such reminder');
			sails.log.debug('Updated reminder: ' + reminder);
			return res.send({'message' : 'reminder updated successfully'});
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not update reminder:', err);
			return res.send( {'message': err} );
		});
	},

	// Executes when API is called with DELETE at /user/:userID/reminder/:reminderID
	// Deletes the reminder at given reminderID
	deleteReminder: function(req, res) {
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');

		// Model.destroy( { Criteria } )
		// Warning: Calling destroy with no criteria as parameter will delete ALL records in table
		Reminder.destroy({ reminderID: reminderID})
		// Runs if all went well or object is empty
		.then(function(reminder){
			// Handle empty reminder object (trying to delete non-existing reminder)
			if (typeof reminder[0] === 'undefined') return Promise.reject('No reminder to delete');
			// If all went well
			sails.log.debug('User', userID, 'deletes reminder', reminderID);
			return res.send( {'message' : 'Reminder successfully deleted.'} );
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err){
			sails.log.error('Could not delete reminder:', err);
			return res.send( {'message': err} );
		});
	}
};

