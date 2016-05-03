

module.exports = function(req, res, next) {

	// Print HTTP requests and their headers for debug purposes
	//sails.log("HTTP REQUEST HEADER");
	//sails.log(JSON.stringify(req.headers));

	// Extensive, full HTTP request
	// sails.log("HTTP FULL");
	// sails.log(req)

	// sails.log("req.originalMethod:",req.originalMethod);
	// sails.log("req.route:",req.route);
	// sails.log("req.options:",req.options);

	// sails.log('OBS: req.originalUrl:',req.originalUrl);
	// sails.log('OBS: req.query:',req.query);
	
	// sails.log("req.params('userID'):",req.params('userID'));
	// sails.log("req.param('userID'):",req.param('userID'));
	// sails.log("_sails:\n",req._sails);

	next();
};
