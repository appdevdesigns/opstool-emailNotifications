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
        AD.log('... <green><bold>EmailNotifications.____init()</bold></green>');
        
        
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
        var currentDate = new Date().toISOString().slice(0,10); 
        
        // Find notification based on schedule date 
        ENNotification.find()
        .where({
            "repeatUntil": { ">=": currentDate }, 
            "nextNotificationDate": currentDate,
            "status": "Active",
            "setupType": "Basic" 
        })
        .then(function(notifications){
            if (notifications.length > 0) {
                notifications.forEach(function(notify){
                    
                    // update next schedule date
                    self.updateNotificationSchedule(notify);
                    
                    // Find the recipient List for notification
                    ENRecipient.findOne({id:notify.recipientId})
                    .then(function(recipient){
                      
                        // Find the Template design for notification
                        ENTemplateDesign.findOne({id:notify.templateDesignId})
                        .then(function(template){
                          
                            self.send({
                                notify: notify,
                                recipients: recipient.recipients,
                                body: template.templateBody
                            });
                            
                        });
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
            console.log('Schedule updated');
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
     *    }
     * @return Deferred
     */
    trigger: function(name, data) {
        var dfd = AD.sal.Deferred();
        
        // Parse out the 'email.' prefix from the name if needed
        name = name.replace(/^email\./, '');
        
        ENNotification
        .find({ eventTrigger: name })
        .populate('templateDesignId')
        .populate('recipientId')
        .then(function(list) {
            async.each(list, function(row, next) {
                
                // Merge variables into template
                var template = row.templateDesignId.templateBody;
                var body = ejs.render(template, data.variables);
                
                // Merge in dynamic recipients
                var recipients = row.recipientId.recipients;
                data.to = data.to || [];
                if (data.to.length > 0) {
                    recipients += ',' + data.to.join(',');
                }
                
                self.send({
                    notify: {
                        id: row.id,
                        fromName: row.fromName,
                        fromEmail: row.fromEmail,
                        emailSubject: row.emailSubject,
                    },
                    recipients: recipients,
                    body: body
                })
                .fail(next)
                .done(function() {
                    next(null);
                });
            
            }, function(err) {
                if (err) {
                    // Some problem with one or more entries
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
            console.error(err);
            dfd.reject(err);
        });
        
        return dfd;
    },
    
    
    
    /**
     * Send out a notification through Nodemailer
     *
     * @param object opts
     * @param obj
     *  {
     *      notify: <ENNotification obj>,
     *      recipients: <string>,
     *      body: <string>
     *  }
     *
     * @return Deferred
     */
    send: function(opts) {
        var dfd = AD.sal.Deferred();
        var self = this;
        
        var notify = opts.notify,
            recipients = opts.recipients,
            body = opts.body;
        
        //Email Options                                 
        var email = {
            subject : notify.emailSubject,
            from : notify.fromName +"<"+ notify.fromEmail +">",
            to: recipients,
            html : body
        };
        
        //Send Email with Nodemailer
        
        var obj = {};
        var status = '';  
              
        obj.notificationId = notify.id;
        obj.sendDate = new Date();
          
        Nodemailer.send(email)
        .fail(function(err){
          
            obj.status = 'Fail';
            obj.log = err;
          
            //Create notification log
            self.createNotificationLog(obj);
            dfd.reject(err);
            
        })
        .done(function(response){
          
            obj.status = 'Success';
            obj.log = response;
            
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




