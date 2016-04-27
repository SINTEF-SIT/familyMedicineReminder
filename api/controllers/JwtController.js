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
		User.find({ userID: userID })
		// Find all jsonWebTokens associated with the user
		.populate('jsonWebToken')
		// If all is well
		.then(function(user) {
			if (typeof user === 'undefined')	return Promise.reject("No such user");
			sails.log.debug(user.jsonWebToken);
			res.send(user.jsonWebToken);
			return Promise.resolve();
		})
		// Triggered by unexpected behaviour or an exception
		.catch(function(err) {
			sails.log.error('Could not retrieve JSON web token(s): ' + err);
			return res.send( {'message' : 'Could not retrieve JSON web token(s):' });
		});
	}
	
};

