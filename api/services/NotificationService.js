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
		sails.log.info('handleChangeNotifications()');
		// sails.log('User', userID, 'made a change on the childs data:')
		var type = (req.options.model === 'reminder') ? 'remindersChanged' : 'medicationsChanged';
		sails.log.info('type:', type);
		sails.log.info('req.accesses_child:', req.accesses_child);

		if (req.accesses_child){
			return NotificationService.notifyChildOfChange(userID, type, whatChanged, req.body.name, req.send_notification, req.child_token);
		} else {
			return NotificationService.notifyGuardiansOfChange(userID, type, whatChanged, req.body.name);
		}
	},

	notifyChildOfChange: function(userID, type, whatChanged, identifier, wantsNotification, token){
		sails.log('notifyChildOfChange()');
		if (wantsNotification) {
			sails.log.info('whatChanged:',whatChanged,'identifier:',identifier);
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			sails.log.info('body:',body);
			var header = "Guardian has changed your data";
			sails.log("Guardian accesses child", userID, 'and child wants to recieve changeNotification');
			NotificationService.sendNotification(type, null, token, header, body);
			//NotificationService.sendNotification('remindersChanged', null, tokenData[2][i], header, whatChanged);
		} else {
			sails.log("Guardian accesses child", userID, 'BUT child has receiveChangeNotification: false and/or no token');
		}

		// req.send_notification = true;
		// req.accesses_child = true;
		// req.child_token = children[i].token
		
	},

	notifyGuardiansOfChange: function(childID, type, whatChanged, identifier){
		sails.log.info('notifyGuardiansOfChange()');
		UserService.returnGuardianTokenData(childID)
		.then(function(tokenData) {
			// If guardian who wants to receive push and has gcm-token exist: 
			// tokenData == [[guardianID], [receiveChangeNotification], [token]]
			// If user has no guardian and/or no token and/or doesn't want to receive:
			// tokenData == false

			//sails.log('whatChanged: + data:',whatChanged,);

			//sails.log('data:',data);
			sails.log.info('whatChanged:',whatChanged,'identifier:',identifier);
			var body = (typeof identifier === 'undefined') ? whatChanged : whatChanged + ': ' + identifier;
			sails.log.info('body:',body);
			var header = "Your child has made a change";

			// var type = (req.options.model == 'reminder') ? 'remindersChanged' : 'medicationsChanged';

			if (tokenData) {
				for (var i = 0; i < tokenData[0].length; i++){
					NotificationService.sendNotification(type, null, tokenData[2][i], header, whatChanged);
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