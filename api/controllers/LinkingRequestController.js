/**
 * LinkingRequestController
 * 
 * FLOW:
 * 1. guardian sends linking request to createLinkingRequest endpoint.
 * 2. server creates linking request object.
 * 3. server sends notification about linking request to patient.
 * 4. patient responds to responseToLinkingRequest endpoint.
 * 5. if response is positive and linkin request exists, server adds patient to guardian.
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
            // patient sends back boolean confirmation to "respondToLinking.
            // patient is added as guardians 
			res.send(linkingRequest);
        })
        .catch(function (err) {
            sails.log.error("Could not create linking request: ", err);

        });
	},
    
	responseToLinkingRequest: function(req, res) {
		LinkingRequest.findOne({patientID: userID})
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

