steal(
        'appdev',
        'opstools/EmailNotifications/models/base/ENTemplateDesign.js'
).then( function(){

    // Namespacing conventions:
    // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
    AD.Model.extend('opstools.EmailNotifications.ENTemplateDesign', {

       /* findAll: 'GET /opstool-emailNotifications/entemplatedesign',*/
        findAll: { url: '/opstool-emailNotifications/entemplatedesign', method: 'GET', dataType: 'json', cache: false} ,
        //findOne: 'GET /opstool-emailNotifications/entemplatedesign/{id}',
        findOne: { url: '/opstool-emailNotifications/entemplatedesign/{id}', method: 'GET', dataType: 'json', cache: false },        
        create:  'POST /opstool-emailNotifications/entemplatedesign',
        update:  'PUT /opstool-emailNotifications/entemplatedesign/{id}',
        destroy: 'DELETE /opstool-emailNotifications/entemplatedesign/{id}',
        describe: function() {},   // returns an object describing the Model definition
        fieldId: 'id',             // which field is the ID
        fieldLabel:'templateTitle'      // which field is considered the Label

    },{
/*
        // Already Defined:
        model: function() {},   // returns the Model Class for an instance
        getID: function() {},   // returns the unique ID of this row
        getLabel: function() {} // returns the defined label value
*/
    });


});
