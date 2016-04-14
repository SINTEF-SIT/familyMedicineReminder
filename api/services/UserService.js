var shortid = require('shortid');
var crypt = require('crypto');

module.exports = {

	generateUniqueUserID: function() {
		do id = shortid.generate();
		while (! User.find({ userID: id }));
		return id;
	},

	generateRandomBytesSequence: function(length) {
		crypt.randomBytes(length, function(err, buffer) {
  			var password = buffer.toString('hex');
  			sails.log('Password created: ', password);
  			return password;
		});
	}
}