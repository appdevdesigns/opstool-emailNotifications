steal(
    // List your Controller's dependencies here:
	'opstools/EmailNotifications/models/ENNotification.js',
    //        'opstools/EmailNotifications/models/Projects.js',
    //        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //     '//opstools/EmailNotifications/views/Portal/Portal.ejs',
    function() {
        System.import('appdev').then(function() {
			steal.import('appdev/ad',
				'appdev/control/control').then(function() {

					// Namespacing conventions:
					// AD.Control.extend('[application].[controller]', [{ static },] {instance} );
					AD.Control.extend('opstools.EmailNotifications.Portal', {


						init: function(element, options) {
							var self = this;
							options = AD.defaults({
								triggerCreateNotification: 'create-notification',
								triggerModifyNotification: 'modify-notification'
								//templateDOM: '//opstools/EmailNotifications/views/Portal/Portal.ejs'
							}, options);
							this.options = options;
							//this.options.notificationEditData = {};
							// Call parent init
							this._super(element, options);
							this.dataSource = this.options.dataSource; // AD.models.Projects;
							this.initDOM();
							this.notificationsLoad();
						},



						initDOM: function() {
							//this.element.html(can.view(this.options.templateDOM, {} ));
							var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
							this.FilteredTable = new Filter(this.element, {
								tagFilter: '.en-notifications-search',
								tagBootstrapTable: '.en-table-notifications',
								scrollToSelect: true,
								filterTable: true,
								cssSelected: 'en-table-row-active template',
								tableOptions: {
									columns: [{
										title: 'Notification Title',
										field: 'notificationTitle'
									}, {
											title: 'Status',
											field: 'status'
										}, {
											title: 'Last Updated',
											field: 'updatedAt',
											formatter: function(val) {
												return new Date(val).toDateString();
											}
										}, {
											title: 'Options',
											formatter: '.tmpl-options'
										}]
								},
								dataToTerm: function(model) {
									if (model) {
										return model.notificationTitle;
									} else {
										return '';
									}
								},
							});

						},



						/*
						 * Detect the [Create Notifications] button click
						 */
						'a.en-portal-newNotification click': function($el, ev) {
							this.element.trigger(this.options.triggerCreateNotification);
							this.initWizardData();
							ev.preventDefault();
						},



						'.ad-item-add click': function($el, ev) {
							ev.preventDefault();
						},



						/**@notificationsLoad
						 *
						 * @param void.
						 *
						 * @return void
						 *
						 * @author Edwin
						 * @since 30 March 2015
						 */
						notificationsLoad: function() {
							var self = this;
							var Notification = AD.Model.get("opstools.EmailNotifications.ENNotification");
							this.FilteredTable.load([]);
							this.FilteredTable.busy();
							Notification.findAll({})
								.fail(function(err) {
									console.log(err);
								})
								.then(function(list) {
									self.FilteredTable.load(list);
									self.FilteredTable.ready();
								})
						},



						/**
						 * Reinitializes all global wizardData so it won't interfare with consecutive request
						 */
						initWizardData: function() {

							// Reinitialize all data
							this.options.wizardData.notification.id = undefined;
							this.options.wizardData.recipient.id = undefined;
							this.options.wizardData.templateDesign.id = undefined;
							this.options.wizardData.isEditing = false;
						},



						/**	 @delete click event
						 *
						 * @param void.
						 *
						 * @return void
						 *
						 * @author Edwin
						 * @since 30 March 2015
						 */
						'a.btn-delete click': function($el, ev) {
							var self = this;
							var id = $el.attr('obj-id');
							bootbox.confirm("Are you sure? You want to delete this notification.", function(result) {
								if (result) {
									var Model = AD.Model.get('opstools.EmailNotifications.ENNotification');
									Model.destroy(id).fail(function(err) {
										console.error(err);
									}).then(function(notification) {
										self.notificationsLoad();
										bootbox.dialog({
											title: "",
											message: '<div class="msg-box">Record deleted successfully.</div>'
										});
									});
								}
							});
						},



						/**	 @modify click event
						 *
						 * @param void.
						 *
						 * @return void
						 *
						 * @author Edwin
						 * @since 30 March 2015
						 */
						'a.btn-modify click': function($el, ev) {

							// var self = this;
							var id = $el.attr('obj-id');
							this.initWizardData();
							this.options.wizardData.isEditing = true;
							this.options.wizardData.notification.id = id;

							this.element.trigger(this.options.triggerModifyNotification);
							ev.preventDefault();
						}
					});
				});
		});
	});