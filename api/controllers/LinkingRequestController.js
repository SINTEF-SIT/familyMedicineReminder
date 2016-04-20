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
            requestID:      requestID,
		    patientID:      req.param('withID'),
		    guardianID:     req.param('userID'),
            latestMessage:  'Created linking request'
		})
		.then(function(linkingRequest) {
            sails.log("1 linkingrequest.patientID: " + linkingRequest.patientID);
			sails.log.debug("2 Created linkingrequest: ", linkingRequest);
            return User.findOne({
                userID:     linkingRequest.patientID
            });
        })
        .then(function (user) {
            sails.log.debug("3 user: " + user);
            var patientToken = user.token;
            sails.log(patientToken);
            // send notification to patient.
            NotificationService.sendNotification('linkingRequest', patientToken);
            // patient gets the request.
            // patient sends back boolean confirmation to "respondToLinking.
            // patient is added as guardians 
        })
        .catch(function (err) {
            sails.log.error("Could not create linking request: ", err);

        });
	},
    
	responseToLinkingRequest: function(req, res) {
		LinkingRequest.findOne({patientID: userID})
		.then(function(linkingRequest) {
            sails.log("RESPONSETOLINKING: " + req.param('userID'));
            sails.log("RESPONSETOLINKING: " + req.param('response'));
            var users = []; 
            var patient = User.findOne({
                userID:     linkingRequest.patientID
            });
            var guardian = User.findOne({
                userID:     linkingRequest.guardianID
            });
            users.push(patient, guardian);
            return users;
        })
        .then(function (users) {
            var patientToken = user.token;
            sails.log(patientToken);
            // send notification to patient.
            NotificationService.sendNotification('positiveLinkingResponse', patientToken);
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

