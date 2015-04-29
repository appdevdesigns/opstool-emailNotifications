// Dependencies
steal(
    "opstools/EmailNotifications/controllers/WizardTemplate.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_WizardTemplate';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.EmailNotifications.WizardTemplate ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.EmailNotifications.WizardTemplate($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications.WizardTemplate, ' :=> should have been defined ');
              assert.isNotNull(AD.Control.get('WizardTemplate'), ' :=> returns our controller. ');
        });


    });


});