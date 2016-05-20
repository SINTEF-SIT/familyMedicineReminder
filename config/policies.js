/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    // All controllers are specified with policies below, the first one is to not leave new controllers
    // exposed after creation, if specifying policy is forgot. This is a default policy and is enforced
    // on every controller. However default policies does not 'trickle down' and will not be applied to  
    // any controller that is given an explicit mapping. Look under further down for example.
    // A client request needs to pass a controller's policies before it can use the controller itself.
    // Policies are executed from left to right. Policies 'hasJsonWebToken', 'isOwnerOrGuardian' and
    // 'canCreateUser' first check if request token is admin. As such, an admin-token will bypass all
    // other policies. When listing policies, request has to pass all of them (',' works as AND)

    '*': ['hasJsonWebToken', 'isOwnerOrGuardian'], 

    UserController: {
        '*': ['hasJsonWebToken', 'isOwnerOrGuardian'],
        // User has not received JWT yet and uses a string-secret for authentification. Default policies
        // does not 'trickle down', and policy for 'create' overrides and removes policies '*' gives above
        create: 'canCreateUser'
    }, 

    JwtController: {
        getJsonWebToken: ['hasJsonWebToken', 'isOwnerOrGuardian'],
        // Controller methods only available to users with admin token. Consider closing these off for admin
        // as well. It was created for debug purposes and poses a big security risk (in the wrong hands), 
        // as it returns all the users in the database along with their token.
        getAllJsonWebTokens: ['hasFullAccess'],
        deleteJsonWebToken: ['hasFullAccess']
    },
    
    ReminderController: {
        '*': ['hasJsonWebToken', 'isOwnerOrGuardian']
    },

    MedicationController: {
        '*': ['hasJsonWebToken', 'isOwnerOrGuardian']
    },

    LinkingRequestController: {
        '*': ['hasJsonWebToken', 'isOwnerOrGuardian'],
        'polling' : ['hasJsonWebToken']
    }
  
};