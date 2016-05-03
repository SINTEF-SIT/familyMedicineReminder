/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 *	TODO: Remove blueprint routes
 *	TODO: Add more informative error messages
 *  TODO: More comments 
 *
 */

module.exports = {

	/**
	*	Anticipates a request with the fields 
	*	userID, username and password. Creates a unique ID 
	**/

	// Should add function for user to set their own password
	// and posibility to "name" children using 'username' attribute?


	create: function(req, res) {
		userID = UserService.generateUniqueUserID();
				
		UserService.generateRandomHexSequence(function(pw) {
			var jwtToken = JwtService.encodeJsonWebToken(userID);
			User.create({
				userID: 	userID,
				username: 	req.body.username,
				password: 	pw,
				userRole:	req.body.userRole
			})
			.populate('jsonWebToken')
			.then(user => {
				user.jsonWebToken.add({
				token: 		jwtToken.token,
				expiry:		jwtToken.expires
				});
				user.save(err => {
					if (err) return Promise.reject("Error saving jsonWebToken");
				});
				// The user somehow has to recieve the plaintext password
				res.send(user);
				sails.log.debug("Created user: ", user);
				return Promise.resolve();
				// return user.save(function(err){
				// 		if (err) return Promise.reject("Could not save jwtToken");
			})
			.catch(function(err) {
				sails.log.error("Could not create user: ", err);
				res.send({ "message" : "Could not create new user" });
			}); 
		});
	},

	/**
	*	Executes when API is called with GET at /user/:userID/children
	*	Returns all the children of the user specified by 'userID'
	*	Fails if no such user exists
	**/
	getChildren: function(req, res) {
		var userID = req.param('userID');

		User.findOne({ userID : userID })
		.populate('children')
		.then(function(user) {
			if (typeof user === 'undefined') {
				return Promise.reject("No such user");
			}
			res.send(user.children); //Should maybe avoid sending passwords here
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error("Could not get children:", err);
			return res.send({ "message" : err });
		});
	},

	/**
	*	Executes when API is called with POST at /user/:userID/children, with body:
	*	childID = 'userID of child'
	*	Adds the user specified by childID as a child of the user specified by userID
	*	Fails if childID is already a child of userID or something went wrong when saving
	**/
	addChild: function(req, res) {
		var userID = req.param('userID');
		var childID = req.body.childID;

		User.findOne({ userID: userID })
		.populate('children')
		.then(function(user) {
			if (user.children.every(child => child.userID !== childID)) {
				return Promise.resolve(user);
			}
			return Promise.reject("User is already a child");
		})
		.then(function(user) {
			user.children.add(childID);
			user.save(function(err, user) {
				if (err) 	return Promise.reject(err);
				sails.log.debug(user);
			});
			res.send({"message": "Child was added"});
			sails.log.debug(userID, "added", childID, "as a child");
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error("Could not add child: ", err);
			return res.send({"message" : err});
		});
	},
	
	/**
	*	Executes when API is called with PUT at /user/:userID/token/:token
	*	Fills the token field of a user with the specified token.
	
	*	Fails if no such user exists
	**/
	associateToken: function(req, res) {
		var userID = req.param('userID');
		var token = req.param('token');

		User.update({ userID: userID }, {token : token})
		.then(function(user) {
			res.send({"message": "Token was added"});
			sails.log.debug(userID, " added his token: ", token);
		})
		.catch(function(err) {
			sails.log.error("Could not add token: ", err);
			return res.send({"message" : "could not register token server side" + err});
		});
	},
	
	/**
	*	Executes when API is called with GET at /user/:userID/children
	*	Returns all the children of the user specified by 'userID'
	*	Fails if no such user exists
	**/
	setGracePeriod: function(req, res) {
		var userID = req.param('userID');
		var gracePeriod = req.param('gracePeriod');

		User.update({ userID: userID }, {gracePeriod : gracePeriod})
		.then(function(user) {
			res.send({"message": "gracePerio was set."});
			sails.log.debug(userID, " set gracePeriod: ", gracePeriod);
		})
		.catch(function(err) {
			sails.log.error("Could not set gracePeriod: ", err);
			return res.send({"message" : "could not set gracePeriod server side" + err});
		});
	},

	initReminderSync: function(req, res) {
		var userID = req.param('userID');
		User.findOne({ userID  : userID })
		.then(function(user) {
			NotificationService.sendNotification('remindersChanged', "", user.token);
			sails.log.debug("sent remindersync notifcation to", userID);
			res.send("success");
		})
		.catch(function(err) {
			sails.log.error("Could not send notification", err)
		});
	},

	initMedicationSync: function(req, res) {
		var userID = req.param('userID');
		User.findOne({ userID  : userID })
		.then(function(user) {
			NotificationService.sendNotification('medicationsChanged', "",user.token);
			sails.log.debug("sent medicationsync notifcation to", userID);
			res.send("success");
		})
		.catch(function(err) {
			sails.log.error("Could not send notification", err)
		});
	}
};