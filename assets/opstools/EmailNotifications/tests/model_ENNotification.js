// Dependencies
steal(
    "opstools/EmailNotifications/models/ENNotification.js"
)

// Initialization
.then(function(){


    //Define the unit tests
    describe('testing model AD.models.opstools.EmailNotifications.ENNotification ', function(){


        before(function(){


        });


        it('model definition exists ', function(){
            assert.isDefined(AD.models.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications.ENNotification, ' :=> should have been defined ');
               assert.isNotNull(AD.Model.get("opstools.EmailNotifications.ENNotification"), ' :=> did not return null');
        });

    });


});