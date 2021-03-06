/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  * Routes related to UserController                                         *
  ***************************************************************************/

  'GET /user/:userID/children'                    : 'UserController.getChildren',
  'POST /user/:userID/children'                   : 'UserController.addChild',
  'DELETE /user/:userID/children'                 : 'UserController.removeAllChildren',
  'POST /user'                                    : 'UserController.create',
  'PUT /user/:userID/token/:token'                : 'UserController.associateToken',
  'PUT /user/:userID/settings/graceperiod/:minutes': 'UserController.setGracePeriod',
  'GET /user/:userID/lastSeen'                    : 'UserController.getLastSeenStatus',
  'PUT /user/:userID/settings/receivechange/:bool': 'UserController.setReceiveChangeNotification',

  /***************************************************************************
  * Routes related to ReminderController                                     *
  ***************************************************************************/
  
  'GET /user/:userID/reminder'                    : 'ReminderController.getReminders',
  'POST /user/:userID/reminder'                   : 'ReminderController.createReminder',
  'PUT /user/:userID/reminder/:reminderID'        : 'ReminderController.updateReminder',
  'DELETE /user/:userID/reminder/:reminderID'     : 'ReminderController.deleteReminder',

  /***************************************************************************
  * Routes related to MedicationController                                   *
  ***************************************************************************/

  'POST /user/:userID/medication'                 : 'MedicationController.add',
  'GET /user/:userID/medication'                  : 'MedicationController.get',
  'PUT /user/:userID/medication/:medicationID'    : 'MedicationController.put',
  'DELETE /user/:userID/medication/:medicationID' : 'MedicationController.delete',
  
  /***************************************************************************
  * Routes related to MedicationController                                   *
  ***************************************************************************/
  
  'POST /user/:userID/linking/:withID'            : 'LinkingRequestController.createLinkingRequest',
  'POST /user/:userID/linkingresponse/:response'  : 'LinkingRequestController.responseToLinkingRequest',

  /***************************************************************************
  * Routes related to JwtController                                          *
  ***************************************************************************/

  'GET /jwt/:userID'                              : 'JwtController.getJsonWebToken',
  'GET /jwt'                                      : 'JwtController.getAllJsonWebTokens',
  'DELETE /jwt/:id'                               : 'JwtController.deleteJsonWebToken',
  
  //Polling
  'HEAD /api/polling'                             : 'LinkingRequestController.polling'
};
