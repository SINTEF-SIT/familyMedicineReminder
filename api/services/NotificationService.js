var gcm = require("node-gcm");

module.exports = {

	notificationActions: [
		'remindersChanged',
		'medicationsChanged',
		'linkingRequest',
		'positiveLinkingResponse', 
		'negativeLinkingResponse'
		/*, 'onlineCheck'*/],

	sendNotification: function(type, data, token, title, body) {

		if (NotificationService.notificationActions.indexOf(type) < 0) {
			return sails.log.error('Type has to be a property of NotificationService.notificationActions.');
		}
		var standardTitle = "Updates are available";
		var standartBody = "There are updates to your data";
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

		sender.send(message, {to: token}, function(err, response) {
			if (err) 	sails.log.error("Error with gcm: ", err);
			else 		sails.log.debug(response);
		});
	},

	handleChangeNotifications: function(userID, whatChanged, req) {
		// Handles to types of notification. If a child has created/changed/deleted a medication
		// or reminder, guardian will recieve a change notification (utilizes notifyGuardiansOfChange()).
		// The other type of notification happends if a guardian has changed a childs data. In this 
		// case the child will recieve a push saying guardian made a change (utilizes notifyChildOfChanges())
		sails.log.info('handleChangeNotifications()');
		var type = (req.options.model === 'reminder') ? 'remindersChanged' : 'medicationsChanged';
		sails.log.info('type:', type);
		sails.log.info('req.accesses_child:', req.accesses_child);

		// req.accesses_child is set to true (conversely false) if a guardian changes a child's data
		// This and other attributes are also created and set in isOwnerOrGuardian policy
		if (req.accesses_child){
			// The request object is utilized to limit number of DB calls. The attributes have different purpose
			// req.body.name = the user input name of the reminder or medication
			// req.send_notification = boolean checking if user (child) in settings has changed receiveChangeNotification = true
			// req.child_token = the childs Google Cloud Messaging (GCM) token for sending push notification
			return NotificationService.notifyChildOfChange(userID, type, whatChanged, req.body.name, req.send_notification, req.child_token);
		} else {
			// If user accesses their own data; receiveChangeNotification, GCM token and relating data will be 
			// checked in UserService function utilized by notifyGuardiansOfChange
			return NotificationService.notifyGuardiansOfChange(userID, type, whatChanged, req.body.name);
		}
	},

	notifyChildOfChange: function(userID, type, whatChanged, identifier, wantsNotification, token){
		sails.log('notifyChildOfChange()');

		// Does the child have receiveChangeNotification = true? The value is true på default, but can be changed
		if (wantsNotification) {
			// Text-body of the push notification
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			//sails.log.info('body:',body);
			// Text-header of the push notification
			var header = "Guardian has changed your data";
			sails.log("Guardian accesses child", userID, 'and child wants to recieve changeNotification');
			NotificationService.sendNotification(type, userID, token, header, body);
		} else {
			sails.log("Guardian accesses child", userID, 'BUT child has receiveChangeNotification: false and/or no token');
		}
	},

	notifyGuardiansOfChange: function(childID, type, whatChanged, identifier){
		sails.log.info('notifyGuardiansOfChange()');
		UserService.returnGuardianTokenData(childID)
		.then(function(tokenData) {
			// If guardian who wants to receive push and has gcm-token exist: 
			// tokenData == [[guardianID], [receiveChangeNotification], [token]]
			// If user has no guardian and/or no token and/or doesn't want to receive:
			// tokenData == false

			sails.log.info('whatChanged:',whatChanged,'identifier:',identifier);
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			sails.log.info('body:',body);
			var header = "Your child has made a change";

			if (tokenData) {
				for (var i = 0; i < tokenData[0].length; i++){
					NotificationService.sendNotification(type, childID, tokenData[2][i], header, whatChanged);
					sails.log('User',childID,'sent change-notification to',tokenData[0][i],':',header+': '+body);
				} 
			} else {
				sails.log('No change-notification sent');
			}
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error('An error was caught in NotificationService.notifyGuardiansOfChange:\n', err);
		});
	}
};