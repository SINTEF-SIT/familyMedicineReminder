/**
 * Created by jaumard on 27/02/2015.
 */
var moment = require('moment');


module.exports.schedule = {
    sailsInContext : true, //If sails is not as global and you want to have it in your task
    tasks          : {
        firstTask : {
            cron : "* * * * *", // Every minute
            task : function (context, sails) {
                console.log("Started a job that checks whether the parent should receive a notification about a missed reminder.");
                       
                User.find({'userRole': 'patient'}) //find users where userRole is patient
                .populate('reminders') // populate them with their reminders
                .populate('guardians') // populate them with their guardians
                .then(function(patients) { // then do this function on the array of patients
                    patients.forEach(function(patient) { // for each patient do
                        patient.guardians.forEach(function(guardian) { //for each of the patients guardians do                       
                            var gracePeriod = guardian.gracePeriod;

                            patient.reminders.forEach(function(reminder) { // for each of the patients reminders 
                                sails.log.debug(reminder);
                                if(timeTaken === '0') { // if the medicine is not taken
                                    var timeToTake = moment(reminder.date);
                                    sails.log.debug(timeToTake);
                                    var timeToSendReminder = moment(timeToTake).add(gracePeriod, "minutes");
                                    
                                    if()
                                    sails.log.debug(timeToTake);
                                    sails.log.debug(timeToSendReminder);
                                    
                                    /*if(timeToSendReminder.isAfter(moment())) {
                                        sails.log.debug("Has to send reminder");
                                        
                                        
                                    }*/
                                }  
                            })   
                        })
                    })
                })
                .catch(function(err) {
                    sails.log.error(err);
                });
               // NotificationService.sendNotification('childForgotReminder', "", user.token);      
            },
            context : {}
        }
    }
};

/*                User.find({'userRole': 'guardian'})
                    .populate('children')
                    .then(function(users) {
                        users.forEach(function(user) {
                            
                        }, this);
                    })
                    .catch(function(err) {
                        
                    });
                
                */