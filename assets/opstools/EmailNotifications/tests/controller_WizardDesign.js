// Dependencies
steal(
    "opstools/EmailNotifications/controllers/WizardDesign.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_WizardDesign';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.EmailNotifications.WizardDesign ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.EmailNotifications.WizardDesign($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.EmailNotifications.WizardDesign, ' :=> should have been defined ');
              assert.isNotNull(AD.Control.get('WizardDesign'), ' :=> returns our controller. ');
        });


    });


});