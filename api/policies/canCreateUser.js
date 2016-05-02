

module.exports = function(req, res, next) {

	 // If user has token with admin privileges, skip all authentification.
	if (JwtService.hasFullAccess(req.headers.access_token)) {
    	sails.log("Admin granted access to "+req.originalUrl);
		return next();
    }

	var systemCreateSecret = sails.config.globals.createSecret;
	var userCreateSecret = req.headers.create_secret;
	var originalUrl = req.originalUrl;

	var deniedReturn = "Access to "+originalUrl+" denied: Correct credentials for creating user is not provided";

	// Handles non-existing createSecret
	if (typeof userCreateSecret === 'undefined') {
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	} // Handles correct/incorrect input from user
	if (systemCreateSecret === usersCreateSecret) return next();
	else {		
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	}
};
