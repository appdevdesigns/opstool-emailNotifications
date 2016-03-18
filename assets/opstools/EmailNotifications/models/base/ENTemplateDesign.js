steal(
	function() {
		System.import('appdev').then(function() {
			steal.import('appdev/model/model').then(function() {

				// Namespacing conventions:
				// AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
				AD.Model.Base.extend("opstools.EmailNotifications.ENTemplateDesign", {
					findAll: 'GET /opstool-emailNotifications/entemplatedesign',
					findOne: 'GET /opstool-emailNotifications/entemplatedesign/{id}',
					create: 'POST /opstool-emailNotifications/entemplatedesign',
					update: 'PUT /opstool-emailNotifications/entemplatedesign/{id}',
					destroy: 'DELETE /opstool-emailNotifications/entemplatedesign/{id}',
					describe: function() {
						return {
							"templateTitle": "string",
							"templateBody": "String",
							"text": "String",
							"templateType": "String",
							"string": "String"
						};
					},
					fieldId: 'id',
					fieldLabel: 'templateTitle'
				}, {
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
		});
	});