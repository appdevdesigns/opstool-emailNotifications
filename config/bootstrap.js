/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports = function (cb) {

	// setup our EmailNotifications API:
	EmailNotifications.____init(cb);


	/*
	 * If you have additional setup steps, then it might be better to use:

	async.series([

		// step 1: call EmailNotifications.____init()
		function(next) {
			EmailNotifications.____init(next);
		},

		// step 2: call ......
		function(next) {
			......(next);
		},

		// repeat for each setup routine 

	],function(err, results){
	
		cb(err);
	})

	 */

};