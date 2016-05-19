var gcm = require("node-gcm");

module.exports = {

	// Different 'types' is handled differently in the client. Eg. a 'reminderChanged' 
	// will create a push notification that takes the user to reminders, when pressed
	notificationActions: [
		'remindersChanged',
		'medicationsChanged',
		'linkingRequest',
		'positiveLinkingResponse', 
		'negativeLinkingResponse',
		'childForgotReminder'
		/*, 'onlineCheck'*/],

	sendNotification: function(type, data, token, title, body) {

		if (NotificationService.notificationActions.indexOf(type) < 0) {
			return sails.log.error('Type has to be a property of NotificationService.notificationActions.');
		}

		// The servers Google Cloud Messaging API-key 
		var sender = new gcm.Sender(sails.config.apiKey);
		var message = new gcm.Message({
		    priority: 'high',
		    contentAvailable: true,
		    delayWhileIdle: true,

		    notification: {
		        title: 	title,
		        icon: 	"android_pill",
		        body: 	body
		    },
		    data: {
		    	"notification-action": type,
				"data": data
		    }
		});
		// Send and logs the response from Google Cloud Messaging. Typical successful reponse:
		// { multicast_id: 7479355187966268000,
		//   success: 1,
		//   failure: 0,
		//   canonical_ids: 0,
		//   results: [ { message_id: '0:1462795956696268%b44822b1b44822b1' } ] }
		sender.send(message, {to: token}, function(err, response) {
			if (err) 	sails.log.error("Error with gcm: ", err);
			else 		sails.log.debug(response);
		});
	},

	handleChangeNotifications: function(userID, whatChanged, req) {
		// Handles two types of notification. If a child has created/changed/deleted a medication
		// or reminder, guardian will recieve a change notification (utilizes notifyGuardiansOfChange()).
		// The other type of notification happends if a guardian has changed a childs data. In this 
		// case the child will recieve a push saying guardian made a change (utilizes notifyChildOfChanges())
		
		// sails.log.info('handleChangeNotifications()');
		
		// Type can either be type 'remindersChanged' or 'medicationsChanged'
		var type = (req.options.model === 'reminder') ? 'remindersChanged' : 'medicationsChanged';
		// sails.log.info('type:', type);
		// sails.log.info('req.accesses_child:', req.accesses_child);

		// req.accesses_child is set to true (conversely false) if a guardian changes a child's data
		// This and the attributes below are created and set in the isOwnerOrGuardian policy
		if (req.accesses_child){
			// The request object is utilized to limit number of DB calls. The attributes have different purpose:
			//  req.body.name          = user-input name of the reminder/medication. will be 'undefined' when deleting reminder/medication
			//  req.wants_notification = receiveChangeNotification in the user model. true by default, can be changed in app settings
			//  req.child_token        = the childs Google Cloud Messaging (GCM) token for sending push notification
			return NotificationService.notifyChildOfChange(userID, type, whatChanged, req.body.name, req.wants_notification, req.child_token);
		} else {
			// If user accesses their own data; receiveChangeNotification, GCM token and relating data will be 
			// checked in UserService function utilized by notifyGuardiansOfChange
			// req.accesses_child will also be set to false
			return NotificationService.notifyGuardiansOfChange(userID, type, whatChanged, req.body.name);
		}
	},

	notifyChildOfChange: function(userID, type, whatChanged, identifier, wantsNotification, token){
		// Sends notification to child when a guardian has created/changed/deleted data in their account
		// sails.log('notifyChildOfChange()');

		// Does the child have receiveChangeNotification = true? The value is true by default, but can be changed
		if (wantsNotification) {
			// Text-header of the push notification
			var header = "Guardian has changed your data";
			// Text-body of the push notification. If user has deleted reminder/medication, identifier (req.body.name) will be 'undefined'
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			//sails.log.info('body:',body);
			sails.log("Guardian changes child " + userID + "'s data and sends change-notification");
			return NotificationService.sendNotification(type, userID, token, header, body);
		} else {
			// In case child has actively turned off 'receiveChangeNotification' in app settings. Or the child 
			// has not yet been associated with a GCM token (propably due to connection-problems after user creation)
			sails.log("Guardian changes child " + userID + "'s data BUT child can't receive and/or doesn't want change-notification");
		}
	},

	notifyGuardiansOfChange: function(childID, type, whatChanged, identifier){
		// Sends notification to guardians, when child has created/changed/deleted reminder or data

		// sails.log.info('notifyGuardiansOfChange()');
		UserService.returnGuardianTokenData(childID)
		.then(function(tokenData) {
			// If guardian who wants to receive push and has gcm-token exist: 
			// tokenData == [[guardianID], [receiveChangeNotification], [token]]
			// If user has no guardian and/or no token and/or doesn't want to receive:
			// tokenData == false

			// If user has deleted reminder/medication, identifier (req.body.name) will be 'undefined'
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			// sails.log.info('body:',body);
			var header = "Your child has made a change";

			if (tokenData) {
				// The child might have several guardians. Even if it's only one, data is still in array
				for (var i = 0; i < tokenData[0].length; i++){
					NotificationService.sendNotification(type, childID, tokenData[2][i], header, whatChanged);
					sails.log('User',childID,'sent change-notification to',tokenData[0][i],':',header+': '+body);
				} 
			} else {
				sails.log("Child "+ userID + " changed data BUT guardian doesn't want and/or can't receive change-notification");
			} // All is good
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error('An error was caught in NotificationService.notifyGuardiansOfChange:\n', err);
		});
	}
};