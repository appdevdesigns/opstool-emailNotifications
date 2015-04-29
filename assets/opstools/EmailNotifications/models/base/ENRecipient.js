steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.EmailNotifications.ENRecipient", {
        findAll: 'GET /enrecipient',
        findOne: 'GET /enrecipient/{id}',
        create:  'POST /enrecipient',
        update:  'PUT /enrecipient/{id}',
        destroy: 'DELETE /enrecipient/{id}',
        describe: function() {
            return {};
        },
        fieldId:'id',
        fieldLabel:'null'
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
