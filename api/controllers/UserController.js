/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	*	Anticipates a request with the fields 
	*	userID, username and password. Creates a unique ID 
	**/

	create: function(req, res) {
		userID = UserService.generateUniqueUserID();
		User.create({
			userID: userID,
			username: req.username,
			password: req.password
		})
		.then(function(resolve) {
			res.status(201);
			res.send({
				status: "success",
				data: { userID: userID }
			});
			sails.log.info("Created user: ", resolve);
		})
		.catch(function(err) {
			res.send({
				status: "failure",
				data: {}
			});
			sails.error.info("Could not create user: " + err);
		});
	},

	getChildren: function(req, res) {
		var userID = req.param('id');
		sails.log.info(userID);

		User.find({ userID : userID })
		.then(function(user) {
			res.send({
				status: "success",
				data: user[0].children
			});
		})
		.catch(function(err) {
			res.send({
				status: "failure",
				data: {}
			});
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
				if (err) sails.log.error(err);
				else {
					res.send({
						status: "success",
						data: {}
					});
				}
			});
		})
		.catch(function(err) {
			sails.log.error(err);
			res.send({
				status: "failure",
				data: {}
			});
		});
	}
};





