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
	  	  var decodedToken = jwt.decode(token, sails.config.jwt.secret);
	  	  return decodedToken;
	  },

	  expiryDateIsInFuture: function(expiry){
	  	  var now = Date.now();
	  	  sails.log('Date.now():',now);
	  	  sails.log('expiry*1000:',expiry*1000); // Should be in seconds not milliseconds
	  	  if (now < expiry*1000){
	  	  	sails.log('now < expiry');
	  	  	sails.log(now+' < '+expiry*1000);
	  	  	sails.log('Expiry is in the future');
	  	  	return true;
	  	  } else {
	  	  	sails.log('now > expiry');
	  	  	sails.log(now+' > '+expiry*1000);
	  	  	sails.log('Token has expired');
	  	  	return false;
	  	  }
	  	  
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