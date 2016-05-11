var gen = require('gen-id')('aaann'); //a=a-z, n=0-9
var crypt = require('crypto');

module.exports = {

	generateUniqueUserID: function() {
		// Generates unique userID by specification made at line 1 when importing library
		// Now generates 5 character ID with 3 letters and two numbers. Checks ID does not exist in DB
		do id = gen.generate();
		while (! User.find({ userID: id }));
		sails.log('UserID generated: ', id);
		return id;
	},

	generateRandomHexSequence: function(cb) {
		// Used by UserController when generating random password for new user. Creates a sequence
		// of random hex characters, which is salted and hashed (in User model) before put in DB
		crypt.randomBytes(10, function(err, buffer) {
  			var password = buffer.toString('hex');
  			sails.log('PlainText password generated: ', password);
  			cb(password);
  			return;
		});
	},

	validateUserPassword: function(plaintextPassword, hashedPassword){
		// Currently not in use, but could be useful in further development. Returns a boolean
		bcrypt.compare(plaintextPassword, hashedPassword, function(err, res) {
			if (err) {
				sails.log('Error in UserService.validateUserPassword()):',err);
				return false;
			} return res;
		});
	},

	returnUserObject: function(userID, attribute){
		// Used by UserService.returnGuardianTokenData()
		// Returns basic user object, populated with one additional attribute. Returns the object
		// in a Promise, and as such a Promise needs to be caught in the function calling it
		
		//sails.log.info('returnUserObject()');
		return User.findOne({userID: userID})
		.populate(attribute)
		.then((user) => {
			if (typeof user === 'undefined')
				return Promise.reject("User with ID '"+userID+"' does not exist");
			// sails.log("User from UserService.returnUserObject():\n",user);
			return Promise.resolve(user);
		}) // Catches any errors, logs them and triggers error up the stream where it's 'caught'
		.catch(function(err){
			sails.log.error('Error caught in UserService.returnUserObject():\n',err);
			return false;
		});
	},

	returnFullUserObject: function(userID){
		// Returns the basic user object, populated with all attributes. Returns the object
		// in a Promise, and as such a Promise needs to be caught in the function calling it

		// sails.log.info('returnFullUserObject()');
		return User.findOne({userID: userID})
		// The User model returned does not include the attributes which is is a reference or
		// relation to another model. As such, we 'populate' the User model with data of said relations
		.populate('jsonWebToken') // Jwt model
		.populate('guardians')    // User model
		.populate('children')     // User model
		.populate('medications')  // Medication model
		.populate('reminders')    // Reminder model
		.then(function(user){
			if (typeof user === 'undefined' ) {
				return Promise.reject("Cannot return user object of 'undefined'");
			} 
			// sails.log("User from UserService.returnFullUserObject:",user);
			return Promise.resolve(user);
		}) // Catches any errors, logs them and triggers error up the stream where it's 'caught'
		.catch(function(err){
			sails.log.error('Error caught in UserService.returnFullUserObject()\n:',err);
			return false;
		});
	},

	returnGuardianTokenData: function(childID)  {
		// Used by NotificationService.notifyGuardiansOfChange()
		// Checks if user with ID 'childID' has guardian(s) and if so; does the guardian have a valid
		// Google Cloud Messaging (GCM) token for pushing to, and receiveChangeNotification boolean
		// set to true. This is true by default, but can be changed by user in the app settings
		// If valid guardian(s) exists, returns: [[userID], [receiveChangeNotification], [GCM token]]

		//sails.log.info('returnGuardianTokenData()');
		return UserService.returnUserObject(childID, 'guardians') 
		// .then is triggered asynchronously when the function above is done. .then can be used on all
		// functions returning a Promise. 'child' is the User object received by the returnUserObject()
		.then(function (child){
			// sails.log('UserService.returnGuardianTokenData() child:',child);
			var guardians = child.guardians; // We only want data about the user's guardians
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
					// Guardian has valid token and wants to receive change-notification
					compiledList[0].push(guardians[i]['userID']);
					compiledList[1].push(guardians[i]['receiveChangeNotification']);
					compiledList[2].push(guardians[i]['token']);
				}
			// Check if we are sending notification to any guardian(s)
			} if (compiledList[0].length > 0) {
				// sails.log('UserService.returnGuardianTokenData() compiledList:\n',compiledList);
				return Promise.resolve(compiledList);
			} else {
				sails.log('User',childID,'doesn\'t have guardians');
				return Promise.reject('User',childID,'doesn\'t have guardians');
			}
		})
		.catch((err) => {
			sails.log.error('Error caught in UserService.returnGuardianTokenData():\n',err);
			return false;
		});
	}
	
};