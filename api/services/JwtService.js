var jwt = require('jwt-simple');
var uuid = require('node-uuid');
var moment = require('moment');

module.exports = {

	encodeJsonWebToken: function(userID){
		//sails.log("Service: generateJsonWebToken()");
		var config = sails.config.jwt;

	    var expiryUnit = config.expiry.unit || 'days';
	    //sails.log('expiryUnit: ', expiryUnit);
	    var expiryLength = config.expiry.length || 1000;
	    //sails.log('expiryLength: ', expiryLength);

	    var expires = moment().add(expiryLength, expiryUnit);
	    var expiresMS = expires.valueOf()/1000; // Should be in seconds
	    var expiresFormat = expires.format()
	    sails.log('expiresFormat:', expiresFormat)
	    sails.log('expiresMS: ', expiresMS);

	    var issued = Date.now()/1000; // Should be in seconds - otherwise milliseconds since 1970 00:00
	    //var user = user; // || req.session.user;

	    // Maybe the plaintext password should be included in the encoded token?

		var decodedToken = {
	      iss: userID, // + '|' + req.remoteAddress,
	      sub: config.subject,
	      aud: config.audience,
	      exp: expiresMS,
	      nbf: issued,
	      iat: issued,
	      jti: uuid.v1(),
	    };

	    sails.log('Decoded token:');
	    sails.log(decodedToken);

	    var token = jwt.encode(decodedToken, config.secret);

	    /*var token = jwt.encode({
	      iss: userID, // + '|' + req.remoteAddress,
	      sub: config.subject,
	      aud: config.audience,
	      exp: expiresMS,
	      nbf: issued,
	      iat: issued,
	      jti: uuid.v1()
	    }, config.secret);*/

	    sails.log('Encoded token:');
	    sails.log(token);

	    return {
	      token: token,
	      expires: expiresFormat
	    };
	  },

	  decodeJsonWebToken: function(token){
	  		// handle expiry problems here?
	  		try{
	  			var decodedToken = jwt.decode(token, sails.config.jwt.secret);
	  		} catch (err) {
	  			// If the accessToken passes the formating test of the decoder (3 segments '.' )
	  			// but makes no sense otherwise. This is to give a more descriptive user return and log
	  			if (err.message === 'Unexpected token j' || err.message ===  'Unexpected end of input') 
	  				return {errorMessage: "Specified JSON web token does not exist", errorCaught: true};
        		//sails.log.error('Error object:', err);
        		//sails.log.debug('ErrorMessage:',err.message);
        		return {errorMessage: err.message, errorCaught: true}
        		//return res.denied(returnStr);
	  		}  
	  		return {token: decodedToken, errorCaught: false};
	  }

  /*	// howTo:
		var payload = { foo: 'bar' };
		// encode
		var token = jwt.encode(payload, secret);
		
		// decode
		var decoded = jwt.decode(token, secret);
		console.log(decoded); //=> { foo: 'bar' }
		*/


};