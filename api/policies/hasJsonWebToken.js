
module.exports = function(req, res, next) {
    // This policy checks if client has provided a valid JSON web token (JWT) in the HTTP request header.
    // If the JWT is on valid format, expiry etc, it is then checked if it's an active token in the database
    // The decoded token is saved in the request object, to be used further in isOwnerOrGuardian policy.

    // If authentication failes, the user-returned message is now very specific for debugging. This should 
    // be changed to more discrete before production, as not to help an attacker understand server stucture

    var accessToken = req.headers.access_token;
    var originalUrl = req.originalUrl;
    var controller = req.options.model + 'Controller';
    
    // Checks if the HTTP header contains an 'access_token'
    if (typeof accessToken === 'undefined') {
        var returnStr = "Access to "+originalUrl+" denied: HTTP header does not contain 'access_token'";
        sails.log.error(returnStr);
        return res.denied(returnStr);
    } 

    // If user has token with admin privileges, bypass all authentication
    if (JwtService.hasFullAccess(accessToken)) return next();

    // Decode the JSON web token using service-function. At the same time it is validated in the module
    // (jwt-simple) for expiry, correct format, signature and algorithm. If an error is thrown by jwt-simple,
    // JwtService.decodeJsonWebToken() catches it, sets errorCaught flag true and sends the error message here
    var decoded = JwtService.decodeJsonWebToken(accessToken, res);
    if (decoded.errorCaught){
        var errorReturn = "Access to "+originalUrl+" denied: " + decoded.errorMessage;
        sails.log.error(errorReturn);
        return res.denied(errorReturn);
    } else var decodedToken = decoded.token;
    var userID = decodedToken.iss;
    // sails.log('userID:', userID);
    
    // Passing the decoded token on in the request object
    // so that later methods don't have to decode again
    req.decoded_token = decodedToken;

    // DEBUGGING TOOLS
    // sails.log("req.decoded_token:\n",req.decoded_token);
    // sails.log('decodedToken:\n',decoded.token);

    // Looks for JWT with 'accessToken' in database
    Jwt.findOne({ token: accessToken })
    .then(function(jwt) {
        // If JWT doesn't exist in the database
        if (typeof jwt === 'undefined' || jwt.token === null)  return res.denied("Acccess to "+originalUrl+" denied: Specified JSON web token does not exist");
        // If JWT is revoked
        if (jwt.revoked === true)  return res.denied("Access to "+originalUrl+" denied: Access from this JSON web token has been revoked");

        sails.log.debug('Access to '+originalUrl+' granted: User '+userID+" uses "+controller);
        next();   
        return Promise.resolve();
    })
    .catch(function(err) {
        sails.log.error("Access to "+originalUrl+" denied: Error occured while authenticating JWT access: "+ err); //for user "+userID+": " + err);
        return res.denied("Access to "+originalUrl+" denied: Error occured while authenticating JWT access for user");
    });

};