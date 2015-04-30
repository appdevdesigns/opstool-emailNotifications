// Dependencies
steal(
    "opstools/EmailNotifications/controllers/WizardRecipients.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_WizardRecipients';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.EmailNotifications.WizardRecipients ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.EmailNotifications.WizardRecipients($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications.WizardRecipients, ' :=> should have been defined ');
              assert.isNotNull(AD.Control.get('WizardRecipients'), ' :=> returns our controller. ');
        });


    });


});