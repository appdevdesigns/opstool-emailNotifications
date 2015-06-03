/**
 * ENEmailManagerController
 *
 * @description :: Server-side logic for managing Enemailmanagers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    _config: {    
        actions: true,
        shortcuts: true,
        rest: true
    },
    
     /**@ sendEmail
		 * 
		 * @param req			
		 * @param res			
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 15 May 2015
		 */	
    
    sendEmail: function (req, res){
		var self = this;
		var currentDate = new Date().toISOString().slice(0,10); 
		
		//Find notification based on schedule date 
		var filterQuery = " SELECT id, emailSubject, fromName, fromEmail, templateDesignId, recipientId FROM en_notification WHERE CURDATE() >= startFROM AND CURDATE()<= repeatUntil AND ( notificationSendDate < CURDATE() OR notificationSendDate IS NULL) AND status='Active' AND setupType='Basic'";	
				
		ENNotification.query(filterQuery, function(err,notifications){
		
				if(notifications.length > 0){
					
						notifications.forEach(function(notify){
																				
								//Find the recipient List for notification
								
								ENRecipient.findOne({id:notify.recipientId}).then(function(recipient){
									
									//Find the Template desing for notification
																		
									 ENTemplateDesign.findOne({id:notify.templateDesignId}).then(function(template){
											
											//Email Options																	
											var email = {
												from : notify.fromName +"<"+ notify.fromEmail +">",
												to: recipient.recipients,
												subject:notify.emailSubject,
												html : template.templateBody
											}
											
											//Send Email form Nodemailer
											
												var obj = {};
												var status = '';	
													  
												obj.notificationId = notify.id;
												obj.sendDate	 = new Date();
												
											Nodemailer.send(email)
											.fail(function(err){
												
												//Data the notification log		
												obj.status = 'Fail'; //mail status
												obj.log = err; // log
												
												//Create notification log
												self.createNotificationLog(obj); //set notification log									
												//console.log(err);
											})
											.then(function(response){
												
												//Data the notification log	
												obj.status = 'Success'; //mail status
												obj.log = response;     // log
												//Create notification log
												self.createNotificationLog(obj);	//set notification log	
												self.updateNotificationSchedule(notify); // update next schedule date
											
											});
										
										 });									 
									 
									});
							});
					}
					
				});
		},
		
	
	/**	@ createNotificationLog
		 * 					
		 * @param obj			
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 15 May 2015
		 */	
		 	
	createNotificationLog : function(obj){		
			//Create notification log
				ENNotificationLog.create(obj).fail(function(err){
					 console.log(err);
					}).then(function(response){	});							
		
		},   
    
    /**	@ updateNotificationSchedule
		 * 					
		 * @param obj			
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 15 May 2015
		 */
		 	
	 updateNotificationSchedule : function(notification){		
		var currentDate = new Date();
		var notificationFrequency = notification.emailFrequency;	
		var nextSchedule = currentDate;
		
		 if(notificationFrequency == 'Everyday'){	
			 		
				nextSchedule = currentDate; 
																		
			 }else if(notificationFrequency == 'Monthly'){
				 
				nextSchedule = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, currentDate.getDate()-1); // New date +1 month ahead
				 
			}else if(notificationFrequency == 'Yearly'){
					 
				nextSchedule = new Date(currentDate.getFullYear()+1, currentDate.getMonth(), currentDate.getDate()-1); // New date +1 Year ahead
					  
			 }
			 
			ENNotification.update(notification.id,{'notificationSendDate': nextSchedule}).then( function(){});
		
		}
};

