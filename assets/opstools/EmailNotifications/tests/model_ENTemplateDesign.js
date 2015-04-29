// Dependencies
steal(
    "opstools/EmailNotifications/models/ENTemplateDesign.js"
)

// Initialization
.then(function(){


    //Define the unit tests
    describe('testing model AD.models.opstools.EmailNotifications.ENTemplateDesign ', function(){


        before(function(){


        });


        it('model definition exists ', function(){
            assert.isDefined(AD.models.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications , ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.EmailNotifications.ENTemplateDesign, ' :=> should have been defined ');
               assert.isNotNull(AD.Model.get("opstools.EmailNotifications.ENTemplateDesign"), ' :=> did not return null');
        });

    });


});