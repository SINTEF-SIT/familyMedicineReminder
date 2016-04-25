var shortid = require('shortid');

module.exports = {

	generateUniqueUserID: function() {
		do id = shortid.generate().slice(0,5);
		while (! User.find({ userID: id }));
		return id;
	},

	validateUserPassword: function(plainTextPassword, hashedPassword){

	}
}