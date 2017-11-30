/**
 * EmailNotifications global service object.
 * Logic that is  not directly related to http/socket requests should go here.
 */



//-----------------------------------------------------------------------------
// Variables:
//-----------------------------------------------------------------------------
var path = require('path');
var ejs = require('ejs');
var AD = require('ad-utils');       // reusable AD utilities (log, sal, etc...)

var Models = {};                    // reference our /api/models/* here.
                                    // so that our unit tests can Mock them 
                                    // easier.


module.exports= {

    /*
     *  @function ____init
     *
     *  function called during the bootstrap.js process in order to setup
     *  variables that are not available when this file is initially read.
     *
     *  @param {fn} cb  the callback to call when finished.
     *                  if there was an error: 
     *                      var err = new Error('That didnt work!');
     *                      cb(err);
     *                  else
     *                      cb();
     *
     *
     */
    ____init:function(cb) {
        sails.log.info('EmailNotifications.____init()');
        
        
        // Subscribe to listen for published email event triggers
        this.hub = ADCore.queue.sandbox();
        this.hub.subscribe('*', this.trigger);
        ADCore.queue.subscribe('email.*', this.trigger);


        // 1) Setup local References to the Global Models to use:
        //    suppose you had /api/models/ENTemplates.js model definition:
        //    Models.Templates = ENTemplates;
        
        cb();
    },



    /*
     *  @function ____mockObjects
     *
     *  Allow our unit tests to send in Mock objects to return
     *  predetermined values.
     */
    ____mockObjects:function(opt) {


        if (opt.AD) {
            AD = opt.AD;
        }

        // add any other variables you want to overwrite here:


        // 1) Like checking for any Model References here:
        //    if (opt.Templates) {  Models.Templates = opt.Templates; }

    },



    /*
     *  @function ____originalObjects
     *
     *  Allow our unit tests to retrieve the original objects that are 
     *  in use.  So they can reset them to the proper values when they
     *  are done.
     *
     *  @codestart
     *  // get the original Object references
     *  var originalObjects = EmailNotifications.____originalObjects();
     *
     *  // update with our mocked versions:
     *  EmailNotifications.____mockObjects({ AD:MockAD, Templates:MockTemplateModel });
     *
     *  //// perform your tests.
     *
     *  // return the original objects 
     *  EmailNotificaitons.____mockObjects(originalObjects);
     *  @codeend
     */
    ____originalObjects:function() {


        return {
            AD:AD,
            // Templates: Models.Templates
        }

    },
    
    
    
     /**@ sendScheduledEmail
     * 
     * Sends scheduled basic emails.
     *
     * Periodically called through the crontab, which is initialized 
     * in bootstrap.js.
     *
     * @return void
     *
     * @author Edwin
     * @since 15 May 2015
     */ 
    sendScheduledEmail: function() {
        var self = this;
        
        // Must convert date to a string. Waterline ORM does not work well
        // when comparing a timeless 'DATE' DB field with a js Date object.
        // Also, do not use toISOString() because of timezone issues.
        // Too bad we can't get Waterline to just call NOW() in SQL.
        var now = new Date();
        var pad = function(num) {
            if (num < 10) {
                return '0' + num;
            } else {
                return String(num);
            }
        };
        var dateString = '' 
                + now.getFullYear() + '-'
                + pad(now.getMonth()+1) + '-'
                + pad(now.getDate());
        
        // Find notification based on schedule date 
        ENNotification.find()
        .where({
            "repeatUntil": { '>=': dateString }, 
            "nextNotificationDate": { '<=': dateString },
            "status": "Active",
            "setupType": "Basic" 
        })
        .populate('recipientId')
        .populate('templateDesignId')
        .then(function(notifications){
            if (notifications.length > 0) {
                notifications.forEach(function(notify){
                    
                    // update next schedule date
                    self.updateNotificationSchedule(notify);
                    
                    self.send({
                        notify: notify,
                        recipients: notify.recipientId.recipients,
                        body: notify.templateDesignId.templateBody
                    });
                    
                });
            }
        });
    },
    
    
    
    /** @ updateNotificationSchedule
     *          
     * @return void
     *
     * @author Edwin
     * @since 15 May 2015
     */
    updateNotificationSchedule : function(notification){
      
        var notificationFrequency = notification.emailFrequency;
        var nextSchedule = '';
        
        var currentDate = new Date();
        var y = currentDate.getFullYear(),
            m = currentDate.getMonth(),
            d = currentDate.getDate();
        
        if (notificationFrequency == 'Everyday') { 
            // New date +1 day ahead
            nextSchedule = new Date(y, m, d+1);
        }
        else if (notificationFrequency == 'Monthly') {
            // New date +1 month ahead
            nextSchedule = new Date(y, m+1, d);
        }
        else if (notificationFrequency == 'Yearly') {
            // New date +1 Year ahead
            nextSchedule = new Date(y+1, m, d);
        }
        
        // Update the schedule date           
        ENNotification.update(notification.id, {
            'nextNotificationDate': nextSchedule
        })
        .then(function(){
            //console.log('Schedule updated: ' + notification.nextNotificationDate + ' -> ' + nextSchedule);
        });      
      
    },



    /**
     * Handle email triggers.
     *
     * USAGE:
     *   Publish to the public event queue:
     *      ADCore.queue.publish('email.TRIGGER_NAME', data)
     *
     *   Or publish to the private event queue:
     *      EmailNotifications.hub.publish('TRIGGER_NAME', data)
     *
     *   Or just call the method directly:
     *      EmailNotifications.trigger('TRIGGER_NAME', data)
     *
     * @param string name
     * @param object data
     *    {
     *        to: [ <string>, ... ],
     *        // cc: [ <string>, ... },
     *        // bcc: [ <string>, ... ],
     *        variables: {
     *            <name>: <value>,
     *            ...
     *        },
     *        attachments: [ <object>, ... ], // optional
     *    }
     * @return Deferred
     */
    trigger: function(name, data) {
        var dfd = AD.sal.Deferred();
        var self = this;
        
        // Parse out the 'email.' prefix from the name if needed
        name = name.replace(/^email\./, '');
        
        ENNotification
        .find({ eventTrigger: name })
        .populate('templateDesignId')
        .populate('recipientId')
        .then(function(list) {
            async.each(list, function(row, next) {
                
                var template = row.templateDesignId.templateBody;
                
                try {
                    // Merge variables into template
                    var body = ejs.render(template, data.variables);
                    
                    // Merge in dynamic recipients
                    var recipients = data.to || [];
                    if (row.recipientId.recipients) {
                        recipients.push( row.recipientId.recipients );
                    }
                    var recipientString = recipients.join(',');
                    
                    if (recipientString.length > 0) {
                        self.send({
                            notify: {
                                id: row.id,
                                fromName: row.fromName,
                                fromEmail: row.fromEmail,
                                emailSubject: row.emailSubject,
                            },
                            recipients: recipientString,
                            body: body,
                            attachments: data.attachments,
                        })
                        .fail(function(err) {
                            ADCore.error.log('Send error: ', err);
                            next(err);
                        })
                        .done(function() {
                            next(null);
                        });
                    } 
                    else {
                        //console.log('Skipping ' + row.emailSubject + ' because no recipients');
                        next(null);
                    }
                
                } catch (err) {
                    ADCore.error.log('Template data merge error', err);
                    next(err);
                }
            
            }, function(err) {
                if (err) {
                    // Some problem with one or more entries
                    ADCore.error.log('email notification entry problem', err);
                    dfd.reject(err);
                }
                else {
                    // All done
                    dfd.resolve();
                }
            });
        })
        .fail(function(err) {
            // DB error
            ADCore.error.log('DB error:', err);
            dfd.reject(err);
        });
        
        return dfd;
    },
    
    
    
    /**
     * Preview the output of an email trigger.
     *
     * USAGE:
     *   Call the method directly:
     *      EmailNotifications.previewTrigger('TRIGGER_NAME', data)
     *      .done(function(output) {
     *          // `output` is a string
     *          ...
     *      });
     *
     * @param string name
     * @param object data
     *    {
     *        variables: {
     *            <name>: <value>,
     *            ...
     *        },
     *    }
     * @return Deferred
     */
    previewTrigger: function(name, data) {
        var dfd = AD.sal.Deferred();
        var self = this;
        var output = '';
        
        // Parse out the 'email.' prefix from the name if needed
        name = name.replace(/^email\./, '');
        
        ENNotification
        .find({ eventTrigger: name })
        .populate('templateDesignId')
        .then(function(list) {
            if (!list || list.length == 0) {
                dfd.reject(new Error('No matches'));
                return;
            }
            
            async.each(list, function(row, next) {
                
                var template = row.templateDesignId.templateBody;
                try {
                    // Merge variables into template
                    var body = ejs.render(template, data.variables);
                    output += body;
                    next();
                
                } catch (err) {
                    ADCore.error.log('Template data merge error', err);
                    next(err);
                }
            
            }, function(err) {
                if (err) {
                    // Some problem with one or more entries
                    dfd.reject(err);
                }
                else {
                    // All done
                    dfd.resolve(output);
                }
            });
        })
        .fail(function(err) {
            // DB error
            ADCore.error.log('DB error:', err);
            dfd.reject(err);
        });
        
        return dfd;
    },
    
    
    
    /**
     * Send out a notification through Nodemailer
     *
     * @param {object} opts
     *  {
     *      notify: <ENNotification obj>,
     *      recipients: <string>,
     *      body: <string>,
     *      attachments: <array> // optional
     *  }
     *
     * @param {array} [opts.attachments]
     * [
     *    { 
     *      filename: {string},
     *      content: {string/buffer},
     *      contentType: {string}, // optional if content is a buffer
     *      cid: {string}
     *    },
     *    ...
     * ]
     *
     * @return {Deferred}
     */
    send: function(opts) {
        var dfd = AD.sal.Deferred();
        var self = this;
        
        var notify = opts.notify,
            recipients = opts.recipients,
            body = opts.body,
            attachments = opts.attachments || [];
        
        //Email Options                                 
        var email = {
            subject : notify.emailSubject,
            from : notify.fromName +"<"+ notify.fromEmail +">",
            to: recipients,
            html : body,
            attachments: attachments
        };
        
        //Send Email with Nodemailer
        
        var obj = {};
        obj.notificationId = notify.id;
        obj.sendDate = new Date();
          
        Nodemailer.send(email)
        .fail(function(err){
          
            obj.status = 'Fail';
            obj.log = {
                message: err.message,
                recipients: recipients
            };
          
            //Create notification log
            self.createNotificationLog(obj);
            dfd.reject(err);
            
        })
        .done(function(response){
            if (typeof response == 'object') {
                obj.log = response
            } else {
                obj.log = { message: response };
            }
            obj.log.recipients = recipients;
            obj.status = 'Success';
            
            //Create notification log
            self.createNotificationLog(obj);
            dfd.resolve();
        
        });
      
        return dfd;
    },
    
    
    
    /** @ createNotificationLog
     *          
     * @param obj     
     *
     * @return void
     *
     * @author Edwin
     * @since 15 May 2015
     */ 
    createNotificationLog : function(obj){    
        if (typeof obj.log != 'object') {
            obj.log = { "data": obj.log };
        }
        
        ENNotificationLog.create(obj)
        .fail(function(err){
            console.log(err);
        })
        .then(function(response){
            //console.log(response);
        });             
    },   
    


}




