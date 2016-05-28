

module.exports = function(req, res, next) {
	// To create user, the client has to provide a create_secret in the HTTP header
	// The accepted secret is defined in config.jwt.createSecret.

	 // If user has token with admin privileges, bypass all authentication.
	if (JwtService.hasFullAccess(req.headers.access_token)) {
    	sails.log("Admin granted access to "+req.originalUrl);
		return next();
    }

    // The accepted server-defined secret
	var systemCreateSecret = sails.config.jwt.createSecret;
	// CreateSecret provided by request
	var userCreateSecret = req.headers.create_secret;
	var originalUrl = req.originalUrl;

	var deniedReturn = "Access to "+originalUrl+" denied: Correct credentials for creating user is not provided";

	// Handles non-existing createSecret
	if (typeof userCreateSecret === 'undefined') {
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	} 
	// Handles correct secret
	if (systemCreateSecret === userCreateSecret) {
		return next();
	} else { // Request has defined createSecret, but secret is incorrect
		sails.log.error(deniedReturn);
		return res.denied(deniedReturn);
	}
};
