

module.exports = function(req, res, next) {
	// This policy is created as an admin accessibility to use all routes in the API for all users


	// var allowedTokens = sails.config.globals.adminTokens;
	var allowedTokens = sails.config.jwt.adminTokens;
	var accessToken = req.headers.access_token;
	var originalUrl = req.originalUrl;
	var deniedReturn = "Access to "+originalUrl+" denied: This user don't have access";
	
	if (JwtService.hasFullAccess(accessToken)) {
		sails.log("Admin granted access to "+originalUrl);
		return next();
	} return res.denied(deniedReturn);
	

};
