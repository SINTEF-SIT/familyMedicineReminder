/**
 * Created by jaumard on 27/02/2015.
 */
var moment = require('moment');


module.exports.schedule = {
    sailsInContext : true, //If sails is not as global and you want to have it in your task
    tasks          : {
        checkForgottenRemindersTask : {
            cron : "* * * * *", // Every minute
            task : function (context, sails) {
                console.log("Started a job that checks whether the parent should receive a notification about a missed reminder.");
                User.find({'userRole': 'patient'}) //find users where userRole is patient
                .populate('reminders') // populate them with their reminders
                .populate('guardians') // populate them with their guardians
                .then(function(patients) { // then do this function on the array of patients
                    var remindersNotified = [];
                    patients.forEach(function(patient) { // for each patient do
                        patient.guardians.forEach(function(guardian) { //for each of the patients guardians do                       
                            var gracePeriod = guardian.gracePeriod;

                            patient.reminders.forEach(function(reminder) { // for each of the patients reminders 
                                if(reminder.timeTaken === '0') { // if the medicine is not taken
                                    var timeToSendReminder = moment(reminder.date, 'YYYY;MM;DD;HH;mm;ss').add(gracePeriod, "minutes").add(1, 'month'); //add one month due to zero indexed month.
                                    var now = moment();
                                    if (timeToSendReminder.isBefore(now) && !reminder.hasSentNotification) {
                                        NotificationService.sendNotification('childForgotReminder', "", guardian.token, "Forgotten reminder", "Your child may have forgotten their reminder, you should reach out to them.");
                                        remindersNotified.push(reminder.serverId);
                                    }
                                }  
                            })
                        })
                    })
                    sails.log.debug(remindersNotified);
                    remindersNotified.forEach(function(reminderId) {
                        Reminder.update({serverId : reminderId}, { hasSentNotification : true})
                        .catch( err => {
                            sails.log.error(err);
                        });
                    });
                })
                .catch(function(err) {
                    sails.log.error(err);
                });
            },
            context : {}
        },
        
        resetRemindersAtMidnight: {
            cron : "59 23 * * *", //daily at 23:59
            task : function (context, sails) {
                sails.log.error("Started a job that resets all reminders every night.")
                Reminder.update({/** all */}, { hasSentNotification: false, timeTaken: 0 })
                .catch( err => {
                    sails.log.error(err);
                });
            },
            context : {}
        }
    }
};