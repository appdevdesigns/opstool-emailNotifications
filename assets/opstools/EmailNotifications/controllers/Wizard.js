steal(
    // List your Controller's dependencies here:
    'appdev',
    //'opstools/EmailNotifications/models/Projects.js',
    //'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //'//opstools/EmailNotifications/views/Wizard/Wizard.ejs',
    '//opstools/EmailNotifications/controllers/WizardRecipients.js', '//opstools/EmailNotifications/controllers/WizardNotifications.js', '//opstools/EmailNotifications/controllers/WizardTemplates.js', '//opstools/EmailNotifications/controllers/WizardDesign.js', '//opstools/EmailNotifications/controllers/WizardConfirm.js', '//opstools/EmailNotifications/controllers/Portal.js', function() {
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
            init: function(element, options) {
                var self = this;
                options = AD.defaults({
                    triggerCompleteNotification: 'complete-notification'
                
                }, options);
                this.options = options;
                // Call parent init
                this._super(element, options);
                this.controllers = {};
                this.currentController = null;
                this.dataSource = this.options.dataSource; // AD.models.Projects;
                this.initDOM();
                this.controllersAttach();              
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
                this.controllers.Recipients = new Recipients(this.element.find('.en-wizard-recipients'), {
                    triggerNext: this.CONST.RECIPIENT_NEXT,
                    wizardData: self.options.wizardData
                });
                this.controllers.Recipients.on(this.CONST.RECIPIENT_NEXT, function() {
                    self.controllersShow('Notifications');
                });
                // Notifications Controller
                var Notifications = AD.Control.get('opstools.EmailNotifications.WizardNotifications');
                this.controllers.Notifications = new Notifications(this.element.find('.en-wizard-formNotification'), {
                    triggerNext: this.CONST.NOTIFICATIONS_NEXT,
                    triggerNextSystem: this.CONST.NOTIFICATIONS_SYSTEM_NEXT,
                    wizardData: self.options.wizardData
                });
                this.controllers.Notifications.on(this.CONST.NOTIFICATIONS_NEXT, function() {
                    self.controllersShow('Templates');
                });
                this.controllers.Notifications.on(this.CONST.NOTIFICATIONS_SYSTEM_NEXT, function() {
                    self.controllersShow('Templates');
                });
                // Template Controller
                var Templates = AD.Control.get('opstools.EmailNotifications.WizardTemplates');
                this.controllers.Templates = new Templates(this.element.find('.en-wizard-formTemplate'), {
                    triggerNext: this.CONST.TEMPLATE_NEXT,
                    wizardData: self.options.wizardData
                });
                this.controllers.Templates.on(this.CONST.TEMPLATE_NEXT, function() {
                    self.controllersShow('Design');
                });
                // Design Controller
                var Design = AD.Control.get('opstools.EmailNotifications.WizardDesign');
                this.controllers.Design = new Design(this.element.find('.en-wizard-selectDesign'), {
                    triggerNext: this.CONST.DESIGN_TEMPLATE_NEXT,
                    wizardData: self.options.wizardData
                });
                
                this.controllers.Design.on(this.CONST.DESIGN_TEMPLATE_NEXT, function() {
                    var data = {};
                    var Recipient = AD.Model.get('opstools.EmailNotifications.ENRecipient');
                    var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');
                    var selecteRecipient = self.options.wizardData.recipient.id;
                    var selecteNotification = self.options.wizardData.notification.id;
                    promiseRec = Recipient.findOne({
                        id: selecteRecipient
                    });
                    promiseNotify = Notification.findOne({
                        id: selecteNotification
                    });
                    can.when(promiseRec, promiseNotify).then(function(rec, notify) {
                        var data = {};
                        data.numRecipients = self.getNumRecipients(rec.recipients);
                        data.notification = self.getNotification(notify);
                        // this will fire when both ajax will complete
                        if (notify.templateDesignId !== undefined) {
                            data.notification.templateDesignId = self.getTemplateData(notify.templateDesignId);
                            self.controllersShow('Confirm', data);
                        }
                       
                    });
                });
                // Confirm Controller
                var Confirm = AD.Control.get('opstools.EmailNotifications.WizardConfirm');
                this.controllers.Confirm = new Confirm(this.element.find('.en-wizard-designConfirm'), {
                    triggerNext: this.CONST.CONFIRM,
                    wizardData: self.options.wizardData
                });
                this.controllers.Confirm.on(this.CONST.CONFIRM, function() {
                  // empty form values if any for new notification
                  self.clearWizard();

                  self.element.trigger(self.options.triggerCompleteNotification);

                });

            },

            /**
             * This clear ups the various forms in wizard
             *
             * @return void
             */
            clearWizard: function () {

              this.controllers.Notifications.form.find('#notificationTitle').val('');
              this.controllers.Notifications.form.find('#emailSubject').val('');
              this.controllers.Notifications.form.find('#fromName').val('');
              this.controllers.Notifications.form.find('#fromEmail').val('');
              this.controllers.Notifications.form.find('#dateStartFrom').val('');
              this.controllers.Notifications.form.find('#emailFrequency').val('Everyday');
              this.controllers.Notifications.form.find('#dateRepeatUntil').val('');
              this.controllers.Notifications.form.find('#basic-settings').html('The Notification will be sent <a href="#"> Everyday</a>');
              this.controllers.Notifications.form.find('#eventTrigger').val('');

              this.controllers.Notifications.element.find('.tabbable ul li:nth-child(2)').removeClass('active');
              this.controllers.Notifications.element.find('.tabbable ul li:nth-child(1)').addClass('active');
              this.controllers.Notifications.element.find('#basic').addClass('active');
              this.controllers.Notifications.element.find('#system').removeClass('active');

              ////////////////////////////////////
              // clear design a template page
              this.controllers.Design.form.find('#templateTitle').val('');
              this.controllers.Design.form.find('#templateBody').val('');
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
            controllersShow: function(key, data) {
                for (var k in this.controllers) {
                    if (k == key) {
                        this.controllers[k].show(data);
                        this.currentController = key;
                        if (key !== 'Recipients') {
                          this.element.find('.en-header-back').show();
                        } else {
                          this.element.find('.en-header-back').hide();
                        }
                        // remove the existing 'active' setting on the nav entries
                        this.element.find('li.en-wiz-nav').removeClass('active');
                        // find the entry associated with this panel and set it 'active'
                        this.element.find('li.en-wiz-nav[panel="' + k + '"]').addClass('active');
                    } else {
                        this.controllers[k].hide();
                    }
                }
            },
            initDOM: function() {
              this.element.find('.en-header-back').hide();           
            },
            show: function(data) {
                this._super(); // do our normal show();
                this.controllersShow('Recipients', data);
            },
            
            /**	@ en-wiz-nav click
             *
             * @param 
             *
             * @return void
             *
             * @author Jack
             * @since 15 May 2015
             */
            
            'li.en-wiz-nav click': function($el, ev) {
                var result = null;
                var panel = $el.attr('panel');              
                if(this.currentController === 'Notifications') {
                 NotificationCtrl = this.controllers.Notifications;
               
                var tabClass = NotificationCtrl.element.find('.tabbable ul li:nth-child(1)').hasClass('active');
                if (tabClass) {
                  result = NotificationCtrl.updateBasicNotification(true);
                } else {
                  result = NotificationCtrl.updateSystemNotification(true);
                }
                if(!result)
                   return;
                }
                
                if(this.currentController === 'Design'){
					 DesignCtrl = this.controllers.Design;
					 DesignCtrl.saveDesign();
				}
				
                switch (panel) {
                  case "Notifications":
                    if (this.currentController == 'Recipients') {
                      if (this.options.wizardData.recipient.id === undefined) {
                        bootbox.dialog({
                            title: "",
                            message: '<div class="msg-box">Please select a recipient first.</div>'
                        });
                        return;
                      }
                    }
                    break;
                  case "Templates":
                  case "Design":
                  case "Confirm":
                    if (this.currentController == 'Recipients' || this.currentController == 'Notifications') {
                      if (this.options.wizardData.recipient.id === undefined) {
                        bootbox.dialog({
                            title: "",
                            message: '<div class="msg-box">Please select a recipient first.</div>'
                        });
                        return;
                      }
                      else if(this.options.wizardData.notification.id === undefined) {
                        bootbox.dialog({
                            title: "",
                            message: '<div class="msg-box">Please setup the notification first.</div>'
                        });
                        return;
                        
                      }else{
							var Design = this.controllers.Design;
							Design.element.trigger('en-wiz-design-template-next');
							return;
						  }
                    }
                    else if(panel=='Confirm') {
                      if (this.options.wizardData.templateDesign.id === undefined) {
                        bootbox.dialog({
                            title: "",
                            message: '<div class="msg-box">Please design a template first.</div>'
                        });
                        return;
                      }
                      var Design = this.controllers.Design;
                      Design.element.trigger('en-wiz-design-template-next');
                      return;
                    }
                }              
                this.controllersShow(panel);             
            },
			
			/**	@ Header Back button click
             *
             * @param 
             *
             * @return void
             *
             * @author Jack
             * @since 15 May 2015
             */
             
            '.en-header-back click': function($el, ev) {
              //TODO: will get currently shown controller and proceed with that
              switch (this.currentController) {
                case 'Notifications':
                  this.controllersShow('Recipients');
                  break;
                case 'Templates':
                  this.controllersShow('Notifications');
                  break;
                case 'Design':
                  this.controllersShow('Templates');
                  break;
                case 'Confirm':
                  this.controllersShow('Design');

              }
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
            getNumRecipients: function(recipient) {
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
             
            getTemplateData: function(template) {
                var data = {};
                data.templateTitle = template.templateTitle;
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
            getNotification: function(notification) {
            
                var data = {};
              
                var setupType = '';
                data.id = notification.id;
                data.notificationSubject = notification.emailSubject;
                data.setupType = notification.setupType;
                if (notification.setupType == 'System') {
                    var setupShortDesc = notification.eventTrigger;
                } else {
                    var setupShortDesc = notification.emailFrequency;
                    setupShortDesc += ' from ';
                    setupShortDesc += new Date(notification.startFrom).toDateString();
                    if (notification.repeatUntil != '0000-00-00') {
                        setupShortDesc += ' to ' + new Date(notification.repeatUntil).toDateString();
                    } else {
                        setupShortDesc += '';
                    }
                }
                data.setupShortDesc = setupShortDesc;
                return data;
            },
        });
    });
