/**
* ENNotificationLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: "safe",
  // connection:"appdev_default",	
  tableName:"en_notification_log",	



  attributes: {

    notificationId : { type: 'integer' },

    sendDate : { type: 'datetime' },

    status : { type: 'string' },
    
    log : { type: 'object'}
  }
};

