steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.EmailNotifications.ENTemplateDesign", {
        findAll: 'GET /entemplatedesign',
        findOne: 'GET /entemplatedesign/{id}',
        create:  'POST /entemplatedesign',
        update:  'PUT /entemplatedesign/{id}',
        destroy: 'DELETE /entemplatedesign/{id}',
        describe: function() {
            return {
          "templateTitle": "string",
          "templateBody": "String",
          "text": "String",
          "templateType": "String",
          "string": "String"
};
        },
        fieldId:'id',
        fieldLabel:'templateTitle'
    },{
        model: function() {
            return AD.Model.get('opstools.EmailNotifications.ENTemplateDesign'); //AD.models.opstools.EmailNotifications.ENTemplateDesign;
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        }
    });


});