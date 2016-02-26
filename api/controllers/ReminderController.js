/**
 * ReminderController
 *
 * @description :: Server-side logic for managing reminders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// Executes when API is called with POST at /user/:userID/reminder
	// Creates new reminder on gived userID
	createReminder: function(req, res) {
		// Extracts variable from URL
		var userID = req.param('id');
		sails.log.info('User ' + userID + ' creates a reminder');

		// Model.create( { Record(s) to Create } )
		// Creates an object of the model with the given attributes
		Reminder.create({
			reminderID: 	req.body.reminderID,
			userID: 		userID,
			medicationID: 	req.body.medicationID,
			name: 			req.body.name,
			active: 		req.body.active,
			time: 			req.body.time,
			amount: 		req.body.amount,
			unit: 			req.body.unit,
			frequency: 		req.body.frequency  
		})
		// Runs if all went well
		.then(function(reminder) { 
			sails.log.info('Created reminder: ', reminder);
			return res.success({ reminderID: reminder.reminderID});
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not create reminder: ' + err);
			return res.failure(err);
		});
	},

	// Executes when API is called with GET at /user/:id/reminder/
	// Gets all the reminders registered to the userID
	getReminders: function(req, res) {
		// Extracts variables from URL
		var userID = req.param('id');

		sails.log.info('User '+ userID +' retrieves all reminders');

		// Model.find( { Criteria } )
		// Finds all objects satisfying the criteria
		Reminder.find({ userID: userID })
		// Runs if all went well
		.then(function(reminders) {
			sails.log.info('Reminders: ', reminders);
			return res.success(reminders);
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not retrieve reminders: ' + err);
			return res.failure( {'message' : 'Could not retrieve reminders' });
		});
	},

	// Executes when API is called with PUT at /user/:userID/reminder/:reminderID
	// Modifies already existing reminders
	updateReminder: function(req, res) {
		// Extracts variables from URL
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');

		sails.log.info('User '+ userID +' updates reminder ' + reminderID);

		// Modifies :userID's reminder :reminderID 
		// Model.update({Find Criteria}, {Updated Records})
		Reminder.update({ reminderID: reminderID}, {
			reminderID: 	reminderID,
			userID: 		userID,
			medicationID: 	req.body.medicationID,
			name: 			req.body.name,
			active: 		req.body.active,
			time: 			req.body.time,
			amount: 		req.body.amount,
			unit: 			req.body.unit,
			frequency: 		req.body.frequency
		})
		// Runs if all went well
		.then(function(reminder) {
			sails.log.info('Updated reminder: ' + reminder);
			return res.success(reminder);
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not update reminder: ' + err);
			return res.failure( {'message': 'Could not update reminder' });
		});
	},

	// Executes when API is called with DELETE at /user/:userID/reminder/:reminderID
	// Deletes the reminder at given reminderID
	deleteReminder: function(req, res) {
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');
		sails.log.info('User ' + userID + ' deletes reminder ' + reminderID + ' ');

		// Model.destroy( { Criteria } )
		// Warning: Calling destroy with no criteria as parameter will delete ALL records in table
		Reminder.destroy({ reminderID: reminderID})
		// Runs if all went well or object is empty
		.then(function(reminder){
			// Handle empty reminder object (trying to delete non-existing reminder)
			if (reminder == '' || reminder == '[]' || reminder == '{}') {
				sails.log.info('No reminder to delete at reminderID = ' + reminderID);
				return res.failure( {'message': 'No reminder to delete at reminderID = ' + reminderID})
			};
			// If all went well
			sails.log.info('Deleted reminder: '+ reminder);
			return res.success(reminder);
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err){
			sails.log.error('Could not delete reminder: ' + err);
			return res.failure( {'message': 'Could not delete reminder'} );
		});
	}

};

