
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/EmailNotifications/controllers/WizardRecipients.js',
        'opstools/EmailNotifications/controllers/WizardNotifications.js',
        // '//opstools/EmailNotifications/views/Wizard/Wizard.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.EmailNotifications.Wizard', {  


        CONST: {
            RECIPIENT_NEXT: 'en-wiz-recipient-next',
            NOTIFICATIONS_NEXT: 'en-wiz-notifications-next'
        },


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/EmailNotifications/views/Wizard/Wizard.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);

            this.controllers = {};       // the controllers we are managing

            this.initDOM();
            this.controllersAttach();

        },



        /*
         * controllersAttach
         * 
         * attach all our sub controllers to the DOM
         *
         * @return {undefined}
         */
        controllersAttach: function() {
            var self = this;

            // Recipients Controller
            var Recipients = AD.Control.get('opstools.EmailNotifications.WizardRecipients');
            this.controllers.Recipients = new Recipients( this.element.find('.en-wizard-recipients'), {
                triggerNext:this.CONST.RECIPIENT_NEXT
            });
            this.controllers.Recipients.on(this.CONST.RECIPIENT_NEXT, function() {
                self.controllersShow('Notifications');
            })


            // Notifications Controller
            var Notifications = AD.Control.get('opstools.EmailNotifications.WizardNotifications');
            this.controllers.Notifications = new Notifications(this.element.find('.en-wizard-formNotification'));

//// TODO: implement the next transition 


            this.controllersShow('Recipients'); // the 1st screen to show 
        },



        controllersShow: function( key ) {

            for (var k in this.controllers) {
                if (k == key) {
                    this.controllers[k].show();

                    // remove the existing 'active' setting on the nav entries
                    this.element.find('li.en-wiz-nav').removeClass('active');

                    // find the entry associated with this panel and set it 'active'
                    this.element.find('li.en-wiz-nav[panel="'+k+'"]').addClass('active');

                } else {
                    this.controllers[k].hide();
                }
            }
        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

        },



        /*
         * When we are told to show make sure our 1st panel is showing.
         */
        show: function() {
            this._super();  // do our normal show();
            this.controllersShow('Recipients');
        },


        "li.en-wiz-nav click" : function($el, ev) {
            var panel = $el.attr('panel');
            this.controllersShow(panel);

        }


    });


});