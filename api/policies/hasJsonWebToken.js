//'use strict';
/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

 var moment = require('moment');

module.exports = function(req, res, next) {
    // sails.log('Policy: hasJsonWebToken');
    var accessToken = req.headers.access_token;
    // sails.log('accessToken:', accessToken);
    var userID = req.headers.user_id;
    // sails.log('userID:', userID);
    var model = req.options.model + 'Controller';
    var originalUrl = req.originalUrl;

    // Decode the JSON web token using  At the same time it is validated in the module (jwt-simple)
    // for expiry, correct format, signature and algorithm. If an error is thrown by jwt-simple,
    // JwtService.decodeJsonWebToken() catches it and sends the error message here
    var decoded = JwtService.decodeJsonWebToken(accessToken, res);    
    if (decoded.errorCaught){
        var errorReturn = "Access to "+originalUrl+" denied: " + decoded.errorMessage;
        sails.log.error(errorReturn);
        // return res.denied(decoded.errorMessage);
        return res.denied(errorReturn);

    } else var decodedToken = decoded.token;
    
    // Passing the decoded token on in the request object
    // so that later policies don't have to decode again
    req.decoded_token = decodedToken;
    //sails.log('decodedToken:\n',decoded.token);

    // sails.log("REQ");
    // sails.log(req);


    // User-returned text to be changed to more discrete before production.
    // Security message is now very specific for debugging

    // Checks if HTTP header contains 'user_id'
    if (typeof userID === 'undefined') {
        var returnStr = "Access to "+originalUrl+" denied: HTTP header does not contain 'user_id'";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } // Checks if HTTP header contains 'access_token'
    if (typeof accessToken === 'undefined') {
        var returnStr = "Access to "+originalUrl+" denied: HTTP header does not contain 'access_token'";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } // Checks if HTTP header 'user_id' is on the right format
    if (userID.length != 5){
        var returnStr = "Access to "+originalUrl+" denied: HTTP header 'user_id' is on wrong format";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } 
    

    // Check that token has not expired
    // This check is already performed in the decoding-process
    /*if (!JwtService.expiryDateIsInFuture(decodedToken.exp)){
        var returnStr = "Access denied: JSON web token has expired ("+moment(decodedToken.exp)+')';
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } */
    
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