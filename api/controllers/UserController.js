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
			sails.log.info("Created user: ", user);
			res.success({ userID: userID });
		})
		.catch(function(err) {
			sails.error.info("Could not create user: ", err);
			res.error("Internal server error when creating user.");
		});
	},

	getChildren: function(req, res) {
		var userID = req.param('id');
		sails.log.info(userID);

		User.find({ userID : userID })
		.then(function(user) {
			return res.success(user[0].children);
		})
		.catch(function(err) {
			sails.error.info("Could not get children: ", err);
			return res.error("Internal server error when retrieving children.");
		});
	},

	addChild: function(req, res) {
		var userID = req.param('id');
		var childID = req.body.childID;

		User.find({ userID: userID })
		.then(function(user) {
			sails.log.info(user);
			user[0].children.add(childID);
			user[0].save(function(err) {
				if (err) 	sails.log.error(err);
				else 		return res.success();
			});
		})
		.catch(function(err) {
			sails.log.error("Could not add child: ", err);
			return res.error("Internal server error when adding child.");
		});
	}
};





