var shortid = require('shortid');

module.exports = {

	generateUniqueUserID: function() {
		do id = shortid.generate();
		while (! User.find({ userID: id }));
		return id;
	}
}