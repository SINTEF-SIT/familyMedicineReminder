var shortid = require('shortid');
var crypt = require('crypto');

module.exports = {

	generateUniqueUserID: function() {
		do id = shortid.generate().slice(0,5);
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

	returnUserObject: function(userID, attribute, cb){
		User.findOne({userID: userID})
		.populate(attribute)
		.then(function(user){
			// sails.log('returnUserObject user:',user);
			if (typeof user === 'undefined') {
				return Promise.reject("Cannot return user object of 'undefined'");
			} /*if (typeof user.token === 'undefined' || user.token === null) {
				return Promise.reject('Users guardian(s) does not have gcm token');
			}*/
			//sails.log("User:",user);
			cb(user);
			return Promise.resolve();

		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnUserObject:',err)
			// Returns error (res not defined) - can't be reached with 'this'. not important, just log
			// return this.res.failure("Error in UserService.returnUserObject():",err);
			return false;
		})
	},

	returnFullUserObject: function(userID, cb){
		// sails.log('returnUserObject()');
		// sails.log('userID:',userID);
		User.findOne({userID: userID})
		.populate('jsonWebToken')
		.populate('guardians')
		.populate('children')
		.populate('medications')
		.populate('reminders')
		.then(function(user){
			if (typeof user === 'undefined' ) {
				return Promise.reject("Cannot return user object of 'undefined'");
			} 
			//sails.log("User:",user);
			cb(user);
			return Promise.resolve();

		})
		.catch(function(err){
			sails.log.error('Error in UserService.returnFullUserObject:',err)
			// Returns error - res not defined, can't reach it with 'this'. not important, just log
			// return this.res.failure("Error in UserService.returnFullUserObject():",err);
			return;
		})
	},

	returnIdListOfAttributeInObject: function(json, attribute, id){
		var attributeList = json[attribute];
		var returnList = [];
		// sails.log('attributeList['+attribute+']:',attributeList);

		if (typeof attributeList.id === 'undefined') return false;
		if (typeof attributeList === 'undefined' || attributeList.length == 0) return false;
		//if (attributeList.length == 1) return attributeList[0][id];

		for (var i = 0; i < attributeList.length; i++){
			// sails.log('attributeList[i][id]:',attributeList[i][id]);
			returnList.push(attributeList[i][id]);
		} return returnList;

	},

	returnChildsGuardianIDs: function(childID, cb){
		UserService.returnUserObject(childID, 'guardians', function (child){
			//sails.log('returnChildsGuardianIDs child:',child);
			var guardianList = UserService.returnIdListOfAttributeInObject(child, 'guardians', 'userID');
			// sails.log('guardianList: ',guardianList);
			var tokenList = UserService.returnIdListOfAttributeInObject(child, 'guardians', 'token');
			// sails.log('tokenList: ',tokenList);

			if (guardianList && tokenList) {
				// sails.log('User',childID,"'s guardians:",guardianList);
				// sails.log('Guardians token:',tokenList);
				// return list;
				var returnList = [guardianList, tokenList]
				sails.log('UserService.returnChildsGuardianIDs guardianID and token:',returnList);
				cb(returnList);
				return;
			} else {
				sails.log('User',childID,'does not have a guardian with a token');
				//return false;
				return cb(false);
			}
		});
	},

	returnGuardianTokens: function(childID, cb) {
		UserService.returnChildsGuardianIDs(childID, function(guardianList){
			// sails.log('returnGuardianTokens guardianList:',guardianList);
			// var tokenList = [];
			if (guardianList === false || typeof guardianList === 'undefined') return cb(false);

			/*for (var i = 0; i < guardianList.length; i++){
				UserService.returnUserObject(guardianList[0], 'token', function(user){
					tokenList.push(user.token)
				})
			} var returnObj = {id: guardianList, token: tokenList};
			sails.log('returnObj:',returnObj);*/
			return cb(guardianList);
		})
	}



	
}