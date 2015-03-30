steal(
        'appdev',
        'opstools/EmailNotifications/models/base/ENRecipient.js'
).then( function(){

    // Namespacing conventions:
    // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
    AD.Model.extend('opstools.EmailNotifications.ENRecipient', {
/*
        findAll: 'GET /opstool-emailNotifications/enrecipient',
        findOne: 'GET /opstool-emailNotifications/enrecipient/{id}',
        create:  'POST /opstool-emailNotifications/enrecipient',
        update:  'PUT /opstool-emailNotifications/enrecipient/{id}',
        destroy: 'DELETE /opstool-emailNotifications/enrecipient/{id}',
        describe: function() {},    // returns an object describing the Model definition
        fieldId: 'fieldName',       // which field is the ID
        fieldLabel:'fieldName'      // which field is considered the Label
*/
    },{
/*
        // Already Defined:
        model: function() {},   // returns the Model Class for an instance
        getID: function() {},   // returns the unique ID of this row
        getLabel: function() {} // returns the defined label value
*/
    });

});