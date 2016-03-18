steal(
	function() {
		System.import('appdev').then(function() {
			steal.import('appdev/model/model').then(function() {

				// Namespacing conventions:
				// AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
				AD.Model.Base.extend("opstools.EmailNotifications.ENRecipient", {
					findAll: 'GET /opstool-emailNotifications/enrecipient',
					findOne: 'GET /opstool-emailNotifications/enrecipient/{id}',
					create: 'POST /opstool-emailNotifications/enrecipient',
					update: 'PUT /opstool-emailNotifications/enrecipient/{id}',
					destroy: 'DELETE /opstool-emailNotifications/enrecipient/{id}',
					describe: function() {
						return {};
					},
					fieldId: 'id',
					fieldLabel: 'null'
				}, {
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
		});

	});
