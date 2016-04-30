/**
 * Module dependencies
 */



/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function denied (data, options) {

	  var req = this.req;
  	var res = this.res;
    // var sails = req._sails;
    res.status(403);
  	return res.send({Forbidden: data});

  	/*

  var config = {
    logMessage: 'Sending 403 ("Forbidden") response',
    statusCode: 403,
    logData: true,
    isError: true,
    isGuessView: false,
    name: 'forbidden'
  };

  //require('./index').buildResponse(this.req, this.res, data, options, config);
  //require().buildResponse(this.req, this.res, data, options, config);

  // Serve JSON (with optional JSONP support)
  function sendJSON (data) {
    if (!data) {
      return res.send();
    }
    else {
      if (typeof data !== 'object' || data instanceof Error) {
        data = {error: data};
      }
      if ( req.options.jsonp && !req.isSocket ) {
        return res.jsonp(data);
      }
      else return res.json(data);
    }
  }

  // Set status code
  res.status(403);

   // If the user-agent wants JSON, always respond with JSON
  if (req.wantsJSON) {
    return sendJSON(err);
  }

	*/
};
