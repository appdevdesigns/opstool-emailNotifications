/**
 * ENNotificationController
 *
 * @description :: Server-side logic for managing Ennotifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    _config: {
        model: "ennotification", // all lowercase model name
        actions: true,
        shortcuts: true,
        rest: true
    },
    
    /**
   * @function isUniqeNotificationTitle
   * @param req
   * @param res
   * return string
   * author Edwin
   * since  25-May-2015
   */
    
  isUniqeNotificationTitle : function(req,res){
      
      var id    = req.param('id');  
      var params = {};
      params.notificationTitle = req.param('title');
      if (id) {
          params.id =  { '!' : + id };
      }
          
      ENNotification.find(params).exec(function(err, notification){     
        
          return res.send(notification);
            
      });
  }     
  
};

