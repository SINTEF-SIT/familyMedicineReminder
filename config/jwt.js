
// module.exports.waterlock
module.exports = {

    // CHANGE THIS SECRET BEFORE PRODUCTION
    secret: '#MyCyFAppToken//007',
    expiry:{
      unit: 'days',
      length: '600'
    },
    audience: 'MyCyFapp',
    subject: 'NTNU Informatics',

    // tracks jwt usage if set to true - Unlikely to work now
    trackUsage: true,

    // if set to false will authenticate the
    // express session object and attach the
    // user to it during the hasJsonWebToken
    // middleware - Unlikely to work now
    stateless: true, // was false

    // set the name of the jwt token property
    // in the JSON response
    tokenProperty: 'token',

    // set the name of the expires property
    // in the JSON response
    expiresProperty: 'expires',

    // configure whether or not to include
    // the user in the respnse - this is useful if
    // JWT is the default response for succesfull login
    includeUserInJwtResponse: false // remove?
  },
};
