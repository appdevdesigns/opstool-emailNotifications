
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/EmailNotifications/controllers/Portal.js',
        'opstools/EmailNotifications/controllers/Wizard.js',
function(){

    AD.Control.OpsTool.extend('EmailNotifications', {

        CONST: {
            CREATE_NOTIFICATION: 'en-create-notification'
        },

        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
                    resize_notification: 'EmailNotifications.resize',
                    tool:null   // the parent opsPortal Tool() object
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

            // Portal Controller
            var Portal = AD.Control.get('opstools.EmailNotifications.Portal');
            this.controllers.Portal = new Portal( this.element.find('.en-portal'), {
                triggerCreateNotification:this.CONST.CREATE_NOTIFICATION
            });
            this.controllers.Portal.on(this.CONST.CREATE_NOTIFICATION, function() {
                self.controllersShow('Wizard');
            })


            // Wizard Controller
            var Wizard = AD.Control.get('opstools.EmailNotifications.Wizard');
            this.controllers.Wizard = new Wizard(this.element.find('.en-wizard'));


            this.controllersShow('Portal');
        },



        controllersShow: function( key ) {

            for (var k in this.controllers) {
                if (k == key) {
                    this.controllers[k].show();
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
        }


    });


});