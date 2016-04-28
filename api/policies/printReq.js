

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  sails.log("HTTP REQUEST HEADER");
  sails.log(JSON.stringify(req.headers));
  
  next();
};
