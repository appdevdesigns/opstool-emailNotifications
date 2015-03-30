
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/EmailNotifications/models/ENRecipient.js',
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

            this.dom = {};              // track any DOM elements we are interested in
            this.FilteredTable = null;  // the Filtered Bootstrap Table


            this.initDOM();
            this.recipientsLoad();

        },



        initDOM: function () {
            var self = this;

            // this.element.html(can.view(this.options.templateDOM, {} ));

            // attach to the [Next] button.
            this.dom.next = this.element.find('a.en-wiz-recipients-next');
            this.nextDisable();


            // attach the FilteredBootstrapTable Controller
            var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
            this.FilteredTable = new Filter(this.element, {
                tagFilter: '.en-reciepient-search',
                tagBootstrapTable: '.en-table-recipients',
                scrollToSelect:true,
                cssSelected:'en-table-row-active',

                dataToTerm: function(model) {  
                    if (model) {
                        return model.title;
                    } else {
                        return '';
                    }
                },

                rowClicked:function(data) {

                    if (data) {
                        self.nextEnable();
                    }

                },

                rowDblClicked: function(data) {
                    // if they dbl-click a row,
                    // just continue on as if they clicked [next]
                    if (data) {
                        self.nextEnable();
                        self.dom.next.click();
                    }
                },

                termSelected:function(data) {

                    // if they select a term in the typeahead filter,
                    // just continue on as if they clicked [next]
                    if (data) {
                        self.nextEnable();
                        self.dom.next.click();
                    }
                }
            });

        },


        nextDisable : function () {
            this.dom.next.attr('disabled', 'disabled');
            this.dom.next.addClass('disabled');
        },

        nextEnable : function () {
            this.dom.next.removeAttr('disabled');
            this.dom.next.removeClass('disabled');
        },



        recipientsLoad: function() {
            var self = this;

            // clear the list:
            this.FilteredTable.load([]);
            this.FilteredTable.busy();

            var Recipient = AD.Model.get("opstools.EmailNotifications.ENRecipient");
            Recipient.findAll({})
            .fail(function(err){

                //// TODO: you'll need to do better error handling that this
                console.log(err);
            })
            .then(function(list){

                // populate the 
                self.FilteredTable.load(list);
                self.FilteredTable.ready();

            })
        },



        'a.en-wiz-recipients-next click': function ($el, ev) {

//// TODO: you'll need to do some logic here to figure out if you should actually
////       go next

            this.element.trigger(this.options.triggerNext);
            ev.preventDefault();
        }


    });


});