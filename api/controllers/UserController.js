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
	create: function(req, res) {
		userID = UserService.generateUniqueUserID();
		User.create({
			userID: 	userID,
			username: 	req.body.username,
			password: 	req.body.password
		})
		.then(function(user) {
			sails.log.debug("Created user: ", user);
			res.send(user);
		})
		.catch(function(err) {
			sails.log.error("Could not create user: ", err);
			res.send({ "message" : "Could not create new user" });
		});
	},

	// Executes when API is called with GET at /user/:userID/children
	// Returns all the children of the user specified by 'userID'
	//
	// Fails if no such user exists

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


	// Executes when API is called with POST at /user/:userID/children, with body:
	// childID = 'userID of child'
	// Adds the user specified by childID as a child of the user specified by userID
	//
	// Fails if childID is already a child of userID or something went wrong when saving

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
			user.save(function(err) {
				if (err) 	return Promise.reject("Error when saving child");
			});
			res.send({"message": "Child was added"});
			sails.log.debug(userID, "added ", childID, "as a child")
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error("Could not add child: ", err);
			return res.send({"message" : err});
		});
	}
};