

module.exports = function(req, res, next) {

	var allowedTokens = sails.config.globals.adminTokens;
	var accessToken = req.headers.access_token;
	var originalUrl = req.originalUrl;
	var deniedReturn = "Access to "+originalUrl+" denied: This user don't have access";
	
	if (JwtService.hasFullAccess(accessToken)) {
		sails.log("Admin granted access to "+originalUrl);
		return next();
	} return res.denied(deniedReturn);
	

};
