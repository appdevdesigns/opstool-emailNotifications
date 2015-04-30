
steal(
        // List your Controller's dependencies here:
        'appdev',
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
                //    templateDOM: '//opstools/EmailNotifications/views/WizardDesign/WizardDesign.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


        },

	/*	'a.en-wiz-design-template-next click': function ($el, ev) {
			 this.form = this.element.find('#frmDesign-setup');
            this.element.trigger(this.options.triggerNext);
            ev.preventDefault();
        },*/

        initDOM: function () {
			// this.form = this.element.find('#frmDesign-setup');
			  this.form = this.element.find('#en-emailNotificationForm');
            //this.element.html(can.view(this.options.templateDOM, {} ));

        },
        
        'a.en-wiz-design-template-next click': function ($el, ev) {
			var self = this;
			var obj = this.formValues();
			
			if(this.validateData(obj)){
				
				
			//var values = this.form.find(':input').serializeArray();
			//alert(values);
			//console.log(values);
			
				//setSession();
				/*var Model = AD.Model.get('opstools.EmailNotifications.ENNotification');
					Model.create(obj)
						.fail(function(err){
						console.error(err);						
					})
					.then(function(data){							
										
					})*/	
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
		
		validateData : function(values){
			var self = this;
			var isValid = true; 
		
			isValid = isValid && (values.templateTitle != '');	
		/*	if(values.templateTitle !=''){					
						if(!this.isUniqueTemplateTitle(values.templateTitle)){
							isValid = false;
				
				  }	
				}*/
					
			isValid = isValid && (values.templateContent != '');			
						
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
		
		formErrors : function(values){
			
				var errors = [];
            
				if (typeof values == 'undefined') {
					values = this.formValues();
				}
				
				
				if (values.templateTitle == '') {
					errors.push('Notification title is required.');
				}/*else if(values.notificationTitle !=''){
				
								
						if(!this.isUniqueTitle(values.notificationTitle)){						
							errors.push("Title already exisit. Please add unique title");
							}
					
				}*/
            
				
				if (values.templateContent == '') {
					errors.push('Email subject is required.');
				}			
				
			
			return errors;
			
		 },

        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});
