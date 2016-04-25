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
            // send notification to patient about incoming linkin request.
            NotificationService.sendNotification('linkingRequest', patientToken);
            var m = {"message" : "Successfully sent linking request to patient."};
            res.send(m);
        })
        .catch(function (err) {
            sails.log.error("Could not create linking request: ", err);
            var m = {"message" : "Could not send linking request to patient."};
            res.send(m);
        });
	},
    
	responseToLinkingRequest: function(req, res) {
		LinkingRequest.findOne({patientID: req.param('userID')})
		.then(function(linkingRequest) {
            sails.log("RESPONSETOLINKING: " + req.param('userID'));
            sails.log("RESPONSETOLINKING: " + req.param('response'));
            var userPromises = []; 
            userPromises.push(User.findOne({
                userID:     linkingRequest.patientID
            }));
            userPromises.push(User.findOne({
                userID:     linkingRequest.guardianID
            }));
            return Promise.all(userPromises);
        })
        .then(function (users) {
            var patient = users[0];
            var guardian = users[1];
            var guardianToken = guardian.token;
            sails.log(guardianToken);
            
            if (req.param('response') === 'accept') {
                return User.findOne({userID : guardian.userID})
                .populate('children')
                .then(function(guardian) {
                    guardian.children.add(patient.userID);
                    guardian.save(function(err) {
                        if (err) Promise.reject("Could not save child");
                    });
                    NotificationService.sendNotification('positiveLinkingResponse', guardianToken);      
                });  
            } else {
                NotificationService.sendNotification('negativeLinkingResponse', guardianToken);
                return Promise.resolve();
            }
        })
        .catch(function (err) {
            sails.log.error("Could not create linking request: ", err);
        });
	}  
};

