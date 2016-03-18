steal(
    // List your Controller's dependencies here:
	'opstools/EmailNotifications/models/ENRecipient.js',
	'opstools/EmailNotifications/models/ENNotification.js',
	'opstools/EmailNotifications/models/ENTemplateDesign.js',
    //'opstools/EmailNotifications/models/Projects.js',
    //'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    //'//opstools/EmailNotifications/views/WizardConfirm/WizardConfirm.ejs',
    function() {
		System.import('appdev').then(function() {
			steal.import('appdev/ad',
				'appdev/model/model',
				'appdev/control/control').then(function() {

					// Namespacing conventions:
					// AD.Control.extend('[application].[controller]', [{ static },] {instance} );
					AD.Control.extend('opstools.EmailNotifications.WizardConfirm', {
						init: function(element, options) {
							var self = this;
							options = AD.defaults({
								triggerNext: 'next'
							}, options);
							this.options = options;
							// Call parent init
							this._super(element, options);
							this.dataSource = this.options.dataSource; // AD.models.Projects;
							this.initDOM();
						},
						initDOM: function() {
							var template = this.domToTemplate(this.element)
							can.view.ejs('EmailNotification_Wizard_Confirm', template);
						},
						show: function(data) {
							this._super();
							this.element.html(can.view("EmailNotification_Wizard_Confirm", data));
						},
						/**	@ confirm click
						 *
						 * @param $el.
						 * @param ev.
						 *
						 * @return void
						 *
						 * @author Edwin
						 * @since 30 March 2015
						 */
						'a.en-wiz-confirm click': function($el, ev) {
							var self = this;
							var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');
							var id = $el.attr('obj-id');
							Notification.findOne({
								id: id
							}, function(notifications) {
								Notification.update(notifications.id, {
									'status': 'Active'
								}).then(function() {
									bootbox.dialog({
										title: "",
										message: '<div class="msg-box">Notification is setup successfully.</div>'
									});
									self.element.trigger(self.options.triggerNext);
								});
							});



							ev.preventDefault();
						},

						/**	@ confirm draft click
						 *
						 * @param $el.
						 * @param ev.
						 *
						 * @return void
						 *
						 * @author Edwin
						 * @since 30 March 2015
						 */
						'a.en-wiz-draft click': function($el, ev) {
							var self = this;
							var id = $el.attr('obj-id');
							var Notification = AD.Model.get('opstools.EmailNotifications.ENNotification');
							Notification.findOne({
								id: id
							}, function(notifications) {
								Notification.update(notifications.id, {
									'status': 'Draft'
								}).then(function() {
									bootbox.dialog({
										title: "",
										message: '<div class="msg-box">Record saved as draft.</div>'
									});
									self.element.trigger(self.options.triggerNext);
								});
							});
							ev.preventDefault();

						},
						'.ad-item-add click': function($el, ev) {
							ev.preventDefault();
						}
					});
				});
		});
	});