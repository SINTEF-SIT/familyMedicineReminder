/**
 * JwtController
 *
 * @description :: Server-side logic for managing Jwts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getJsonWebToken: function(req, res) {
		var userID = req.param('userID');
		sails.log.debug('User '+ userID +' retrieves Json web token(s)');

		// Find user satisfying the criteria
		Jwt.find({ owner: userID })
		// If all is well
		.then(function(jwt) {
			if (typeof jwt === 'undefined') return Promise.reject("No such user with Json web token";
			sails.log.debug(jwt);
			res.send(jwt);
			return Promise.resolve();
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error("Could not retrieve user "+userID+"'s JSON web token:" + err);
			return res.send( {"message" : "Could not retrieve user "+userID+ "'s JSON web token"} );
		});
	},

	getAllJsonWebTokens: function(req, res) {
		sails.log("Retrieves all Json web tokens");

		Jwt.find()
		.then(function(jwt) {
			if (typeof jwt === 'undefined') return Promise.reject('No Json web tokens in database');
			sails.log.debug(jwt);
			res.send(jwt);
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error('Could not retrieve all JSON web tokens: ' + err);
			return res.send( {'message' : 'Could not retrieve all JSON web tokens'} );
		})
	}	
};

