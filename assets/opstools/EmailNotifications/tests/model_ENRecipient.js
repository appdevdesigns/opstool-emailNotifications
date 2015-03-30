// Dependencies
steal(
    "opstools/EmailNotifications/models/ENRecipient.js"
)

// Initialization
.then(function(){


    //Define the unit tests
    describe('testing model AD.models.opstools.EmailNotifications.ENRecipient ', function(){


        before(function(){


        });


        it('model definition exists ', function(){
            assert.isDefined(AD.models.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications.ENRecipient, ' :=> should have been defined ');
               assert.isNotNull(AD.Model.get("opstools.EmailNotifications.ENRecipient"), ' :=> did not return null');
        });

    });


});