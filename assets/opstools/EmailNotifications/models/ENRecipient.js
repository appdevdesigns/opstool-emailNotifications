steal(
        'appdev',
        'opstools/EmailNotifications/models/base/ENRecipient.js'
).then( function(){

    // Namespacing conventions:
    // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
    AD.Model.extend('opstools.EmailNotifications.ENRecipient', {
		findAll: 'GET /opstool-emailNotifications/enrecipient',
				findOne: 'GET /opstool-emailNotifications/enrecipient/{id}',
				create:  'POST /opstool-emailNotifications/enrecipient',
				update:  'PUT /opstool-emailNotifications/enrecipient/{id}',
				destroy: 'DELETE /opstool-emailNotifications/enrecipient/{id}',
				describe: function() {
					return {
							"title":"string",
							"recipients":"text"
						};
				},
				fieldId:'id',
				fieldLabel:'title'
    },{
/*
        // Already Defined:
        model: function() {},   // returns the Model Class for an instance
        getID: function() {},   // returns the unique ID of this row
        getLabel: function() {} // returns the defined label value
*/
    });


});
