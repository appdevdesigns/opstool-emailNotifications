steal(
	function() {
		System.import('appdev').then(function() {
			steal.import('appdev/model/model').then(function() {

				// Namespacing conventions:
				// AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
				AD.Model.Base.extend("opstools.EmailNotifications.ENNotification", {
					findAll: 'GET /opstool-emailNotifications/ennotification',
					findOne: 'GET /opstool-emailNotifications/ennotification/{id}',
					create: 'POST /opstool-emailNotifications/ennotification',
					update: 'PUT /opstool-emailNotifications/ennotification/{id}',
					destroy: 'DELETE /ennotification/{id}',
					describe: function() {
						return {
							"notificationTitle": "string",
							"emailSubject": "text",
							"fromName": "string",
							"fromEmail": "string",
							"startFrom": "date",
							"emailFrequency": "string",
							"recipientListId": "integer",
							"templateDesignId": "integer",
							"repeatUntil": "date"
						};
					},
					associations: ['recipientListId', 'templateDesignId'],
					fieldId: 'id',
					fieldLabel: 'notificationTitle'
				}, {
						model: function() {
							return AD.Model.get('opstools.EmailNotifications.ENNotification'); //AD.models.opstools.EmailNotifications.ENNotification;
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
