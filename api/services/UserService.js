var shortid = require('shortid');
var crypt = require('crypto');

module.exports = {

	generateUniqueUserID: function() {
		do id = shortid.generate().slice(0,5);
		while (! User.find({ userID: id }));
		return id;
	},

	generateRandomHexSequence: function(cb) {
		crypt.randomBytes(10, function(err, buffer) {
  			var password = buffer.toString('hex');
  			sails.log('UserServices-generated password: ', password);
  			cb(password);
  			return;
		});
	},

	validateUserPassword: function(plainTextPassword, hashedPassword){

	}
}