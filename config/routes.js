/**
 * Routes
 *
 * Use this file to add any module specific routes to the main Sails
 * route object.
 */


module.exports = {	
	'get isUniqeTitle'  : 'opstool-emailNotifications/enrecipient.isUniqeTitle',
	'get isUniqeNotificationTitle'  : 'opstool-emailNotifications/ennotification.isUniqeNotificationTitle'

  /*

  '/': {
    view: 'user/signup'
  },
  '/': 'opstool-emailNotifications/PluginController.inbox',
  '/': {
    controller: 'opstool-emailNotifications/PluginController',
    action: 'inbox'
  },
  'post /signup': 'opstool-emailNotifications/PluginController.signup',
  'get /*(^.*)' : 'opstool-emailNotifications/PluginController.profile'

  */


};

