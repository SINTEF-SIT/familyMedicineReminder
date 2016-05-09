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
			days: 			req.body.days,
			medicine: 		req.body.medicine
		})
		.then((reminder) => {
			res.send(reminder.toJSON());
			// Handle possible change notifications to guardian(s) or child
			return NotificationService.handleChangeNotifications(userID, 'Created a new reminder', req);
		})
		.catch(function(err) {
			sails.log.error('Could not create reminder:', err);
			return res.send(err);
		});
	},

	// Executes when API is called with GET at /user/:id/reminder/
	// Gets all the reminders registered to the userID
	getReminders: (req, res) => {
		// Extracts variables from URL
		var userID = req.param('userID');
		sails.log.debug(userID);

		Reminder.find({'ownerId' : userID})
		.populate('medicine')
		.then((reminders) => {
			for (var i = 0; i < reminders.length; i++) {
				if (typeof reminders[i].medicine !== "undefined") {
					reminders[i].medicine = reminders[i].medicine.serverId;
				}
			}
			sails.log.debug('Reminders: ', reminders);
			return res.send(reminders);
		})
		.catch( (err) => {
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
		sails.log.debug("1. UserID: " + userID + ", reminderID: " + reminderID);
		// Modifies :userID's reminder :reminderID 
		// Model.update({Find Criteria}, {Updated Records})
		Reminder.update({ serverId: reminderID}, {
			ownerId:  		userID,
			name: 			req.body.name,
			date: 			req.body.date,
			endDate: 		req.body.endDate,
			isActive: 		req.body.isActive,
			dosage: 		req.body.dosage,
			days: 			req.body.days,
			//medicine: 		req.body.medicine  
		})
		// Runs if all went well
		.then(reminders => {
			sails.log.debug("Reminder array: ", reminders);
			if (typeof reminders[0] === 'undefined') {
				return Promise.reject('No such reminder');
			}
			return Reminder.findOne({'serverId' : reminderID}).populate('medicine');
		})
		.then(reminder => {
			reminder.medicine = req.body.medicine;
			reminder.save(err => {
				if(err) return Promise.reject("Could not update medication of reminder");
			});
			return Promise.resolve(reminder);
		})
		.then(reminder => {
			sails.log.debug("Reminder to send: ", reminder);
			res.send(reminder);
			// Handle possible change notifications to guardian(s) or child
			return NotificationService.handleChangeNotifications(userID, 'Changed existing reminder', req);
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
		Reminder.destroy({ serverId: reminderID })
		// Runs if all went well or object is empty
		.then(function(destroyed){
			// Handle empty reminder object (trying to delete non-existing reminder)
			if (typeof destroyed === 'undefined') {
				return Promise.reject('No reminder to delete');
			} else {
				// If all went well
				sails.log.debug('User', userID, 'deletes reminder', destroyed);
				res.send(true);
				return Promise.resolve();
			}
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err){
			sails.log.error('Could not delete reminder:', err);
			return res.send(false);
		});
	}
};

