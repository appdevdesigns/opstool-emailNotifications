steal(
    // List your Controller's dependencies here:
    'appdev', 'opstools/EmailNotifications/models/ENTemplateDesign.js', 'opstools/EmailNotifications/models/ENNotification.js',
    //        'opstools/EmailNotifications/models/Projects.js',
    //        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //    '//opstools/EmailNotifications/views/WizardDesign/WizardDesign.ejs',
    function() {
        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.extend('opstools.EmailNotifications.WizardDesign', {
            init: function(element, options) {
                var self = this;
                options = AD.defaults({
                    triggerNext: 'next'
                    //templateDOM: '//opstools/EmailNotifications/views/WizardDesign/WizardDesign.ejs'
                }, options);
                this.options = options;
                // Call parent init
                this._super(element, options);
                this.dataSource = this.options.dataSource; // AD.models.Projects;
                this.initDOM();
            },
            initDOM: function() {
                this.form = this.element.find('#frmDesign-setup');
                //this.element.html(can.view(this.options.templateDOM, {} ));
            },
            
            /** @ design-template-next click
             *
             * @param $el.
             * @param ev.
             *
             * @return bool
             *
             * @author Edwin
             * @since 30 March 2015
             */
               'a.en-wiz-design-template-next click': function($el, ev) {
					ev.preventDefault();
					this.saveDesign();
                
				},
			
			/** @ saveDesign
             *
             * @param null            
             *
             * @return bool
             *
             * @author Edwin
             * @since 30 april 2015
             */	
				
              saveDesign : function (){
				
				var self = this;
                var obj = this.formValues();
                
				if (this.validateData(obj)) {
                    var Model = AD.Model.get('opstools.EmailNotifications.ENTemplateDesign');
                    var templateId = this.options.wizardData.templateDesign.id;
                    // if templateId exists then update existing one
                    if (templateId !== undefined) {
                        Model.update(templateId, obj).fail(function(err) {
                            console.error(err);
                        }).then(function(data) {
                            self.syncTemplateWithNotification(data).then(function (data) {
                              self.element.trigger(self.options.triggerNext);
                            });

                        });
                    } else {
                        // Create new template and attach to notification (if exists)
                        Model.create(obj).fail(function(error) {
                            console.log(error);
                        }).then(function(data) {
                            self.syncTemplateWithNotification(data).then(function (data) {

                              self.element.trigger(self.options.triggerNext);
                            });
                        })
                    }
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
                    }
                }
				
			},
			
           /** @ syncTemplateWithNotification
             *
             * @param template
             *
             * @return bool
             *
             * @author Jack
             * @since 18 May 2015
             */
                     
            syncTemplateWithNotification: function(template) {
                var notificationId = this.options.wizardData.notification.id;
                if (notificationId === undefined) return;
                // Attach template to wizardData
                this.options.wizardData.templateDesign = template;
                var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');

                return Notification.update(notificationId, {
                    templateDesignId: template.id
                }).fail(function(error) {
                    console.log('Could not attach template to notification! See next log');
                    console.log(error);
                });
            },
            /** @ validateData
             *
             * @param values.
             *
             * @return bool
             *
             * @author Edwin
             * @since 30 March 2015
             */
            validateData: function(values) {
                var self = this;
                var isValid = true;
                isValid = isValid && (values.templateTitle != ''); 
                 if (values.templateTitle != '') {
                    if (!this.isUniqueTitle(values)) {
                        isValid = false;
                    }
                }                 
                isValid = isValid && (values.templateBody != '');
                return isValid;
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
            /** @ formErrors
             *
             * @param values.
             *
             * @return object
             *
             * @author Edwin
             * @since 30 March 2015
             */
            formErrors: function(values) {
                var errors = [];
                if (typeof values == 'undefined') {
                    values = this.formValues();
                }
                if (values.templateTitle == '') {
                    errors.push('Template title is required.');
                }else if (values.templateTitle != '') {
                    if (!this.isUniqueTitle(values)) {
                        errors.push("Title already exisit. Please add unique title");
                    }
                }
               
                if (values.templateBody == '') {
                    errors.push('Design content is required.');
                }
                return errors;
            },
            
            /**
             * @function isUniqueTitle
             * @param values
             * return bool
             */
             
            isUniqueTitle: function(values) {
				var self = this;				
				var templateId = this.options.wizardData.templateDesign.id;			
                var templatedesignController = '/opstool-emailNotifications/entemplatedesign/isUniqeDesignTitle';
                var isValidated = false;
                var params = {};
				  params.title = values.templateTitle;
					if (templateId) {
					  params.id = templateId;
					}
					
                $.ajax({
                    url: templatedesignController,
                    data: params,
                    async: false,
                    success: function(result) {
					
						console.log(result);
						if(result.length > 0){
								isValidated = false;
							}else{
								isValidated = true;	
						}
                    }
                });
                return isValidated;
            },
            
            '.ad-item-add click': function($el, ev) {
                ev.preventDefault();
            }
        });
    });
