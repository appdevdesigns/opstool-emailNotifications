
steal(
        // List your Controller's dependencies here:
        'appdev',
        // '//opstools/EmailNotifications/views/Portal/Portal.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.Portal', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                triggerCreateNotification: 'create-notification'
                    // templateDOM: '//opstools/EmailNotifications/views/Portal/Portal.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.initDOM();
        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

        },



        /*
         * Detect the [Create Notifications] button click
         */
        'a.en-portal-newNotification click': function ($el, ev) {

            this.element.trigger(this.options.triggerCreateNotification);
            ev.preventDefault();
        }


    });


});