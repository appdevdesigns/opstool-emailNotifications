
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'opstools/EmailNotifications/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
 //       '//opstools/EmailNotifications/views/WizardTemplate/WizardTemplate.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardTemplates', {  


        init: function (element, options) {			
            var self = this;
            options = AD.defaults({
				triggerNext: 'next'
                // templateDOM: '//opstools/EmailNotifications/views/WizardTemplate/WizardTemplate.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


        },

		 'a.en-wiz-select-template-next click': function ($el, ev) {
		
            this.element.trigger(this.options.triggerNext);
            ev.preventDefault();
        },


        initDOM: function () {

            //this.element.html(can.view(this.options.templateDOM, {} ));

        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});
