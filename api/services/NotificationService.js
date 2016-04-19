var gcm = require("node-gcm");

module.exports = {

	notificationTypes: ['remindersChanged', 'medicationsChanged', 'linkingRequest'/*, 'onlineCheck'*/],

	sendNotification: function(type, token) {

		if (NotificationService.notificationTypes.indexOf(type) < 0) {
			return sails.log.error('Type has to be a property of NotificationService.notificationTypes.');
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
		    	notificationType: type
		    }
		});

		sender.send(message, {to: token}, function(err, response) {
			if (err) 	sails.log.error("Error with gcm: ", err);
			else 		sails.log.debug(response);
		});
	}
}