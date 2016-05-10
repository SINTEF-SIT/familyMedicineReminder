

module.exports = function(req, res, next) {

	 // If user has token with admin privileges, skip all authentification.
	// Checking first, because req won't include decoded_token if user is amin, causing error
    if (JwtService.hasFullAccess(req.headers.access_token)) {
    	sails.log("Admin granted access to "+req.originalUrl);
		return next();
    }

	//var decodedToken = req.decoded_token;
	var userID = req.decoded_token.iss;
	var targetUser = req.param('userID');
	sails.log('targetUser:',targetUser);
	var originalUrl = req.originalUrl;

    // If it's the user's own data
    if (userID === targetUser) {
     	sails.log("User "+userID+" access their own data");
     	req.accesses_child = false;
     	return next();
	} 

	  // Redundant? API-calls without :userID in URL has policy hasFullAccess,
	 // so this won't be caught here. But works well for testing. Remove later
	/*if (typeof targetUser === 'undefined') {
		var returnString = "Access to "+originalUrl+" denied: userID is not defined in URL";
		sails.log.error(returnString);
		return res.denied(returnString);
	}*/

	 // At this point we know the user is not accessing their own data
 	// This checks guardian's children if he's trying to access a child's data
	User.findOne({ userID : userID })
		.populate('children')
		.then(function(user) {
			 // Does the userID provided exist in the database. Wouldn't make sense if it didn't,
			// as the userID is taken from the decoded token. If user don't exist, it has been deleted
			if (typeof user === 'undefined') {
				var returnString = "userID '"+targetUser+"' does not exist";
				//sails.log.error(returnString);
				//res.denied(returnString);
				return Promise.reject(returnString);
			}

			// Check if the user trying to access data from one of its child
			var children = user.children;
			//sails.log("children:",children);
			//sails.log("children.length:",children.length)
			for (var i = 0; i < children.length; i++){
				//sails.log("children["+i+"].userID:",children[i].userID);
				//sails.log("children["+i+"]:",children[i]);
				if (targetUser === children[i].userID) {
					var returnString = "User '"+userID+"' is guardian for '"+targetUser+"'";
					sails.log(returnString); 
					// sails.log.info('CHILD ACCESSED:\N',children[i]);
					// Limit number of DB calls, temp save data in request
					if (children[i].receiveChangeNotification && typeof children[i].token != 'undefined' && children[i].token != 'null'){
						req.wants_notification = true;
						//sails.log.info('req.wants_notification:',req.wants_notification);
						req.accesses_child = true;
						//sails.log.info('req.accesses_child:',req.accesses_child);
						req.child_token = children[i].token
						//sails.log.info('req.child_token:',req.child_token);
					} else {
						req.wants_notification = false;
						//sails.log.infp('req.wants_notification:',req.wants_notification);
						req.accesses_child = true;
						//sails.log.info('req.accesses_child:',req.accesses_child);
					} next();
					return Promise.resolve();
				}
			}
			// If the code runs this far, the user is not a guardian of given userID	 
			var returnString = "userID '"+userID+"' does not have access to user '"+targetUser+"'";
			return Promise.reject(returnString);
		})
		.catch(function(err) {
			var returnString = "Access to "+originalUrl+" denied: "+err;
			sails.log.error(returnString);
			return res.denied(returnString);
			
		});
};
