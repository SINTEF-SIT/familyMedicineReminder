/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

	// This file is default for Sails and uses sessions to validate a user through a login
	// This project does not use this file, but have left it here in case further development
	// wishes to use session-authentification. For us this was unwanted, as we're using a 
	// stateless REST API and session-based authentification wouldn't be appropriate
  
	if (req.session.authenticated) {
	return next();
	}

	// User is not allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	// This project made a custom 'denied' function and not the built-on 'forbidden'
	return res.forbidden('You are not permitted to perform this action.');
};
