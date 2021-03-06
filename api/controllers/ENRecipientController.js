/**
 * ENRecipientController
 *
 * @description :: Server-side logic for managing Enrecipients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

     _config: {
        model: "enrecipient", // all lowercase model name
        actions: true,
        shortcuts: true,
        rest: true
    },
	
	isUniqeTitle : function(req,res){
		var title = req.param('title');
		var id    = req.param('id');	
		
		ENRecipient.findByTitle(title).exec(function(err, recipient){
				if(err){ 
					return res.send(500,err);
				}
				if(recipient.length > 0){ 
					return res.send('DuplicateError',400);
				}else{
						return res.send('Success',200);
					}
			});
				
	},
	
	/*setRecipientId: function(req,res){
		var id =  req.param('id');
		
		return req.session.recipientId = id;
		
		
		}*/
	
	getRecipientCount : function(req, res){
				ENRecipient.findById(id).exec(function(err, recipient){
				if(recipient.length > 0){ 
					var selectedRecipient = recipient.recipients.split(',');
					var totalRecipient = selectedRecipient.length;
					return totalRecipient;			
				}	
			
		});	
		
		
		}	
	
	
		
};

