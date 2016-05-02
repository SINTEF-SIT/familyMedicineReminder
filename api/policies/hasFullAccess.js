

module.exports = function(req, res, next) {

	var allowedTokens = sails.config.local.adminTokens;
	var accessToken = req.headers.access_token;
	var originalUrl = req.originalUrl;

	sails.log()

	if (allowedTokens.includes(accessToken)) next();
	else return res.denied("Access to "+originalUrl+" denied: This user don't have access");

};
