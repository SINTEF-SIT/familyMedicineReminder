var gen = require('gen-id')('aaann'); //a=a-z, n=0-9
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

	validateUserPassword: function(plaintextPassword, hashedPassword){
		bcrypt.compare(plaintextPassword, hashedPassword, function(err, res) {
			if (err) {
				sails.log('Error in UserService.validateUserPassword()):',err);
				return false;
			} return res;
		});
	},

	returnUserObject: function(userID, attribute/*, cb*/){
		sails.log.info('returnUserObject()');
		return User.findOne({userID: userID})
		.populate(attribute)
		.then((user) => {
			// sails.log('returnUserObject user:',user);
			if (typeof user === 'undefined')
				return Promise.reject("Cannot return user object of 'undefined'");
			// sails.log("User from UserService.returnUserObject():\n",user);
			return Promise.resolve(user);
		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnUserObject:',err);
			return false;
		});
	},

	returnFullUserObject: function(userID){
		sails.log.info('returnFullUserObject()');
		// sails.log('userID:',userID);

		return User.findOne({userID: userID})
		.populate('jsonWebToken')
		.populate('guardians')
		.populate('children')
		.populate('medications')
		.populate('reminders')
		.then(function(user){
			if (typeof user === 'undefined' ) {
				return Promise.reject("Cannot return user object of 'undefined'");
			} 
			sails.log("User from UserService.returnFullUserObject:",user);
			return Promise.resolve(user);

		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnFullUserObject:',err);
			return false;
		});
	},

	returnGuardianTokenData: function(childID/*, cb*/){
		sails.log.info('returnGuardianTokenData()');
		return UserService.returnUserObject(childID, 'guardians') 
		//UserService.returnFullUserObject(childID) 
		.then(function (child){
			//sails.log('returnGuardianTokenData child:',child);
			var guardians = child.guardians;
			var compiledList = [[],[],[]];
			for (var i = 0; i < guardians.length; i++) {
				// DEBUG
				// sails.log('compiledList['+i+']:')
				// sails.log('userID:',guardians[i]['userID']);
				// sails.log('receiveChangeNotification:', guardians[i]['receiveChangeNotification']);
				// sails.log('token:',guardians[i]['token']);

				// Validate that guardian wants and is able to receive push notification about change
				if (typeof guardians[i]['token'] === 'undefined' || guardians[i]['token'] === null) {
					sails.log(childID+"'s guardian "+guardians[i]['userID']+" doesn't have a defined gcm token");
				} else if (!guardians[i]['receiveChangeNotification']) {
					sails.log(childID+"'s guardian "+guardians[i]['userID']+" has receiveChangeNotification: false");
				} else { //  if (receiveChangeNotification && token != (null && 'undefined')) 
					compiledList[0].push(guardians[i]['userID']);
					compiledList[1].push(guardians[i]['receiveChangeNotification']);
					compiledList[2].push(guardians[i]['token']);
				}
			}
			if (compiledList[0].length > 0) {
				// sails.log('UserService.returnGuardianTokenData() compiledList:\n',compiledList);
				return Promise.resolve(compiledList);
			} else {
				sails.log('User',childID,'doesn\'t have guardians');
				return Promise.reject('User',childID,'doesn\'t have guardians');
			}
		})
		.catch((err) => {
			sails.log(err);
		});
	}
	
};