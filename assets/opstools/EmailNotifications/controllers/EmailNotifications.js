
steal(
        // List your Controller's dependencies here:
        'appdev',
//        '/opstools/EmailNotifications/models/[modelName].js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        '/opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
function(){

    AD.Control.OpsTool.extend('EmailNotifications', {


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


            // this.dataSource = this.options.dataSource; 

            this.initDOM();
        },



        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },


    });


});