
steal(
        // List your Controller's dependencies here:
        'appdev',
//        '/opstools/EmailNotifications/models/[modelName].js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        '/opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
		'opstools/EmailNotifications/controllers/Portal.js',
        'opstools/EmailNotifications/controllers/Wizard.js',
function(){

    AD.Control.OpsTool.extend('EmailNotifications', {	
	 CONST: {
        CREATE_NOTIFICATION: 'en-create-notification',
        MODIFY_NOTIFICATION: 'en-create-notification',        
    },

        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
                    resize_notification: 'EmailNotifications.resize',
                    tool:null   // the parent opsPortal Tool() object
            }, options);
            this.options = options;
			this.notificationEditData = {};
			
            // Call parent init
            this._super(element, options);
			this.controllers = {};
			this.wizardData = {};
			this.dataSource = this.options.dataSource; 

            this.initDOM();
            this.controllersAttach();
        },
        
		//Controller approach
		controllersAttach:function(){
			var self = this;
			var Portal = AD.Control.get('opstools.EmailNotifications.Portal');
			  this.controllers.Portal = new Portal( this.element.find('.en-portal'), {
				triggerCreateNotification:this.CONST.CREATE_NOTIFICATION,
				triggerModifyNotification:this.CONST.MODIFY_NOTIFICATION,
				notificationEditData : this.notificationEditData
			});
				this.controllers.Portal.on(this.CONST.CREATE_NOTIFICATION, function() {
				self.controllersShow('Wizard');
			});
			
				this.controllers.Portal.on(this.CONST.MODIFY_NOTIFICATION, function() {
					
				var notificationId = self.notificationEditData.id;
				 if(notificationId){
						var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');
						Notification.findOne({id:notificationId}).then(function(data){
							console.log(data);
							//self.wizardData.recipients = data.recipientId;
							self.notificationEditData.notificationData = data;	
							$.cookie('editRecipient',data.recipientId);	
										
							self.element.find('.en-table-recipients #'+data.recipientId).addClass('active');//recipient
														
							self.element.find('#notificationTitle').val(data.notificationTitle);
							self.element.find('#emailSubject').val(data.emailSubject);
							self.element.find('#fromName').val(data.fromName);
							self.element.find('#fromEmail').val(data.fromEmail);
							self.element.find('#notificationTitle').val(data.notificationTitle);							
																	
							self.element.find('#emailFrequency').val(data.emailFrequency);
							if(data.templateDesignId!=undefined){								
							self.element.find('#templateTitle').val(data.templateDesignId.templateTitle);
							self.element.find('#templateBody').val(data.templateDesignId.templateBody);
							}
							
							if(data.eventTrigger==''){
								var startFrom = self.formatDate(data.startFrom);
								var repeatUntil = self.formatDate(data.repeatUntil);							
								self.element.find('#dateStartFrom').val(startFrom);
								if(repeatUntil!=''){
									self.element.find('#dateRepeatUntil').val(repeatUntil);
								}else{
									 self.element.find('#neverEnd').prop('checked',true);	
									}						
								var notification = '<a href="#">'+ data.emailFrequency +'</a> from <span>'+ startFrom +'</span> to <span>'+ repeatUntil+'</span>';
								$('#basic-settings').html(notification);
								 } else{
								  self.element.find('.tabbable ul li:nth-child(2)').addClass('active');
								  self.element.find('.tabbable ul li:nth-child(1)').removeClass('active');
								  self.element.find('#basic').removeClass('active');
								  self.element.find('#system').addClass('active');
								  var notification = data.eventTrigger;
								 }																					
							});
												
					 }	
					 
				self.controllersShow('Wizard');
			});
				
			//this.controllers.Portal.show();
			
			var Wizard = AD.Control.get('opstools.EmailNotifications.Wizard');
			this.controllers.Wizard = new Wizard(this.element.find('.en-wizard'),{
				notificationEditData : this.notificationEditData
				});
			//this.controllers.Wizard.hide();
			
			this.controllersShow('Portal');
			
			},
		
		/**@ controllersShow
		 * 
		 * @param key.		
		 * @param data.		
		 *
		 * @return date
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */

		controllersShow: function( key, data ) {

				for (var k in this.controllers) {
					if (k == key) {
						this.controllers[k].show(data);
					} else {
						this.controllers[k].hide();
					}
				}
			},


        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },


		

        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },
        
        /**@ formatDate
		 * 
		 * @param date.		
		 *
		 * @return date
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
        formatDate : function (someDate){
			var someDate =  new Date(someDate);
			var dd = someDate.getDate();
			var mm = someDate.getMonth() + 1;
			var y = someDate.getFullYear();
			var formattedDate = mm + '/'+ dd + '/'+ y;
			return formattedDate;
			
			},
		
			


    });


});
