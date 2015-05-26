steal(
    // List your Controller's dependencies here:
    'appdev', 'opstools/EmailNotifications/models/ENNotification.js',
    //'opstools/EmailNotifications/api/ENNotificationController.js',
    //        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //     '//opstools/EmailNotifications/views/WizardNotifications/WizardNotifications.ejs',
    function() {
        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.extend('opstools.EmailNotifications.WizardNotifications', {
            init: function(element, options) {
                var self = this;
                options = AD.defaults({
                    triggerNext: 'next',
                    triggerNextSystem: 'next'
                }, options);
                this.options = options;
                // Call parent init
                this._super(element, options);
                this.editData = {};
                this.dataSource = this.options.dataSource; // AD.models.Projects;
                this.initDOM();
                //// Add Activity Modal:
              
                this.startDate = this.element.find('#startFrom'); //Start From control             
                
                this.repeatUntil = this.element.find('#repeatUntil');// RepeatUntil control
               
               // Datepicker options
               var calendarOptions = {
						format: "MM/DD/YYYY",
						minDate: new Date()
						
					};               
                
                this.startDate.datetimepicker(calendarOptions).on('dp.change',function(e){
					self.updateNotificationBar(); // Update notification bar
					});
					
                this.repeatUntil.datetimepicker(calendarOptions).on('dp.change', function(e) {
                 
                    self.updateNotificationBar(); // Update notification bar
                });
                
                
            },
            
            initDOM: function() {
                     this.form = this.element.find('#frmNotification-setup');
            },
           
           
            /**
             * @en-wiz-notifications-system-next click
             *
             * @param $el
             * @param ev
             *
             * return bool
             *
             */
            'a.en-wiz-notifications-system-next click': function($el, ev) {
                this.updateSystemNotification();
            },
			
			/**
             * @updateSystemNotification
             *
             * @param external
             *
             * @return bool
             * @author Edwin
             * since 15 April 2015
             */
             
            updateSystemNotification: function(external) {
              var self = this;
              var obj = this.formValues();
              if (this.validateFormData(obj) && this.validateSystemTab(obj)) {
                  var Model = AD.Model.get('opstools.EmailNotifications.ENNotification');
                  obj.recipientId = self.options.wizardData.recipient.id;
                  if(this.element.find('.tabbable ul li').eq(0).hasClass('active')) {
                      obj.setupType = 'Basic';
                      obj.eventTrigger = '';
                      obj.nextNotificationDate = obj.startFrom;
                  } else {
                      obj.setupType = 'System';
                      obj.startFrom = null;
                      obj.repeatUntil = null;
                  }
                  var notificationId = self.options.wizardData.notification.id;
                  if (notificationId !== undefined) {
                      Model.update(self.options.wizardData.notification.id, obj); //Update notificationId
                  } else {
                      Model.create(obj).fail(function(err) {
                          console.error(err);
                      }).then(function(data) {
                          self.options.wizardData.notification.id = data.id; //
                      })
                  }
                  if(external == undefined)
                    self.element.trigger(this.options.triggerNextSystem);
              } else {
                  var errors = this.formErrors(obj);
                  if (errors.length > 0) {
                      bootbox.dialog({
                          message: 'Please fix these errors before trying again:<br>' + errors.join('<br>'),
                          title: 'Invalid Form Data',
                          buttons: {
                              main: {
                                  label: 'OK',
                                  className: "btn-primary",
                                  callback: function() {}
                              }
                          }
                      });
                      return false;
                  }
              }
              return true;
            },

            /**
             * @en-wiz-notifications-next click
             *
             * @param $el
             * @param ev
             *
             * return bool
             *
             */
            'a.en-wiz-notifications-next click': function($el, ev) {
                this.updateBasicNotification();
            },

			/**
             * @updateBasicNotification
             *
             * @param external
             *
             * @return bool
             * @author Edwin
             * since 15 April 2015
             */

            updateBasicNotification: function (external) {
				
              var self = this;
              /*Validation fields*/
              var obj = {};
              var obj = this.formValues();
              if (this.validateFormData(obj) && this.validateBasicTab(obj)) {
                  var Model = AD.Model.get('opstools.EmailNotifications.ENNotification');
                  obj.recipientId = self.options.wizardData.recipient.id;
                  if (obj.startFrom != '') {
                      obj.setupType = 'Basic';
                      obj.eventTrigger = '';
                      obj.nextNotificationDate = obj.startFrom;
                  } else {
                      obj.setupType = 'System';
                  }
                  
                  if(obj.neverEnd=='on'){
					   obj.repeatUntil = '';
					  }
					  
                  var notificationId = self.options.wizardData.notification.id;
                  if (notificationId) {
                      Model.update(notificationId, obj); //Update notificationId
                  } else {
                      Model.create(obj).fail(function(err) {
                          console.error(err);
                      }).then(function(data) {
                          self.options.wizardData.notification.id = data.id; //
                      })
                  }
                 
                  if (external == undefined)
                    self.element.trigger(self.options.triggerNext); //
                    
              } else {
                  var errors = this.formErrors(obj, 'basicTab');
                  if (errors.length > 0) {
                      bootbox.dialog({
                          message: 'Please fix these errors before trying again:<br>' + errors.join('<br>'),
                          title: 'Invalid Form Data',
                          buttons: {
                              main: {
                                  label: 'OK',
                                  className: "btn-primary",
                                  callback: function() {}
                              }
                          }
                      });
                      return false;
                  }
              }
              return true;
            },
            
            /**
             * @fromValues
             *
             * get the input fields and return as array
             *
             */
            formValues: function() {
                var values = this.form.find(':input').serializeArray();
                var obj = {};
                values.forEach(function(val) {
                    obj[val.name] = can.trim(val.value);
                })
                return obj;
            },
            /**
             * @function validateFormData
             *
             * @param values
             *
             * return bool
             *
             */
            validateFormData: function(values) {
                var self = this;
                var isValid = true;
                var notificationId = self.options.wizardData.notification.id;
                isValid = isValid && (values.notificationTitle != '');
                if (values.notificationTitle != '') {
                    if (!this.isUniqueTitle(values)) {
                        isValid = false;
                    }
                }
                isValid = isValid && (values.emailSubject != '');
                isValid = isValid && (values.fromName != '');
                isValid = isValid && (values.fromEmail != '') && self.validateEmail(values.fromEmail);
                return isValid;
            },
            /**
             * @function validateSystemTab
             *
             * @param values
             *
             * return bool
             *
             */
            validateSystemTab: function(values) {
                var self = this;
                return true;
            },
            /**
             * @function validateBasicTab
             *
             * @param values
             *
             * return bool
             *
             */
            validateBasicTab: function(values) {
                var self = this;
                if (values.startFrom == '') {
                    return false;
                } else if (values.startFrom != '') {
                    /*if(!this.validateDates(values)){
								return false;
							}*/
                    if (values.repeatUntil != '') {
                        if (values.emailFrequency == 'Everyday') {
                            if (Date.parse(values.repeatUntil) <= Date.parse(values.startFrom)) {
                                return false;
                            }
                        } else if (values.emailFrequency == 'Monthly') {
                            var now = new Date();
                            var m = now.getMonth() + 1;
                            var nextMonth = now.setMonth(m);
                            if (Date.parse(values.repeatUntil) < nextMonth) {
                                return false;
                            }
                        } else if (values.emailFrequency == 'Yearly') {
                            var now = new Date();
                            var y = now.getFullYear() + 1;
                            var nextYear = now.setFullYear(y);
                            if (Date.parse(values.repeatUntil) < nextYear) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (values.repeatUntil == '' && values.neverEnd != 'on') {
                    return false;
                }
                return true;
            },
            /**
             * @function formErrors
             *
             * @param values
             *
             * return bool
             *
             */
            formErrors: function(values, tabValue) {
                var errors = [];
                if (typeof values == undefined) {
                    values = this.formValues();
                }
                if (values.notificationTitle == '') {
                    errors.push('Notification title is required.');
                } else if (values.notificationTitle != '') {
                    if (!this.isUniqueTitle(values)) {
                        errors.push("Title already exisit. Please add unique title");
                    }
                }
                if (values.emailSubject == '') {
                    errors.push('Email subject is required.');
                }
                if (values.fromName == '') {
                    errors.push('From name is required.');
                }
                if (values.fromEmail == '') {
                    errors.push('From email is required.');
                } else if (!this.validateEmail(values.fromEmail)) {
                    errors.push('Invalid from email.');
                }
                // If tab is basic active
                if (tabValue == 'basicTab') {
                    if (values.startFrom == '') {
                        errors.push('Start date is required.');
                    }
                    if (values.repeatUntil == '' && values.neverEnd != 'on') {
                        errors.push('Please select one option either repeat until or never end.');
                    }
                    if (values.repeatUntil != '') {
                        if (values.emailFrequency == 'Everyday') {
                            if (Date.parse(values.repeatUntil) <= Date.parse(values.startFrom)) {
                                errors.push('Repeat date should be greater than start date.');
                            }
                        } else if (values.emailFrequency == 'Monthly') {
                            var now = new Date();
                            var m = now.getMonth() + 1;
                            var nextMonth = now.setMonth(m);
                            if (Date.parse(values.repeatUntil) < nextMonth) {
                                errors.push('Repeat date should be greater than one month from start date.');
                            }
                        } else if (values.emailFrequency == 'Yearly') {
                            var now = new Date();
                            var y = now.getFullYear() + 1;
                            var nextYear = now.setFullYear(y);
                            if (Date.parse(values.repeatUntil) < nextYear) {
                                errors.push('Repeat date should be greater than one year from start date.');
                            }
                        }
                    }
                } // end Basic tab
                return errors;
            },
            /**
             * @function isUniqueTitle
             * @param values
             * return bool
             */
            isUniqueTitle: function(values) {
				var self = this;
                var notificationController = '/opstool-emailNotifications/ennotification/isUniqeNotificationTitle';
                var notificationId = self.options.wizardData.notification.id;
                var isValidated = false;
                var params = {};
				  params.title = values.notificationTitle;
					if (notificationId) {
					  params.id = notificationId;
					}
                $.ajax({
                    url: notificationController,
                    data: params,
                    async: false,                    
                    success: function(result) {
                        if(result.length > 0){
								isValidated = false;
							}else{
								isValidated = true;	
						}
                    }
                });
                return isValidated;
            },
            /**
             * @function validateEmail
             * @param value
             * return bool
             */
            validateEmail: function(value) {
                var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return (regex.test(value)) ? true : false;
            },
            /**
             * @ to diable the repeat until field
             *
             */
            '#neverEnd click': function($el, ev) {
                 var obj = this.formValues();
                 var self = this;
                if (obj.neverEnd == 'on') {
                    this.element.find('#dateRepeatUntil').val(' ');
                    this.element.find('#dateRepeatUntil').attr('disabled', true);
                    this.element.find('#dateRepeatUntil').hide();
                    this.element.find('#no-date').show();
                    this.element.find('#repeatUntil .input-group-addon').hide();
                } else {
                    this.element.find('#dateRepeatUntil').show();
                    this.element.find('#no-date').hide();
                    this.element.find('#dateRepeatUntil').attr('disabled', false);
                    this.element.find('#repeatUntil .input-group-addon ').show();
                }
                self.updateNotificationBar();
            },
            
            
           /**
             * @updateNotificationBar
             * @ to update notification bar
             * @param $el
             * @param ev
             *
             * return void
             *
             */
             
            updateNotificationBar :function ($el, ev) {
					var startFromDate = '';
					var repeatFrequency = '';
					var repeatUntilDate = '';
					var self =  this;
					startFromDate = self.getStartFrom();
					repeatFrequency = self.getRepeatFrequency();
					repeatUntilDate = self.getRepeatUntil();
					
					var neverEnd = this.element.find('#neverEnd').is(":checked") ? 1 : 0;
					
					var notificationContent = 'The Notification will be sent ';
					
					if(repeatFrequency !=''){
						  notificationContent += '<a href="#"> '+ repeatFrequency +'</a>';
						}
						
					if(startFromDate!==''){
						 notificationContent += ' from <span>'+ startFromDate +'</span>';
						}
						
					if(repeatUntilDate!== '' && neverEnd == 0){
						 notificationContent += ' to <span>'+ repeatUntilDate+'</span>';
						}
						
						
					 this.element.find('#basic-settings').html(notificationContent);	
						
					
			},
			
			 /**
             * @ getStartFrom
             * @ to get notification start from date
             * @ param $el
             * @ param ev
             * return void
             */
             
			getStartFrom : function($el, ev){
				 return this.element.find('#dateStartFrom').val();
				},
			
			/**
             * @ getRepeatFrequency
             * @ to get notification email frequency
             * @ param $el
             * @ param ev
             * return void
             */
             	
			getRepeatFrequency : function(){
					 return this.element.find('#emailFrequency').val();
				},
			
			/**
             * @ getRepeatUntil
             * @ to get notification repeat until date
             * @ param $el
             * @ param ev
             * return void
             */
             
			getRepeatUntil :function(){
					return this.element.find('#dateRepeatUntil').val();
				},
				
			/**
             * @ emailFrequency change
             * @ to chage the notification bar
             * @ param $el
             * @ param ev
             * return void
             */
             '#emailFrequency change': function($el, ev) {
					var self = this; 
					self.updateNotificationBar(); 
				 }
             			
			
        });
    });
