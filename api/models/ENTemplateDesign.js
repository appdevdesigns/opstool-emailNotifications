/**
* ENTemplateDesign.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection:"appdev_default",
  tableName:"en_template_design",	


  attributes: {

    templateTitle : { type: 'string' },

    templateBody : { type: 'text' },

    templateType : { type: 'string', defaultsTo:'One Column' }
  }
};

