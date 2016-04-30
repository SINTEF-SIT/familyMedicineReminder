//'use strict';
/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {

    var accessToken = req.headers.access_token;
    // sails.log('accessToken:', accessToken);
    var userID = req.headers.user_id;
    // sails.log('userID:', userID);
    var model = req.options.model + 'Controller';
    // sails.log('model:', model);


    // User-returned text to be changed to more discrete before production.
    // Security message is now very specific for debugging

    // Checks if HTTP header contains 'user_id'
    if (typeof userID === 'undefined') {
        var returnStr = "Request on "+model+" was denied: HTTP header does not contain 'user_id'";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } // Checks if HTTP header contains 'access_token'
    if (typeof accessToken === 'undefined') {
        var returnStr = "Request on "+model+" was denied: HTTP header does not contain 'access_token'";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } // Checks if HTTP header 'user_id' is on the right format
    if (userID.length != 5){
        var returnStr = "Request on "+model+" was denied: HTTP header 'user_id' is on wrong format";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    }
    
    // Looks for JWT with 'accessToken' string value
    Jwt.findOne({ token: accessToken })
    .then(function(jwt) {
        // sails.log('Jwt model found:\n',jwt);
        
        if (typeof jwt === 'undefined' || jwt.token === null)  return res.denied("Acccess denied: Specified JSON web token does not exist");
        if (jwt.revoked === true)  return res.denied("Access denied: Access from this JSON web token has been revoked");
        //if (expired) 

        sails.log.debug('Access granted: User '+userID+" uses "+model);
        next();   
        return Promise.resolve();
    })
        .catch(function(err) {
        sails.log.error("Access denied: Error occured while authenticating JWT access:", err); //for user "+userID+": " + err);
        return res.denied("Access denied: Error occured while authenticating JWT access for user");
    });

  // Looks if there is a JWT with owners id, and then checks if it matches
  /*Jwt.findOne({ owner: userID })
    .then(function(jwt) {
      sails.log('jwt:',jwt);
      //var userID = jwt.owner;
      if (typeof jwt === 'undefined' || jwt.token === null)  return res.forbidden("Acccess denied: Specified JSON web token does not exist");
      if (jwt.revoked === true)  return res.forbidden("Access denied: Access from this JSON web token has been revoked");
      //if (expired) 
      sails.log('JWT OBJECT FOUND:', jwt);

      if (jwt.token === accessToken) sails.log("BOTH TOKENS ARE EQUAL");
      else sails.log("Tokens are NOT equal");
      
      //sails.log.debug('Access granted: User', userID, "uses "+req.options.model+"Controller");
      sails.log.debug('Access granted: User',userID,'uses '+req.options.model+'Controller');
      next();
      return Promise.resolve();
    })
    .catch(function(err) {
      sails.log.error("Access denied: Error occured while authenticating JWT access:", err); //for user "+userID+": " + err);
      return res.forbidden("Access denied: Error occured while authenticating JWT access for user");
    });
    */

};