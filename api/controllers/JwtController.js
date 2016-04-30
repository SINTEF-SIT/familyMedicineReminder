/**
 * JwtController
 *
 * @description :: Server-side logic for managing Jwts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getJsonWebToken: function(req, res) {
		var userID = req.param('userID');

		Jwt.find({ owner: userID })
		.then(function(jwt) {
			if (typeof jwt === 'undefined') return Promise.reject("No such user with Json web token");
			// sails.log.debug(jwt);
			res.send(jwt);
			sails.log.debug('Delivered Json web token of user '+ userID);
			return Promise.resolve();
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error("Could not retrieve user "+userID+"'s JSON web token:" + err);
			return res.send( {"message" : "Could not retrieve user "+userID+ "'s JSON web token"} );
		});
		
	},

	// Strictly for debugging and admin purposes. Admin-policy to be added for this function
	getAllJsonWebTokens: function(req, res) {

		Jwt.find()
		.then(function(jwt) {
			if (typeof jwt === 'undefined') return Promise.reject('No Json web tokens in database');
			//sails.log.debug(jwt);
			res.send(jwt);
			sails.log("Delivered all Json web tokens");
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error('Could not retrieve all JSON web tokens: ' + err);
			return res.send( {'message' : 'Could not retrieve all JSON web tokens'} );
		});
	},

	// Deletes all JWT of user provided or token associated with this string
	deleteJsonWebToken: function(req, res) {
		var idFromUser = req.param('id');
		var isUser = (idFromUser.length == 5) ? true : false;
		var print = isUser ? ("Deletes all (if any) JWT entries for user"+idFromUser) : "Deletes JWT (if it exists) with id"+idFromUser;
		sails.log('Id:',idFromUser,'isUser:',isUser);
		if (isUser){
			Jwt.destroy({owner: idFromUser})
			.then(function(jwt){
				if (typeof jwt[0] === 'undefined') return Promise.reject('No JWT to delete');
				
				// Seems all went well
				var returnString = (jwt.length > 1) ? (jwt.length,'JWT entries was deleted') : '1 JWT entry was deleted';
				sails.log(returnString);
				res.send({'message': returnString});
			})
			.catch(function(err){
				sails.log.error('Could not delete JWT of user',idFromUser);
				return res.send({'message': 'Could not delete JTW of user'});
			});
		} else {
			Jwt.destroy({token: idFromUser})
			.then(function(jwt){
				if (typeof jwt[0] === 'undefined') return Promise.reject('No JWT to delete');
				
				// Seems all went well
				var returnString = 'JWT entry was deleted';
				sails.log(returnString);
				res.send({'message': returnString});
			})
			.catch(function(err){
				sails.log.error('Could not delete JWT with this id');
				return res.send({'message': 'Could not delete JTW with this id'});
			});
		}
	}
};

