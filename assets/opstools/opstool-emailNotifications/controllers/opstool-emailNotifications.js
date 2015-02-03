
steal(
        // List your Controller's dependencies here:
        'appdev',
//        '/opstools/opstool-emailNotifications/models/[modelName].js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        '/opstools/opstool-emailNotifications/views/opstool-emailNotifications/opstool-emailNotifications.ejs',
function(){

    AD.Control.OpsTool.extend('opstool-emailNotifications', {


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/opstool-emailNotifications/views/opstool-emailNotifications/opstool-emailNotifications.ejs',
                    resize_notification: 'opstool-emailNotifications.resize',
                    tool:null   // the parent opsPortal Tool() object
            }, options);
            this.options = options;

            // Call parent init
            //AD.classes.opsportal.OpsTool.prototype.init.apply(this, arguments);
            this._super(element, options);


            this.dataSource = this.options.dataSource; 

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