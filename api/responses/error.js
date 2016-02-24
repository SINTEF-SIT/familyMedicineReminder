/**
* 500 (Server error) Error
*
* Usage:
* return res.error(err);
*
* The 'err' argument of the function should be a string conveying
* some meaningful information to the client about the error
*
* The response follows the JSend-format:
* URL: http://labs.omniti.com/labs/jsend
*
**/


module.exports = function error(error) {

  // Get access to 'req', 'res', & 'sails'
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.error() :: Sending error response with ', err);

  // Set status code
  res.status(500);
  res.send({
    "status": "error",
    "message": error
  });
};