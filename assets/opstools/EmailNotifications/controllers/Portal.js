
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/EmailNotifications/models/ENNotification.js',
//        'opstools/EmailNotifications/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
   //     '//opstools/EmailNotifications/views/Portal/Portal.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.Portal', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
				triggerCreateNotification: 'create-notification'
				//templateDOM: '//opstools/EmailNotifications/views/Portal/Portal.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();
			this .notificationsLoad();

        },



        initDOM: function () {

       //     this.element.html(can.view(this.options.templateDOM, {} ));

        var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
           this.FilteredTable = new Filter( this.element,{
				tagFilter:'.en-notifications-search',
				tagBootstrapTable:'.en-table-notifications',
				scrollToSelect:true,
				filterTable:true,
				cssSelected:'en-table-row-active template',
				 dataToTerm: function(model) {  
						if (model) {
							return model.notificationTitle;
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
                
        
        },

		/*
			* Detect the [Create Notifications] button click
		*/
			'a.en-portal-newNotification click': function ($el, ev) {
				
				this.element.trigger(this.options.triggerCreateNotification);
				ev.preventDefault();
			},



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },
        
        /**	 @notificationsLoad
		 * 
		 * @param void.		
		 *
		 * @return void
		 *
		 * @author Edwin
		 * @since 30 March 2015
		 */
         
		notificationsLoad: function() {	
			var self = this;		
            var Notification = AD.Model.get("opstools.EmailNotifications.ENNotification");
			this.FilteredTable.load([]);
			this.FilteredTable.busy();
            Notification.findAll({})
            .fail(function(err){
                //// TODO: you'll need to do better error handling that this
                console.log(err);
            })
            .then(function(list){ 
				self.FilteredTable.load(list);
				self.FilteredTable.ready();
             })
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
			var notification = $el.data('notification');
			var self = this;
			console.log(' the notification model instance to delete:');	
			var notification = $el.data('notification');
			
		                    
               bootbox.confirm("Are you sure? You want to delete this notification.", function(result){
				    if(result){
						var Model = AD.Model.get('opstools.EmailNotifications.ENNotification');
								Model.destroy(notification.id)
								.fail(function(err){
									console.error(err);						
								})
								.then(function(notification){														
									self.notificationsLoad();	
									bootbox.dialog({
									  title: "",									  
									  message: '<div class="msg-box">Record deleted successfully.</div>'
									});						
							});	
						
						}
				   });  					
		
			},
		

    });


});
