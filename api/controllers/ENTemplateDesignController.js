/**
 * ENTemplateDesignController
 *
 * @description :: Server-side logic for managing Entemplatedesigns
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    _config: {
        model: "entemplatedesign", // all lowercase model name
        actions: true,
        shortcuts: true,
        rest: true
    },
    
    /**
	 * @function isUniqeDesignTitle
	 * @param req
	 * @param res
	 * return object
	 * author Edwin
	 * since  25-May-2015
	 */
             
    isUniqeDesignTitle : function(req,res){
			
			var id    = req.param('id');	
			var params = {};
				params.templateTitle = req.param('title');
			if (id) {
					params.id =  { '!' : + id };
			}
		
			
			ENTemplateDesign.find(params).exec(function(err, design){	
			
							return res.send(design);
						
				});
	}
	
};

