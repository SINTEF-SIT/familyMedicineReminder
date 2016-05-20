

module.exports = function(req, res, next) {
	// This policy is created as a possibility for admin to use all routes and methods in the 
	// API for all users. That way the JWT has access data other than to itself or guardee.
	// The function it uses is in JwtService - this is so that it can be called first in the 
	// other policices to check for admin privileges, as this policy itself can't be called.
	// Approved admin tokens are put in a list in config/jwt.js

	// Token provided by user in request
	var accessToken = req.headers.access_token;
	var originalUrl = req.originalUrl;
	var deniedReturn = "Access to "+originalUrl+" denied: This user don't have access";
	
	if (JwtService.hasFullAccess(accessToken)) {
		sails.log("Admin granted access to "+originalUrl);
		return next();
	} else {
		return res.denied(deniedReturn);
	}
	

};
