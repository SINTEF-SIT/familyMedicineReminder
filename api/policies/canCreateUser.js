

module.exports = function(req, res, next) {

	var systemCreateSecret = sails.config.local.createSecret;
	var usersCreateSecret = req.headers.create_secret;
	var originalUrl = req.originalUrl;

	var deniedReturn = "Access to "+originalUrl+" denied: Correct credentials for creating user is not provided";

	// Handles non-existing create secret
	if (typeof usersCreateSecret === 'undefined') {
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	} // Handles correct input from user
	if (systemCreateSecret === usersCreateSecret) return next();
	else {		
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	}
};
