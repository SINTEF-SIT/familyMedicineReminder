
module.exports = function(req, res, next) {
	// hasJsonWebToken is always validated before isOwnerOrGuardian. That way, if the request reaches this
	// point, we know that the JWT is valid, active and in the database. What we don't know is wheter the
	// user is requesting data on themselves or a guardee. This checks that and ensures nobody has can
	// access anyone elses data, that is not their child's. 

	// If user has token with admin privileges, bypass all authentication. Have to check
	// first, because request object won't include decoded_token if user is admin, causing error
    if (JwtService.hasFullAccess(req.headers.access_token)) {
    	sails.log("Admin granted access to "+req.originalUrl);
		return next();
    }

	// UserID is retrieved from the decoded token saved in the request in hasJsonWebToken
	var userID = req.decoded_token.iss;
	// This is the user the data is requested from
	var targetUser = req.param('userID');
	var originalUrl = req.originalUrl;

    // Check it's the user's own data
    if (userID === targetUser) {
     	sails.log("User "+userID+" access their own data");
     	req.accesses_child = false;
     	return next();
	}

	 // At this point we know the user is not accessing their own data
 	// This checks user's children if he's trying to access a child's data
	User.findOne({ userID : userID })
		.populate('children')
		.then(function(user) {
			 // Check if the userID provided exist in the database. Wouldn't make sense if it didn't,
			// as the userID is taken from the decoded token. If user don't exist, it has been deleted
			if (typeof user === 'undefined') {
				var returnString = "userID '"+targetUser+"' does not exist in database";
				sails.log.error(returnString);
				res.denied(returnString);
				return Promise.reject(returnString);
			}
			// Collect children (if any) of user
			var children = user.children;
			// Iterate children (if any)
			for (var i = 0; i < children.length; i++){
				// If the client is requesting data on a child
				if (targetUser === children[i].userID) {
					var returnString = "User '"+userID+"' is guardian for '"+targetUser+"'";
					sails.log(returnString); 

					// Limit number of DB calls, temporarily save data in request object. This data is 
					// used to send Google Cloud Messaging (GCM) push notification in NotificationService.

					// If child wants to receive change-notification and has valid GCM token to send to
					if (children[i].receiveChangeNotification && typeof children[i].token != 'undefined' && children[i].token != 'null'){
						req.wants_notification = true;
						//sails.log.info('req.wants_notification:',req.wants_notification);
						req.accesses_child = true;
						//sails.log.info('req.accesses_child:',req.accesses_child);
						req.child_token = children[i].token
						//sails.log.info('req.child_token:',req.child_token);
					} else { // If child doesn't want to receive change-notification and/or has no valid GCM token
						req.wants_notification = false;
						//sails.log.info('req.wants_notification:',req.wants_notification);
						req.accesses_child = true;
						//sails.log.info('req.accesses_child:',req.accesses_child);
					} // All is well and user is permitten to procede
					next();
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
