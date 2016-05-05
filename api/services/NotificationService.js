var gcm = require("node-gcm");

module.exports = {

	notificationActions: [
		'remindersChanged',
		'medicationsChanged',
		'linkingRequest',
		'positiveLinkingResponse', 
		'negativeLinkingResponse'
		/*, 'onlineCheck'*/],

	sendNotification: function(type, data, token) {

		if (NotificationService.notificationActions.indexOf(type) < 0) {
			return sails.log.error('Type has to be a property of NotificationService.notificationActions.');
		}

		var sender = new gcm.Sender(sails.config.apiKey);
		var message = new gcm.Message({
		    priority: 'high',
		    contentAvailable: true,
		    delayWhileIdle: true,

		    notification: {
		        title: 	"Updates are available",
		        icon: 	"android_pill",
		        body: 	"There are updates to your data."
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

	notifyGuardiansOfChange: function(childID){
		UserService.returnGuardianTokens(childID, function(tokens){
			// 'tokens' are, if guardian with tokens exist, on the format: [[guardianID], [token]]
			// If user has no guardian and/or no token, 'tokens' is simply 'false'
			
			// sails.log('notifyGuardiansOfChange tokens:', tokens);
			if (tokens) {
				var data = 'Your child '+childID+' has made changes';
				for (var i = 0; i < tokens[1].length; i++){
					sails.log("Sending notification to ",tokens[0][i]);
					NotificationService.sendNotification('medicationsChanged', data, tokens[1][i])
				} sails.log('Notifications sent to guardian(s) of',childID);
			} else {
				sails.log('User has no guardians with token');
			}
		})
	},
}