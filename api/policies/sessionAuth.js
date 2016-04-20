/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {
 
  // User is allowed, proceed to controller
  var is_auth = req.isAuthenticated()
  if (is_auth) return next();
  // User is not allowed
  else return res.redirect("/login");
};

// Old predefined and built-in Sails authentification.
// To be removed when Local authentification works

/*
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
*/