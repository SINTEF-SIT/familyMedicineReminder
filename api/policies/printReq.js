

module.exports = function(req, res, next) {

	// Print HTTP requests and their headers for debug purposes
	sails.log("HTTP REQUEST HEADER");
	sails.log(JSON.stringify(req.headers));

	// Extensive, full HTTP request
	// sails.log("HTTP REQUEST"); 
	// sails.log(req);

	next();
};
