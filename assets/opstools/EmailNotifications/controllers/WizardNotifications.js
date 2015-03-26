
steal(
        // List your Controller's dependencies here:
        'appdev',
        // '//opstools/EmailNotifications/views/WizardNotifications/WizardNotifications.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardNotifications', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/EmailNotifications/views/WizardNotifications/WizardNotifications.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.initDOM();

        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

        }


    });


});