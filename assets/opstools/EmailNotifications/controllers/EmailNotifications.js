steal(
    // List your Controller's dependencies here:
    'appdev',
    //        '/opstools/EmailNotifications/models/[modelName].js',
    //        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //        '/opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
    'opstools/EmailNotifications/controllers/Portal.js',
    'opstools/EmailNotifications/controllers/Wizard.js',
    '//opstools/EmailNotifications/models/ENNotification.js',
    '//opstools/EmailNotifications/models/ENRecipient.js',
    '//opstools/EmailNotifications/models/ENTemplateDesign.js', 
    function() {


        AD.Control.OpsTool.extend( 'EmailNotifications', {

            CONST: {
                CREATE_NOTIFICATION: 'en-create-notification',
                MODIFY_NOTIFICATION: 'en-modify-notification',
                COMPLETE_NOTIFICATION: 'en-complete-notification'
            },



            init: function(element, options) {
                var self = this;
                options = AD.defaults( {
                    templateDOM: '//opstools/EmailNotifications/views/EmailNotifications/EmailNotifications.ejs',
                    resize_notification: 'EmailNotifications.resize',
                    tool: null // the parent opsPortal Tool() object
                }, options );
                this.options = options;
                // Call parent init
                this._super( element, options );
                this.controllers = {};
                this.currentController = null;
                this.wizardData = {};
                this.wizardData.notification = {};
                this.wizardData.recipient = {};
                this.wizardData.templateDesign = {};
                this.wizardData.isEditing = false;

                this.wizardData.initWizardData = function() {
                    this.isEditing = false;
                    this.notification = {};
                    this.recipient = {};
                    this.templateDesign = {};
                };

                this.initDOM();
                this.controllersAttach();
            },



            //Controller approach
            controllersAttach: function() {
                var self = this;
                var Portal = AD.Control.get( 'opstools.EmailNotifications.Portal' );
                this.controllers.Portal = new Portal( this.element.find( '.en-portal' ), {
                    triggerCreateNotification: this.CONST.CREATE_NOTIFICATION,
                    triggerModifyNotification: this.CONST.MODIFY_NOTIFICATION,
                    wizardData: self.wizardData
                } );
                this.controllers.Portal.on( 'en-notification-complete', function() {
                    self.controllersShow( 'Portal' );
                } );
                this.controllers.Portal.on( this.CONST.CREATE_NOTIFICATION, function() {
                    self.controllersShow( 'Wizard' );
                } );
                this.controllers.Portal.on( this.CONST.MODIFY_NOTIFICATION, function() {

                    // Load all data
                    var ModelNotification = AD.Model.get( 'opstools.EmailNotifications.ENNotification' ); //load notification model
                    var ModelRecipient = AD.Model.get( 'opstools.EmailNotifications.ENRecipient' ); // load recipient model
                    var ModelTemplateDesign = AD.Model.get( 'opstools.EmailNotifications.ENTemplateDesign' ); // load templateDesign

                    /**
                     * Get all the notification data and load for modification
                     * 
                     * */

                    ModelNotification.findOne( {
                        id: self.wizardData.notification.id
                    }, function(notification) {
                            self.wizardData.notification = notification._data;
                            ModelRecipient.findOne( {
                                id: self.wizardData.notification.recipientId
                            }, function(recipient) {
                                    self.wizardData.recipient = recipient._data;

                                    // add the data to various views
                                    var CtrlRecipient = self.controllers.Wizard.controllers.Recipients;
                                    var CtrlNotification = self.controllers.Wizard.controllers.Notifications;
                                    var CtrlTemplate = self.controllers.Wizard.controllers.Templates;
                                    var CtrlDesign = self.controllers.Wizard.controllers.Design;
                                    var CtrlConfirm = self.controllers.Wizard.controllers.Confirm;

                                    // Select a recipient in filterdbootstrap table
                                    CtrlRecipient.FilteredTable.select( self.wizardData.recipient );
                                    $el = CtrlRecipient.FilteredTable.table.find( '[obj-id=' + self.wizardData.recipient.id + ']' ).parent().parent();
                                    CtrlRecipient.FilteredTable.selected( $el );

                                    // Fill notification setup page
                                    CtrlNotification.form.find( '#notificationTitle' ).val( self.wizardData.notification.notificationTitle );
                                    CtrlNotification.form.find( '#emailSubject' ).val( self.wizardData.notification.emailSubject );
                                    CtrlNotification.form.find( '#fromName' ).val( self.wizardData.notification.fromName );
                                    CtrlNotification.form.find( '#fromEmail' ).val( self.wizardData.notification.fromEmail );

                                    // if wizard setup type basic/system

                                    if (self.wizardData.notification.setupType == 'Basic') {

                                        CtrlNotification.form.find( '#dateStartFrom' ).val( new Date( self.wizardData.notification.startFrom ).toLocaleDateString() );
                                        CtrlNotification.form.find( '#emailFrequency' ).val( self.wizardData.notification.emailFrequency );

                                        if (self.wizardData.notification.repeatUntil != '0000-00-00') {

                                            CtrlNotification.form.find( '#dateRepeatUntil' ).val( new Date( self.wizardData.notification.repeatUntil ).toLocaleDateString() );

                                        } else {

                                            CtrlNotification.form.find( '#neverEnd' ).attr( 'checked', true );

                                        }

                                        CtrlNotification.updateNotificationBar(); // Update notification setup bar

                                    } else {

                                        // if setupType "System" then make it active

                                        CtrlNotification.element.find( '.tabbable ul li:nth-child(2)' ).addClass( 'active' );
                                        CtrlNotification.element.find( '.tabbable ul li:nth-child(1)' ).removeClass( 'active' );
                                        CtrlNotification.element.find( '#basic' ).removeClass( 'active' );
                                        CtrlNotification.element.find( '#system' ).addClass( 'active' );

                                    }
                                    // check if there was any template
                                    if (self.wizardData.notification.templateDesignId) {

                                        ModelTemplateDesign.findOne( {
                                            id: self.wizardData.notification.templateDesignId.id
                                        }, function(templateDesign) {
                                                self.wizardData.templateDesign = templateDesign;
                                                CtrlDesign.form.find( '#templateTitle' ).val( self.wizardData.templateDesign.templateTitle );
                                                CtrlDesign.form.find( '#templateBody' ).val( self.wizardData.templateDesign.templateBody );
                                                //////////////////////////////
                                                // show controller
                                                self.controllersShow( 'Wizard' );
                                            } );
                                    } else {
                                        self.controllersShow( 'Wizard' );
                                    }
                                } );
                        } );
                } );
                var Wizard = AD.Control.get( 'opstools.EmailNotifications.Wizard' );
                this.controllers.Wizard = new Wizard( this.element.find( '.en-wizard' ), {
                    wizardData: self.wizardData,
                    triggerCompleteNotification: this.CONST.COMPLETE_NOTIFICATION
                } );
                this.controllers.Wizard.on( this.CONST.COMPLETE_NOTIFICATION, function() {
                    self.controllers.Portal.notificationsLoad();
                    self.controllersShow( 'Portal' );
                } );
                this.controllersShow( 'Portal' );
            },



            /** @controllersShow
             *
             * @param key
             * @param data
             *
             * @return 
             *
             * @author Edwin
             * @since 30 April 2015
             */
            controllersShow: function(key, data) {
                for (var k in this.controllers) {
                    if (k == key) {
                        this.controllers[k].show( data );
                    } else {
                        this.controllers[k].hide();
                    }
                }
            },



            /**  @intDom
             *
             * @param null.
             *
             * @return 
             *
             * @author Edwin
             * @since 30 April 2015
             */
            initDOM: function() {
                this.element.html( can.view( this.options.templateDOM, {} ) );
            },



            '.ad-item-add click': function($el, ev) {
                ev.preventDefault();
            },



            /**  @function formatDate
             *
             * @param somedate.
             *
             * @return string
             *
             * @author Edwin
             * @since 30 April 2015
             */
            formatDate: function(someDate) {
                var someDate = new Date( someDate );
                var dd = someDate.getDate();
                var mm = someDate.getMonth() + 1;
                var y = someDate.getFullYear();
                var formattedDate = mm + '/' + dd + '/' + y;
                return formattedDate;
            },
        } );
    } );
