
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/EmailNotifications/models/ENTemplateDesign.js',
        'opstools/EmailNotifications/models/ENNotification.js',
//        'opstools/EmailNotifications/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //    '//opstools/EmailNotifications/views/WizardDesign/WizardDesign.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardDesign', {  

        init: function (element, options) {
            var self = this;
            options = AD.defaults({
				triggerNext: 'next'
                //templateDOM: '//opstools/EmailNotifications/views/WizardDesign/WizardDesign.ejs'
            }, options);
            this.options = options;
			this.options.wizardData.design = {};//	
            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


        },


        initDOM: function () {
			this.form = this.element.find('#frmDesign-setup');				
            //this.element.html(can.view(this.options.templateDOM, {} ));
           

        },
        
        /**	@ design-template-next click
		 * 
		 * @param $el.		
		 * @param ev.		
		 *
		 * @return bool
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		 
        'a.en-wiz-design-template-next click': function ($el, ev) {
			var self = this;					
			var obj = this.formValues();
			var templateId	='';
			var notificationId ='';		
			if(this.validateData(obj)){
				
			var Model = AD.Model.get('opstools.EmailNotifications.ENTemplateDesign');
				//console.log(self.options.notificationEditData);
			var notificationId = 	this.options.notificationEditData.id;	
			
				if(notificationId !=undefined){	
					if(this.options.notificationEditData.notificationData.templateDesignId != undefined){
								//alert('update1');
									var	templateId = 	this.options.notificationEditData.notificationData.templateDesignId;
										
									Model.update(templateId.id,obj).fail(function(err){
										console.error(err);						
									})
									.then(function(data){
									
										self.element.trigger(self.options.triggerNext);	
									})
						}else{
														
								Model.create(obj).fail(function(err){
									console.error(err);						
								})
								.then(function(data){											
									var Notifications = AD.Model.get('opstools.EmailNotifications.ENNotification');
										Notifications.update(notificationId,{'templateDesignId': data.id}).then(function(){
											self.element.trigger(self.options.triggerNext);											
											});							
								})
							}	
					
					}else{
						
					Model.create(obj).fail(function(err){
						console.error(err);						
					})
					.then(function(data){											
						var Notifications = AD.Model.get('opstools.EmailNotifications.ENNotification');
						var NotificationId = self.options.wizardData.notification.id;										
							Notifications.update(NotificationId,{'templateDesignId': data.id}).then(function(){
											self.element.trigger(self.options.triggerNext);											
							});														
															
					})
				}		
				 
				self.element.trigger(this.options.triggerNext);		
				ev.preventDefault();		
            
			}else{
				
				var errors = this.formErrors(obj);

					if (errors.length>0) {

						bootbox.dialog({
							message: 'Please fix these errors before trying again:<br>'+errors.join('<br>'),
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
		
		
		/**	@ validateData
		 * 
		 * @param values.		
		 *
		 * @return bool
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		 
		validateData : function(values){
			var self = this;
			var isValid = true; 
		
			isValid = isValid && (values.templateTitle != '');	
			/*if(values.templateTitle !=''){					
						if(!this.isUniqueTemplateTitle(values.templateTitle)){
							isValid = false;				
				  }	
				}*/
					
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
            values.forEach(function(val){               
					
                    obj[val.name] = can.trim(val.value);                
                
            })            

            return obj;
        },
		
		/**	@ formErrors
		 * 
		 * @param values.		
		 *
		 * @return object
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */	
		 
		formErrors : function(values){
			
				var errors = [];
            
				if (typeof values == 'undefined') {
					values = this.formValues();
				}
				
				
				if (values.templateTitle == '') {
					errors.push('Template title is required.');
				}/*else if(values.notificationTitle !=''){
				
								
						if(!this.isUniqueTitle(values.notificationTitle)){						
							errors.push("Title already exisit. Please add unique title");
							}
					
				}*/
            
				
				if (values.templateBody == '') {
					errors.push('Design content is required.');
				}			
				
			
			return errors;
			
		 },

        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});
