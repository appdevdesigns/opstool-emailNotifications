
steal(
        // List your Controller's dependencies here:
        'appdev',
        // '//opstools/EmailNotifications/views/WizardRecipients/WizardRecipients.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.WizardRecipients', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                triggerNext: 'next'
                    // templateDOM: '//opstools/EmailNotifications/views/WizardRecipients/WizardRecipients.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.initDOM();

        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

        },


        'a.en-wiz-recipients-next click': function ($el, ev) {

//// TODO: you'll need to do some logic here to figure out if you should actually
////       go next

            this.element.trigger(this.options.triggerNext);
            ev.preventDefault();
        }


    });


});