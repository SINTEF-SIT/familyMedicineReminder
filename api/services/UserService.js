var gen = require('gen-id')('aaannn'); //a=a-z, n=0-9
var crypt = require('crypto');

module.exports = {

	generateUniqueUserID: function() {
		
		do id = gen.generate();
		while (! User.find({ userID: id }));
		sails.log('UserID generated: ', id);
		return id;
	},

	generateRandomHexSequence: function(cb) {
		crypt.randomBytes(10, function(err, buffer) {
  			var password = buffer.toString('hex');
  			sails.log('PlainText password generated: ', password);
  			cb(password);
  			return;
		});
	},

	validateUserPassword: function(plainTextPassword, hashedPassword){

	}
}