/**
 * ReminderController
 *
 * @description :: Server-side logic for managing reminders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		Reminder.create({
			reminderID: 	req.body.reminderID,
			userID: 		req.body.userID,
			medicationID: 	req.body.medicationID,
			name: 			req.body.name,
			active: 		req.body.active,
			time: 			req.body.time,
			amount: 		req.body.amount,
			unit: 			req.body.unit
		})
		.then(function(reminder) {
			sails.log.info("Created reminder: ", reminder);
			return res.success({ reminderID: reminder.reminderID});
		})
		.catch(function(err) {
			sails.log.error("Could not create reminder: " + err);
			return res.failure(err);
		});
	}
};

