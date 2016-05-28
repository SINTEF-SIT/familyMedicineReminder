
module.exports.jwt = {

    // TODO: CRITICAL - CHANGE THIS SECRET BEFORE PRODUCTION
    // INCLUDE THIS FILE IN YOUR .GITIGNORE IF FINAL PRODUCTION VERSION IS ON GITHUB
    secret: '#MyCyFAppToken//007',

    // How should the JWT work before expiry? As of now there is no automatic distribution of new
    // tokens when old ones are expired. The thought was using it this way, and rather revoking
    // a token if user wants to delete account and such. 
    expiry:{
      unit: 'days',
      length: '600'
    },
    // Extra data that can be used to ensure the JWT is created by the server itself
    // Doesn't validate this data at the moment, has more than enough with userID, expiry, UUID, etc
    audience: 'MyCyFapp',
    subject: 'NTNU Informatics',

    // Add a list of pre-approved JWT tokens given access to every API route. This circumvents all other policies/authentications
    // This should be deleted/changed before production, as this token has been public on github
    adminTokens: ["eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFMU04dyIsInN1YiI6Ik5UTlUgSW5mb3JtYXRpY3MiLCJhdWQiOiJNeUN5RmFwcCIsImV4cCI6MTUxMzg4NDIyNS40NTIsIm5iZiI6MTQ2MjA0MDYyNS40NTUsImlhdCI6MTQ2MjA0MDYyNS40NTUsImp0aSI6ImFjYzdhMzAwLTBmMDAtMTFlNi1iZmQ0LTI3NTE1ZDVhMzhmYyJ9.KBsnHgRF1aStn-rF9uds4v9jyKFynRGS7EIpPugWEh0"],
    
    // To not leave any route of the API exposed without authentication, a secret is needed to create a user
    // This should be changed before production, as this token has been public on github. Needs to be changed in client also
    createSecret: "myfirstsecret"

};