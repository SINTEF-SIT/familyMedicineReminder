/**
 * LinkingRequestController
 *
 * @description :: Server-side logic for managing Linkingrequests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
	createLinkingRequest: function(req, res) {
		requestID = UserService.generateUniqueUserID();
		LinkingRequest.create({
		    patientID:      req.param('withID'),
		    guardianID:     req.param('userID'),
            latestMessage:  'Created linking request'
		})
		.then(function(linkingRequest) {
			sails.log.debug("Created linkingrequest: ", linkingRequest);
            return User.findOne({
                userID:     patientID
            });
        })
        .then(function (user) {
            var patientToken = user.token;
            sails.log(patientToken);
            // send notification to patient.
            NotificationService.sendNotification('linkingRequest', patientToken);
            // patient gets the request.
            // patient sends back boolean confirmation.
            // patient is added as guardians 
			res.send(linkingRequest);
        })
        .catch(function (err) {
            sails.log.error("Could not create linking request: ", err);

        });
	}
};

