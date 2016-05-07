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

	notifyGuardiansOfChange: function(childID, whatChanged){
		UserService.returnGuardianTokenData(childID, function(tokenData){
			// If guardian who wants to receive push and has gcm-token exist: 
			// tokenData == [[guardianID], [receiveChangeNotification], [token]]
			// If user has no guardian and/or no token and/or doesn't want to receive:
			// tokenData == false

			var data = "Your child has made a change: "+whatChanged;
		
			if (tokenData) {
				for (var i = 0; i < tokenData[0].length; i++){
					NotificationService.sendNotification('medicationsChanged', data, tokenData[2][i]);
					sails.log('User',childID,'sent change-notification to',tokenData[0][i],':',data);
				}
			} else {
				sails.log('No change-notification sent');
			}
		});
	}
};