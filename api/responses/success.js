/**
* 400 (Success) Success
*
* Usage:
* return res.success();
* return res.success(data);
*
* The 'data' argument of the function should be a JSON-object containing
* all the relevant data that the client expects in return. It may be omitted
* in cases when no data is expected in return, for instance when using DELETE.
*
* The response follows the JSend-format:
* URL: http://labs.omniti.com/labs/jsend
*
**/

module.exports = function success(data) {

  // Get access to 'req', 'res', & 'sails'
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.success() :: Sending success response with data');

  // Set status code
  res.status(200);

  if (!data) data = null;
  res.send({
    "status": "success",
    "data": data
  })
};
