var jwt = require('jwt-simple');
var uuid = require('node-uuid');
var moment = require('moment');

module.exports = {

	encodeJsonWebToken: function(userID){
		sails.log("Service: generateJsonWebToken()");
		var config = sails.config.jwt;

	    var expiryUnit = config.expiry.unit || 'days';
	    sails.log('expiryUnit: ', expiryUnit);
	    var expiryLength = config.expiry.length || 1000;
	    sails.log('expiryLength: ', expiryLength);

	    var expires = moment().add(expiryLength, expiryUnit).valueOf();
	    sails.log('expires: ', expires);

	    var issued = Date.now(); // Milliseconds since 1970 00:00
	    //var user = user; // || req.session.user;

		var decodedToken = {
	      iss: userID, // + '|' + req.remoteAddress,
	      sub: config.subject,
	      aud: config.audience,
	      exp: expires,
	      nbf: issued,
	      iat: issued,
	      jti: uuid.v1(),
	      secret: config.secret
	    };

	    sails.log('Decoded token:');
	    sails.log(decodedToken);

	    var token = jwt.encode({
	      iss: userID, // + '|' + req.remoteAddress,
	      sub: config.subject,
	      aud: config.audience,
	      exp: expires,
	      nbf: issued,
	      iat: issued,
	      jti: uuid.v1()
	    }, config.secret);

	    sails.log('Encoded token:');
	    sails.log(token);

	    return {
	      token: token,
	      expires: expires
	    };
	  },

  /*	// howTo:
		var payload = { foo: 'bar' };
		// encode
		var token = jwt.encode(payload, secret);
		
		// decode
		var decoded = jwt.decode(token, secret);
		console.log(decoded); //=> { foo: 'bar' }
		*/

  /**
   * Return access token from request
   *
   * @param  {Object} req the express request object
   * @return {String} token
   * @api public
   */
	  getAccessToken: function(req){
	    var token = null;
	    if (req.headers && req.headers.authorization) {
	      var parts = req.headers.authorization.split(' ');
	      if (parts.length === 2){
	        var scheme = parts[0];
	        var credentials = parts[1];

	        if (/^Bearer$/i.test(scheme)){
	           token = credentials;
	        }
	      }
	    }else{
	      token = this.allParams(req).access_token;
	    }
	    return token;
	  }
};