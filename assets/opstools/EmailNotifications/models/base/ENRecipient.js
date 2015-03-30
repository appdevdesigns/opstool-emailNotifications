steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.EmailNotifications.ENRecipient", {
        findAll: 'GET /opstool-emailNotifications/enrecipient',
        findOne: 'GET /opstool-emailNotifications/enrecipient/{id}',
        create:  'POST /opstool-emailNotifications/enrecipient/create',
        update:  'PUT /opstool-emailNotifications/enrecipient/update/{id}',
        destroy: 'DELETE /enrecipient/destroy/{id}',
        describe: function() {
            return {
                      "title": "string",
                      "recipients": "text"
            };
        },
        fieldId:'id',
        fieldLabel:'title'
    },{
        model: function() {
            return AD.Model.get('opstools.EmailNotifications.ENRecipient'); //AD.models.opstools.EmailNotifications.ENRecipient;
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        }
    });


});