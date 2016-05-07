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

	notifyGuardiansOfChange: function(childID, whatChanged, identifier){
		UserService.returnGuardianTokenData(childID)
		.then(function(tokenData) {
			// If guardian who wants to receive push and has gcm-token exist: 
			// tokenData == [[guardianID], [receiveChangeNotification], [token]]
			// If user has no guardian and/or no token and/or doesn't want to receive:
			// tokenData == false

			//sails.log('whatChanged: + data:',whatChanged,);

			//sails.log('data:',data);

			var body = whatChanged + ': ' + identifier;

			var header = "Your child has made a change";

			if (tokenData) {
				for (var i = 0; i < tokenData[0].length; i++){
					NotificationService.sendNotification('medicationsChanged', null, tokenData[2][i], header, whatChanged);
					sails.log('User',childID,'sent change-notification to',tokenData[0][i],':',header+': '+body);
				}
			} else {
				sails.log('No change-notification sent');
			}
		})
		.catch(function(err) {
			sails.log.error('An error was caught in NotificationService.notifyGuardiansOfChange:\n', err);
		});
	}
};