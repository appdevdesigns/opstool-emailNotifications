steal(
        // List your Controller's dependencies here:
        'appdev',
		//'opstools/EmailNotifications/models/Projects.js',
		//'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
		//'//opstools/EmailNotifications/views/Wizard/Wizard.ejs',
		'//opstools/EmailNotifications/controllers/WizardRecipients.js',
        '//opstools/EmailNotifications/controllers/WizardNotifications.js',
        '//opstools/EmailNotifications/controllers/WizardTemplates.js',
        '//opstools/EmailNotifications/controllers/WizardDesign.js',
        '//opstools/EmailNotifications/controllers/WizardConfirm.js',
        '//opstools/EmailNotifications/controllers/Portal.js',
        
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.Wizard', {  
	  CONST: {
            RECIPIENT_NEXT: 'en-wiz-recipients-next',
            NOTIFICATIONS_NEXT: 'en-wiz-notifications-next',
            NOTIFICATIONS_SYSTEM_NEXT: 'en-wiz-notifications-system-next',
            TEMPLATE_NEXT: 'en-wiz-select-template-next',
            DESIGN_TEMPLATE_NEXT: 'en-wiz-design-template-next',
            CONFIRM: 'en-wiz-confirm'
            
        },

        init: function (element, options) {
            var self = this;
           
            options = AD.defaults({
            //        templateDOM: '//opstools/EmailNotifications/views/Wizard/Wizard.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);
			
			this.controllers ={};
			
			this.wizardData = {};
			this.notificationEditData = {};

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();

			 this.controllersAttach();
			 //this.getNotificationSetupStatus();

        },
        
	/**	@ controllersAttach
		 * 
		 * @param void.			
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		 
		controllersAttach: function() {
            var self = this;
			
            // Recipients Controller
            var Recipients = AD.Control.get('opstools.EmailNotifications.WizardRecipients');
        
            this.controllers.Recipients = new Recipients( this.element.find('.en-wizard-recipients'), {
                triggerNext:this.CONST.RECIPIENT_NEXT,
                wizardData : this.wizardData,
                 notificationEditData : this.options.notificationEditData
            });
            
            
            this.controllers.Recipients.on(this.CONST.RECIPIENT_NEXT, function() { 
			         self.controllersShow('Notifications');
            });


            // Notifications Controller
            var Notifications = AD.Control.get('opstools.EmailNotifications.WizardNotifications');
            this.controllers.Notifications = new Notifications(this.element.find('.en-wizard-formNotification'),{
				triggerNext:this.CONST.NOTIFICATIONS_NEXT,
				triggerNextSystem : this.CONST.NOTIFICATIONS_SYSTEM_NEXT,
				wizardData : this.wizardData,
				 notificationEditData : this.options.notificationEditData
				});          
            
            this.controllers.Notifications.on(this.CONST.NOTIFICATIONS_NEXT, function() { 
                self.controllersShow('Templates');
                
            });
            
            this.controllers.Notifications.on(this.CONST.NOTIFICATIONS_SYSTEM_NEXT, function() { 
                self.controllersShow('Templates');
            });
            
            
            
            // Template Controller
            var Templates = AD.Control.get('opstools.EmailNotifications.WizardTemplates');
            this.controllers.Templates = new Templates(this.element.find('.en-wizard-formTemplate'),{
				triggerNext:this.CONST.TEMPLATE_NEXT,
				 wizardData : this.wizardData,
				  notificationEditData : this.options.notificationEditData
				});
				
            
            this.controllers.Templates.on(this.CONST.TEMPLATE_NEXT, function() { 
                self.controllersShow('Design');
            });
            
            
            // Design Controller
            var Design = AD.Control.get('opstools.EmailNotifications.WizardDesign');
            this.controllers.Design = new Design(this.element.find('.en-wizard-selectDesign'),{
				triggerNext:this.CONST.DESIGN_TEMPLATE_NEXT,
				 wizardData : self.wizardData,
				  notificationEditData : this.options.notificationEditData
				
				});
			
			
			this.controllers.Design.on(this.CONST.DESIGN_TEMPLATE_NEXT, function() { 
				var data = {};
				var Recipient = AD.Model.get('opstools.EmailNotifications.ENRecipient');
				var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');
				
				if($.cookie('editNofication')!=undefined){
					var cookieNotifyVal = $.cookie('editNofication');
				}else{
					var cookieNotifyVal ='';
				}
				if($.cookie('editRecipient')!=undefined){				
				
				var cookieEditRecVal = $.cookie('editRecipient');
			}else{
					var cookieEditRecVal ='';
				}
								
				//var selecteRecipient = self.wizardData.recipients.id;//Selected Recipient Id
				//var selecteNotification = self.wizardData.notification.id; // selected notification id
				
				var selecteRecipient = (self.wizardData.recipients.id) ? self.wizardData.recipients.id : cookieEditRecVal;//Selected Recipient Id
				
				
				var selecteNotification = (self.wizardData.notification.id) ? self.wizardData.notification.id : cookieNotifyVal ; // selected notification id
				
				promiseRec = Recipient.findOne({id:selecteRecipient});   
				promiseNotify = Notification.findOne({id:selecteNotification});   
				
                can.when(promiseRec,promiseNotify).then(function (rec,notify) {
					
                    data.numRecipients = self.getNumRecipients(rec.recipients); 
                    data.notification = self.getNotification(notify); 
                    data.notification.templateDesignId = self.getTemplateData(notify.templateDesignId); 
                   
                   // console.log(data.notification);                                      
                    self.controllersShow('Confirm', data);
                });
					
            });
            
			 // Confirm Controller
            var Confirm = AD.Control.get('opstools.EmailNotifications.WizardConfirm');
            this.controllers.Confirm = new Confirm(this.element.find('.en-wizard-designConfirm'),{
				triggerNext:this.CONST.CONFIRM,
				 notificationEditData : this.options.notificationEditData,
				 wizardData : self.wizardData,
				 
				});
			
			this.controllers.Confirm.on(this.CONST.CONFIRM, function() {              
               self.controllersShow('Recipients');
               
                
            });
            
            this.controllersShow('Recipients'); // the 1st screen to show 
        },
		
		
		/**	@ controllersShow
		 * 
		 * @param key.		
		 * @param data.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		
		controllersShow: function( key, data ) {
		
            for (var k in this.controllers) {
                if (k == key) {
				
                    this.controllers[k].show(data);
                     // remove the existing 'active' setting on the nav entries
						this.element.find('li.en-wiz-nav').removeClass('active');
					   // find the entry associated with this panel and set it 'active'
						this.element.find('li.en-wiz-nav[panel="'+k+'"]').addClass('active');
                } else {
                    this.controllers[k].hide();
                }
            }
        },


        initDOM: function () {

           // this.element.html(can.view(this.options.templateDOM, {} ));

        },

		 show: function(data) {			
            this._super();  // do our normal show();
            this.controllersShow('Recipients',data);
        },

		'li.en-wiz-nav click' : function($el, ev) {
			var panel = $el.attr('panel');
			this.controllersShow(panel);
					
			
			
			//this.controllersShow(panel);
		},
		
		'.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },
        
        /**	@ getNumRecipients
		 * 
		 * @param recipient.		
		 *
		 * @return string
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		 
        
         getNumRecipients : function (recipient){
			   var selectedRecipient = recipient.split(',');
				var totalRecipient = selectedRecipient.length;
				 return totalRecipient;
				
			 },
			 
		/**	@ getTemplateData
		 * 
		 * @param template.		
		 *
		 * @return object
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	 
		 
		 getTemplateData : function (template){
				  var data ={};
				 data.templateSubject = template.templateTitle;
				 data.templateType = template.templateType;					
				 data.templateBody = template.templateBody;
				 return data;
			 },	
			
			
		/**	 @ getNotification
		 * 
		 * @param notification.		
		 *
		 * @return object
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	 
			 getNotification : function (notification){
				//console.log(notification);
				 var data ={};
				// console.log(notification)
				 var setupType ='';
				 data.id = notification.id;
				 data.notificationSubject = notification.emailSubject;
				 data.setupType = notification.setupType;
				 data.selectedTemplate = notification.notificationTitle;
				 //data.templateSubject = notification.templateDesignId.templateTitle;
				// data.templateType = notification.templateDesignId.templateType;					
				// data.templateBody = notification.templateDesignId.templateBody;					
					 
						if(notification.setupType=='System'){
							var setupShortDesc = notification.eventTrigger;
							
							}else{
								
								var setupShortDesc = notification.emailFrequency;
									setupShortDesc += ' from ';
									setupShortDesc += new Date(notification.startFrom).toDateString();
									if(notification.repeatUntil!=''){
										setupShortDesc += ' to '+ new Date(notification.repeatUntil).toDateString();
										}else{
											setupShortDesc += 'forever';
											
											}							
						}
					  data.setupShortDesc = setupShortDesc;
					return  data;
				},
			
 
    });

});
