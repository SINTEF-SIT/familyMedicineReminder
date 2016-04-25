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
		sails.log.debug('in create reminder');
		var userID = req.param('userID');
		sails.log.info('User ' + userID + ' creates a reminder');

		// Model.create( { Record(s) to Create } )
		// Creates an object of the model with the given attributes
		Medication.findOne({ 'owner' : userID, 'medicationID' : req.body.medicationID })
		.populate('reminders')
		.then(medication => {
			if (typeof medication === 'undefined')	return Promise.reject("No such medication");
			medication.reminders.add({
				'name': 		req.body.name,
				'owner':  		userID,
				'active': 		req.body.active,
				'time': 		req.body.time,
				'amount': 		req.body.amount,
				'unit': 		req.body.unit,
				'frequency': 	req.body.frequency
			});
			medication.save(err => {
				if (err) return Promise.reject("Error saving medication")
			});
			res.send({'message' : 'reminder saved successfully'});
		})		
		// Triggered by unexpected behaviour or an exception
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
		Reminder.find({ owner: userID })
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

