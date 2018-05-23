/**
* ENRecipient.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  migrate: "alter",
  // connection:"appdev_default",
  tableName:"en_recipient",		// <-- namespace all your tables with 'en_' 	


  attributes: {

    title : { type: 'string' },

    recipients : { type: 'text' }
   
  }
};

