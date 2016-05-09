/**
* 400 (Failure) Handler
*
* Usage:
* return res.failure();
* return res.failure(failMessage);
*
* The 'msg' argument of the function should be a JSON-object conveying
* some meaningful information to the client about the cause of the failure.
*
* The response follows the JSend-format:
* URL: http://labs.omniti.com/labs/jsend
*
**/

module.exports = function failure(msg) {

  // Get access to 'req', 'res', & 'sails'
  // var req = this.req;
  var res = this.res;
  // var sails = req._sails;


  //We log the response  
  sails.log.error('Request failure:',msg);

  // Set status code
  res.status(400);
  res.send({
    "Request failure": msg
  });
};