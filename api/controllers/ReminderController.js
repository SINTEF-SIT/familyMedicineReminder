/**
 * ReminderController
 *
 * @description :: Server-side logic for managing reminders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// Called when API is requested with POST at /user/:userID/reminder
	createReminder: function(req, res) {
		var userID = req.param('id');
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
			sails.log.info("Created reminder: ", reminder);
			return res.success({ reminderID: reminder.reminderID});
		})
		.catch(function(err) {
			sails.log.error("Could not create reminder: " + err);
			return res.failure(err);
		});
	},
	getReminders: function(req, res) {
		var userID = req.param('id');
		sails.log.info('User "'+ userID +'" retrieves all reminders');

		Reminder.find({ userID: userID })
		.then(function(reminders) {
			sails.log.info('Reminders: ', reminders)
			return res.success(reminders);
		})
		.catch(function(err) {
			sails.error.info("Could not retrieve reminders: " + err);
			return res.failure( {"message" : "Could not retrieve reminders" });
		});
	},

	//update
	//delete

	updateReminder: function(req, res) {
		var userID = req.param('userID');
		var reminderID = req.param('reminderID');
		sails.log.info('User "'+ userID +'" updates reminder "' + reminderID + '".');

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
			sails.log.info('Updated reminder: ', reminder)
			return res.success(reminder);
		})
		.catch(function(err) {
			sails.error.info("Could not update reminder: " + err);
			return res.failure( {"message" : "Could not update reminder" });
		});
	}

};

