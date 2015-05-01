steal(
        // List your Controller's dependencies here:
        'appdev',
//        'opstools/EmailNotifications/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
   //     '//opstools/EmailNotifications/views/Wizard/Wizard.ejs',
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

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();

			 this.controllersAttach();

        },
        

		controllersAttach: function() {
            var self = this;
			
            // Recipients Controller
            var Recipients = AD.Control.get('opstools.EmailNotifications.WizardRecipients');
        
            this.controllers.Recipients = new Recipients( this.element.find('.en-wizard-recipients'), {
                triggerNext:this.CONST.RECIPIENT_NEXT
            });
            
            this.controllers.Recipients.on(this.CONST.RECIPIENT_NEXT, function() { 
                self.controllersShow('Notifications');
            });


            // Notifications Controller
            var Notifications = AD.Control.get('opstools.EmailNotifications.WizardNotifications');
            this.controllers.Notifications = new Notifications(this.element.find('.en-wizard-formNotification'),{
				triggerNext:this.CONST.NOTIFICATIONS_NEXT,
				triggerNextSystem : this.CONST.NOTIFICATIONS_SYSTEM_NEXT,
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
				triggerNext:this.CONST.TEMPLATE_NEXT
				});
				
            
            this.controllers.Templates.on(this.CONST.TEMPLATE_NEXT, function() { 
                self.controllersShow('Design');
            });
            
            
            // Design Controller
            var Design = AD.Control.get('opstools.EmailNotifications.WizardDesign');
            this.controllers.Design = new Design(this.element.find('.en-wizard-selectDesign'),{
				triggerNext:this.CONST.DESIGN_TEMPLATE_NEXT
				});
			
			this.controllers.Design.on(this.CONST.DESIGN_TEMPLATE_NEXT, function() { 
				
				var data = {};
		//Right now added only one function for check issue
				numRecipients = self.controllers.Recipients.getNumRecipients();//To get Recipient Numbers
				console.log(numRecipients);
				
                self.controllersShow('Confirm',data);
            });
            
			 // Confirm Controller
            var Confirm = AD.Control.get('opstools.EmailNotifications.WizardConfirm');
            this.controllers.Confirm = new Confirm(this.element.find('.en-wizard-designConfirm'),{
				triggerNext:this.CONST.CONFIRM
				});
			
			this.controllers.Confirm.on(this.CONST.CONFIRM, function() { 
                self.controllersShow('Portal');
            });
            
            this.controllersShow('Recipients'); // the 1st screen to show 
        },

		
		controllersShow: function( key, data ) {
			
            for (var k in this.controllers) {
                if (k == key) {
				
                    this.controllers[k].show();
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

		 show: function() {
            this._super();  // do our normal show();
            this.controllersShow('Recipients');
        },

		'li.en-wiz-nav click' : function($el, ev) {
			var panel = $el.attr('panel');
			this.controllersShow(panel);
		},
		
		'.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});
