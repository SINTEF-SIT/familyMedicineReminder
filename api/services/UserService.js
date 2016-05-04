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

	returnUserObject: function(userID, cb){

		// sails.log('returnUserObject()');
		// sails.log('userID:',userID);
		User.findOne({userID: userID})
		.populate(jsonWebToken)
		.populate(guardian)
		.populate(child)
		.then(function(user){
			if (typeof user === 'undefined') {
				return Promise.reject("Cannot return user object of 'undefined'");
			} //sails.log("User:",user);
			cb(user);
			return Promise.resolve();

		})
		.catch(function(err){
			//return false;
			return this.res.failure("Error in UserService.returnUserObject():",err);
		})
	},



	returnChildsGuardians: function(childID){
		UserService.returnUserObject(childID, function (child){
			//sails.log('callback function done');
			sails.log('Child:\n',child);
		});
		
	/*
		addChild: function(req, res) {
		var userID = req.param('userID');
		var childID = req.body.childID;

		// Check if childID is defined in HTTP body
		if (typeof childID === 'undefined') 
			return res.failure('\'childID\' is not defined in HTTP body. Cannot add child \'undefined\'');

		User.findOne({ userID: userID })
		.populate('children')
		.then(function(user) {
			if (user.children.every(child => child.userID !== childID)) {
				return Promise.resolve(user);
			}
			return Promise.reject("User is already a child");
		})
		.then(function(user) {
			user.children.add(childID);
			user.save(function(err, user) {
				if (err) 	return Promise.reject(err);
				sails.log.debug(user);
			});
			res.send({"message": "Child was added"});
			sails.log.debug(userID, "added", childID, "as a child");
			return Promise.resolve();
		})
		.catch(function(err) {
			sails.log.error("Could not add child: ", err);
			return res.send({"message" : err});
		});*/

	},

	validateUserPassword: function(plainTextPassword, hashedPassword){

	}
}