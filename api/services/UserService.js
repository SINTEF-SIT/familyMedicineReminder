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
			if (typeof user === 'undefined') {
				return Promise.reject("Cannot return user object of 'undefined'");
			} /*if (typeof user.token === 'undefined' || user.token === null) {
				return Promise.reject('Users guardian(s) does not have gcm token');
			}*/
			// sails.log("User from UserService.returnUserObject():\n",user);
			return Promise.resolve(user);
			//return Promise.resolve();

		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnUserObject:',err);
			// Returns error (res not defined) - can't be reached with 'this'. not important, just log
			// return this.res.failure("Error in UserService.returnUserObject():",err);
			return false;
		});
	},

	returnFullUserObject: function(userID){
		sails.log.info('returnFullUserObject()');
		// sails.log('returnUserObject()');
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
			//return cb(user);
			//return Promise.resolve();
			return Promise.resolve(user);

		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnFullUserObject:',err);
			// Returns error - res not defined, can't reach it with 'this'. not important, just log
			// return this.res.failure("Error in UserService.returnFullUserObject():",err);
			return false;
		});
	},

	returnIdListOfAttributeInObject: function(json, attribute, id){
		// Redundant?

		var attributeList = json[attribute];
		var returnList = [];
		// sails.log('attributeList['+attribute+']:',attributeList);

		if (typeof attributeList.id === 'undefined') {
			sails.log('User',json.userID,'doesn\'t have an attribute user.'+attribute+'.'+id);
			return false;
		} if (typeof attributeList === 'undefined' || attributeList.length === 0) {
			sails.log('User',json.userID,'doesn\'t have an object for user.'+attribute);
			return false;
		}
		//if (attributeList.length == 1) return attributeList[0][id];

		for (var i = 0; i < attributeList.length; i++){
			// sails.log('attributeList[i][id]:',attributeList[i][id]); 
			returnList.push(attributeList[i][id]);
		} return returnList;

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
				// debug
				// sails.log('compiledList['+i+']:')
				// sails.log('userID:',guardians[i]['userID']);
				// sails.log('receiveChangeNotification:', guardians[i]['receiveChangeNotification']);
				// sails.log('token:',guardians[i]['token']);
				// Validate guardian wants and is able to receive push notification about change
				if (typeof guardians[i]['token'] === 'undefined' || guardians[i]['token'] === null) {
					sails.log(childID+"'s guardian "+guardians[i]['userID']+" doesn't have a defined gcm token");
				} else if (!guardians[i]['receiveChangeNotification']) {
					sails.log(childID+"'s guardian "+guardians[i]['userID']+" has receiveChangeNotification: false");
				} else { //  if (receiveChangeNotification && token != null) 
					compiledList[0].push(guardians[i]['userID']);
					compiledList[1].push(guardians[i]['receiveChangeNotification']);
					compiledList[2].push(guardians[i]['token']);
				}
			}
			if (compiledList[0].length > 0) {
				// sails.log('UserService.returnGuardianTokenData() compiledList:\n',compiledList);
				return Promise.resolve(compiledList);
				//return Promise.resolve(compiledList);
			} else {
				sails.log('User',childID,'doesn\'t have guardians');
				//return false;
				//return cb(false);
				return Promise.reject('User',childID,'doesn\'t have guardians');
			}
		})
		.catch((err) => {
			sails.log(err);
		});
	},

	returnGuardianTokens: function(childID, cb) {
		UserService.returnGuardianTokenData(childID, function(guardianList){
			// sails.log('returnGuardianTokens guardianList:',guardianList);
			// var tokenList = [];
			if (guardianList) 
				return cb(false);

			/*for (var i = 0; i < guardianList.length; i++){
				UserService.returnUserObject(guardianList[0], 'token', function(user){
					tokenList.push(user.token)
				})
			} var returnObj = {id: guardianList, token: tokenList};
			sails.log('returnObj:',returnObj);*/
			return cb(guardianList);
		});
	}
	
};