/**
 * ReminderController
 *
 * @description :: Server-side logic for managing reminders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// Executes when API is called with POST at /user/:userID/reminder
	createReminder: function(req, res) {
		var userID = req.param('id');
		sails.log.info('User ' + userID + ' creates a reminder');

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
		.then(function(reminder) {
			sails.log.info('Created reminder: ', reminder);
			return res.success({ reminderID: reminder.reminderID});
		})
		.catch(function(err) {
			sails.log.error('Could not create reminder: ' + err);
			return res.failure(err);
		});
	},
	getReminders: function(req, res) {
		var userID = req.param('id');
		sails.log.info('User '+ userID +' retrieves all reminders');

		Reminder.find({ userID: userID })
		.then(function(reminders) {
			sails.log.info('Reminders: ', reminders);
			return res.success(reminders);
		})
		.catch(function(err) {
			sails.log.error('Could not retrieve reminders: ' + err);
			return res.failure( {'message' : 'Could not retrieve reminders' });
		});
	},
	// Executes when API is called with PUT at /user/:userID/reminder/:reminderID
	updateReminder: function(req, res) {
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');
		sails.log.info('User '+ userID +' updates reminder ' + reminderID);

		// Modifies :userID's reminder :reminderID 
		// Reminder.update({Find Criteria}, {Updated Records})
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
		.then(function(reminder) {
			sails.log.info('Updated reminder: ' + reminder);
			return res.success(reminder);
		})
		.catch(function(err) {
			sails.log.error('Could not update reminder: ' + err);
			return res.failure( {'message': 'Could not update reminder' });
		});
	},

	deleteReminder: function(req, res) {
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');
		sails.log.info('User ' + userID + ' deletes reminder ' + reminderID + ' ');

		// Reminder.destroy( { Criteria } )
		// Warning: Calling destroy with no criteria as parameter will delete ALL records in table
		Reminder.destroy({ reminderID: reminderID})
		.then(function(reminder){
			if (reminder == '' || reminder == '[]' || reminder == '{}') {
				sails.log.info('No reminder to delete at reminderID = ' + reminderID);
				return res.failure( {'message': 'No reminder to delete at reminderID = ' + reminderID})
			};
			sails.log.info('Deleted reminder: '+ reminder);
			return res.success(reminder);
		})
		.catch(function(err){
			sails.log.error('Could not delete reminder: ' + err);
			return res.failure( {'message': 'Could not delete reminder'} );
		});
	}

};

