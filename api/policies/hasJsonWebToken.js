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

  //var httpHeaders = JSON.stringify(req.headers);
  //sails.log('HTTP HEADER FROM JWT POLICY: ',httpHeaders);
  var accessToken = JSON.stringify(req.headers.access_token);
  //if (typeof accessToken === 'undefined') return res.forbidden();
  sails.log('accessToken:', accessToken);
  var userID = JSON.stringify(req.headers.user_id);
  sails.log('userID:',userID);
  //sails.log('accessToken2: ', JSON.stringify(req.headers.access_token));
  

  //var userID = req.param.userID;


  /*
  Jwt.find({ owner: userID })
    // If all is well
    .then(function(jwt) {
      if (typeof jwt === 'undefined') return res.forbidden("for");
      sails.log.debug('jwt:')
      sails.log.debug(jwt);
      next();
      return Promise.resolve();
    })
    // Triggered by unexpected behaviour or an exception
    .catch(function(err) {
      sails.log.error("Could not retrieve user "+userID+"'s JSON web token:" + err);
      return res.send( {"message" : "Could not retrieve user "+userID+ "'s JSON web token"} );
    });
  */

  // Looks if there is a JWT with owners id, and then checks if it matches
  Jwt.find({ owner: userID })
    .then(function(jwt) {
      sails.log('jwt:',jwt);
      //var userID = jwt.owner;
      if (typeof jwt[0] === 'undefined' || jwt[0].token === null)  return res.forbidden("Acccess denied: Specified JSON web token does not exist");
      if (jwt[0].revoked === true)  return res.forbidden("Access denied: Access from this JSON web token has been revoked");
      //if (expired) 
      sails.log('JWT OBJECT FOUND:', jwt);

      if (jwt[0].token === accessToken) sails.log("BOTH TOKENS ARE EQUAL");
      else sails.log("Tokens are NOT equal");
      
      //sails.log.debug('Access granted: User', userID, "uses "+req.options.model+"Controller");
      sails.log.debug('Access granted: User uses '+req.options.model+'Controller');
      next();
      return Promise.resolve();
    })
    .catch(function(err) {
      sails.log.error("Access denied: Error occured while authenticating JWT access:", err); //for user "+userID+": " + err);
      return res.forbidden("Access denied: Error occured while authenticating JWT access for user");
    });
    
  /*

  // Looks for JWT with 'accessToken' string value
  Jwt.find( { token: accessToken } )
    .then(function(jwt) {
      sails.log('jwt:',jwt);
      //var userID = jwt.owner;
      if (typeof jwt[0] === 'undefined' || jwt[0].token === null)  return res.forbidden("Acccess denied: Specified JSON web token does not exist");
      if (jwt[0].revoked === true)  return res.forbidden("Access denied: Access from this JSON web token has been revoked");
      //if (expired) 
      
      sails.log.debug('Access granted: User', userID, "uses "+req.options.model+"Controller");
      next();
      return Promise.resolve();
    })
    .catch(function(err) {
      sails.log.error("Access denied: Error occured while authenticating JWT access:", err); //for user "+userID+": " + err);
      return res.forbidden("Access denied: Error occured while authenticating JWT access for user");
    });
    */
};