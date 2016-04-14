var gcm = require("node-gcm");

module.exports = {

	sendTest: function() {

		var apiKey = "AIzaSyARyD62D3oy-1xR4R1PiL1DiX9q-ykfqz0"
		var token = "cVRin0IbVjw:APA91bEgO-6NaW32xai73-YZXCdDMI9EAn0ZmEC4dBmzNEWgJakgEC2iUzc-I8J8wVLhDL6Q5K_eLi-ZjjScZSkaB_H7oA0QWB_WtO7PMd54N7smvJbIBSP1LiTB_TXgkw_FHLCmRiTX";

		var message = new gcm.Message(/*{
		    /*priority: 'high',
		    notification: {
		        title: "Hello, World",
		        icon: "ic_launcher",
		        body: "This is a notification that will be displayed ASAP."
		    }
		}*/);

		var sender = new gcm.Sender(apiKey);

		sender.sendNoRetry(message, {to: token}, function(err, response) {
			if (err) 	sails.log.error("Error with gcm: ", err);
			else 		console.log(response);
		});
	}
}