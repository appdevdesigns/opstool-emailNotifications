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
    
    setRecipientId: function (req, res){
			recipientId = req.param('recipientId');
			console.log(req.session.recipientId);
			return req.session.recipientId = recipientId;
		},
		
	getRecipientId : function (req, res){
		 return req.session.recipientId;
		},
		
		
	isUniqeNotificationTitle : function(req,res){
		ENNotification.findByNotificationTitle(req.param('notificationTitle')).exec(function(err, recipient){
				if(err){ 
					return res.send(500,err);
				}
				if(recipient.length > 0){ 
					return res.send('DuplicateError',400);
				}else{
						return res.send('Success',200);
					}
			});
	}			
	
};

