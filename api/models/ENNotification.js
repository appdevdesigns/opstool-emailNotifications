/**
* ENNotification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection:"appdev_default",
  tableName:"en_notification",		// <-- namespace all your tables with 'en_' 
    	
  attributes: {

    notificationTitle : { type: 'string' },

    emailSubject : { type: 'text' },

    fromName : { type: 'string' },

    fromEmail : { type: 'string' },

    startFrom : { type: 'date' },
    
    recipientListId : { type: 'integer' }
  }
};

