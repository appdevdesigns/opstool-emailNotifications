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
	
	/**
	 * @function isUniqeTitle
	 * @param req
	 * @param res
	 * return object
	 * author Edwin
	 * since  25-May-2015
	 */
	 
	isUniqeTitle : function(req,res){
		var id    = req.param('id');	
		var params = {};
			params.title = req.param('title');
		if (id) {
				params.id =  { '!' : + id };
		}
	
		
		ENRecipient.find(params).exec(function(err, recipient){		
			
						return res.send(recipient);
					
			});
				
	},
	
	/**
	 * @function getRecipientCount
	 * @param req
	 * @param res
	 * return string
	 * author Edwin
	 * since  25-May-2015
	 */
	 
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

