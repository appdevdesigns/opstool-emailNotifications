
steal(
        // List your Controller's dependencies here:
        'appdev',
		'opstools/EmailNotifications/models/ENRecipient.js',
   //    'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
  //      '//opstools/EmailNotifications/views/WizardRecipients/WizardRecipients.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardRecipients', {  

        init: function (element, options) {
            var self = this;
            options = AD.defaults({
				triggerNext: 'next'
            //  templateDOM: '//opstools/EmailNotifications/views/WizardRecipients/WizardRecipients.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);
			this.dom = {};              // track any DOM elements we are interested in

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();
			this.recipientsLoad();

        },



        initDOM: function () {
			var self = this;
           // this.element.html(can.view(this.options.templateDOM, {} ));
           // attach to the [Next] button.
			this.dom.next = this.element.find('a.en-wiz-recipients-next');
			this.popup = this.element.find('div #myModal');
			this.nextDisable();
    
           var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
           this.FilteredTable = new Filter( this.element,{
				tagFilter:'.en-recipient-search',
				tagBootstrapTable:'.en-table-recipients',
				scrollToSelect:true,
				filterTable:true,
				cssSelected:'en-table-row-active template',
				 dataToTerm: function(model) {  
						if (model) {
							return model.title;
						} else {
							return '';
						}
					},
					
				 rowClicked:function(data) {
					
					if (data) {
						self.nextEnable();
					}

				},
				
				  rowDblClicked: function(data) {
					// if they dbl-click a row,
					// just continue on as if they clicked [next]
					if (data) {
						self.nextEnable();
						self.dom.next.click();
					}
				}
					
				
			   });
			
           // this.modalAdd = this.element.find(".en-add-recipients-form"); 
            this.form = this.element.find('.en-add-recipients-form');
 
			   			  
        },
        
        
        /**
         * @function formClear
         * To reset values 
         */
         
        formClear:function() {
            this.form.find(':input:not(:checkbox)').val('');
            this.form.find(':checkbox').prop('checked', false);
        },

        
        /**
         * @function formErrors
         * 
         */
         
         formErrors: function(values) {

            var errors = [];
            
            if (typeof values == 'undefined') {
                values = this.formValues();
            }
			

            if (values.title == '') {
                errors.push('Title is required.');
            }
            else if(values.title !=''){	
				
					if(values.recipient_id=='undefined' || values.recipient_id ==''){			
						if(!this.isUniqueTitle(values.title)){						
							errors.push("Title already exisit. Please add unique title");
							}
					}	
				}
            
        
            if (values.recipients == '') {
                errors.push('Recipients is required.');
            }else if(values.recipients!=''){
				
					if(!this.validateEmails(values.recipients)){
							errors.push('Recipients email not valid.');
					}
						
				}

            return errors;
        },
        
        /**
         * @function formErrors
         * 
         */
         
        validateEmail: function(value) {
				var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				return (regex.test(value)) ? true : false;
		},
		
		/**
         * @function formErrors
         * 
         */
         
		validateEmails: function(string) {
			//var self = shareEmail;
			var result = string.replace(/\s/g, "").split(/,|;/);

			for(var i = 0;i < result.length;i++) {
				if(!this.validateEmail(result[i])) {
					return false;
				}
			}

			return true;
		},
        
        
        isUniqueTitle :function(values){
			var recipientController = '/opstool-emailNotifications/enrecipient/isUniqeTitle';
			var isValidated = false;
				  $.ajax({
						url: recipientController,
						data: {'title':values},	
						async: false,						
						error : function(xhr,status){						
							isValidated = false;
							},
						success: function(result){ 
								isValidated = true;						
							}
					});	
				return isValidated;
			
			},
        /**
         * @function formValid
         * 
         * To check if form value is valid
         * 
         */
        
        formValid:function(values) {

            var isValid = true;  // so optimistic

            // image needs to be set:
            isValid = isValid && (values.title != ''); 
            if(values.title !=''){
					if(values.recipient_id=='undefined' || values.recipient_id==''){
						if(!this.isUniqueTitle(values.title)){
							isValid = false;
						}
				  }	
				}	          
            isValid = isValid && (values.recipients != '');
            if(values.recipients != ''){
				if(!this.validateEmails(values.recipients)){
						isValid =false;
					}
				}	
			
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
        
        /**	@save clickevent handler
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
         
        '.en-recipient-list-save click': function($el, ev){
			var self = this;
			var obj = this.formValues();
			var Model = AD.Model.get('opstools.EmailNotifications.ENRecipient');		
			if(this.formValid(obj)){
					Model.create(obj)
					.fail(function(err){
						console.error(err);						
					})
					.then(function(data){						
						self.popup.hide();
						self.formClear();
						self.recipientsLoad();	
							bootbox.dialog({
									  title: "",									  
									  message: '<div class="msg-box">Record added successfully.</div>'
									});				
						})
					
				}else {

                var errors = this.formErrors(obj);

                if (errors.length>0) {

                    bootbox.dialog({
                        message: 'Please fix these errors before trying again:<br>'+errors.join('<br>'),
                        title: '<div class="head-popup">Invalid Form Data</div>',
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
		
		
		/**	@update clickevent handler
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
         
        '.en-recipient-list-update click': function($el, ev){
			var self = this;
			var obj = this.formValues();
		
			if(this.formValid(obj)){
					var Model = AD.Model.get('opstools.EmailNotifications.ENRecipient');					
					Model.findOne({id:obj.recipient_id},function(model){
				
						model.attr('title',obj.title);
						model.attr('recipients',obj.recipients);
						model.save().fail(function(err){
							console.error(err);						
						}).then(function(data){	
							self.popup.hide();
							self.formClear();
							self.recipientsLoad();	
							bootbox.dialog({
									  title: "",									  
									  message: '<div class="msg-box">Record updated successfully.</div>'
							});					
						})
					})							
					
				}else {

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
        
        /**	 @nextDisable
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */ 
         
        nextDisable : function () {
			this.dom.next.attr('disabled', 'disabled');
			this.dom.next.addClass('disabled');
		},
		
		/**	@nextEnable
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
         
		nextEnable : function () {
			this.dom.next.removeAttr('disabled');
			this.dom.next.removeClass('disabled');
		},

		/**	 @recipientsLoad
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
         
		recipientsLoad: function() {	
			var self = this;		
            var Recipient = AD.Model.get("opstools.EmailNotifications.ENRecipient");
			this.FilteredTable.load([]);
			this.FilteredTable.busy();
            Recipient.findAll({})
            .fail(function(err){
                //// TODO: you'll need to do better error handling that this
                console.log(err);
            })
            .then(function(list){ 
				self.FilteredTable.load(list);
				self.FilteredTable.ready();
             })
        },
        
		/**	 trigger next
		 * 
		 * @param 		
		 *self.popup.addClass('in');
			self.popup.show();
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
		   'a.en-wiz-recipients-next click': function ($el, ev) {

            this.element.trigger(this.options.triggerNext);
            ev.preventDefault();
        },
        
        /**	 @modify click event
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
		 
        'a.btn-modify click' : function( $el, ev) { 
			var self = this;
			this.popup = this.element.find('div #myModal');
			var recipient = $el.data('recipient');			
			self.popup.find('#title').val(recipient.title);
			self.popup.find('#recipients').val(recipient.recipients);
			self.popup.find('.en-recipient-list-save').removeClass('en-recipient-list-save').addClass('en-recipient-list-update');
			self.popup.find('#recipient_id').val(recipient.id);			
			//self.popup.modal('show');
			self.popup.addClass('in');
			self.popup.show();
			
		},
		
		/**	 @delete click event
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */

		'a.btn-delete click' : function( $el, ev) { 
			var recipient = $el.data('recipient');
			var self = this;
			console.log(' the recipient model instance to delete:');	
			var recipient = $el.data('recipient');
			
		                    
               bootbox.confirm("Are you sure? You want to delete this recipient.", function(result){
				    if(result){
						var Model = AD.Model.get('opstools.EmailNotifications.ENRecipient');
								Model.destroy(recipient.id)
								.fail(function(err){
									console.error(err);						
								})
								.then(function(recipient){														
									self.recipientsLoad();	
									bootbox.dialog({
									  title: "",
									  
									  message: '<div class="msg-box">Record deleted successfully.</div>'
									});						
							});	
						
						}
				   });  					
		
			},
			
		'.en-recipient-btn-cancel click' : function ($el, ev){
			   var self = this;
			   self.formClear();
				self.popup.hide();				
			},
		
		'.create-new-list click' : function ($el, ev){
			   var self = this;
			   self.formClear();
			   self.popup.find('.en-recipient-list-update').removeClass('en-recipient-list-update').addClass('en-recipient-list-save');			 
		},
		
        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },
        
        '.en-table-recipients .template click':function(){
				this.nextEnable();
			}


    });


});
