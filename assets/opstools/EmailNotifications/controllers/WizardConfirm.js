
steal(
        // List your Controller's dependencies here:
        'appdev',
		// 'opstools/EmailNotifications/models/Projects.js',
		//'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
		//'//opstools/EmailNotifications/views/WizardConfirm/WizardConfirm.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardConfirm', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
			triggerNext: 'next'	
                  //  templateDOM: '//opstools/EmailNotifications/views/WizardConfirm/WizardConfirm.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


        },

		


        initDOM: function () {
			
			
			
           // this.element.html(can.view(this.options.templateDOM, {} ));

        },
        

		'a.en-wiz-confirm click': function ($el, ev) {			
			 
			 
            this.element.trigger(this.options.triggerNext);
           // ev.preventDefault();
        },	

        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});
