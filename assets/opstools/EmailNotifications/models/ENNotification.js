steal(
        'appdev',
        'opstools/EmailNotifications/models/base/ENNotification.js'
).then( function(){

    // Namespacing conventions:
    // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
    AD.Model.extend('opstools.EmailNotifications.ENNotification', {

        findAll: 'GET /opstool-emailNotifications/ennotification',
        findOne: 'GET /opstool-emailNotifications/ennotification/{id}',
        create:  'POST /opstool-emailNotifications/ennotification',
        update:  'PUT /opstool-emailNotifications/ennotification/{id}',
        destroy: 'DELETE /opstool-emailNotifications/ennotification/{id}',
        describe: function() {},   // returns an object describing the Model definition
        fieldId: 'id',             // which field is the ID
        fieldLabel:'notificationTitle'      // which field is considered the Label

    },{
/*
        // Already Defined:
        model: function() {},   // returns the Model Class for an instance
        getID: function() {},   // returns the unique ID of this row
        getLabel: function() {} // returns the defined label value
*/
    });


});
