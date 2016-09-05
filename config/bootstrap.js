/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var AD = require('ad-utils');

module.exports = function (cb) {

    // handle our common bootstrap setup instructions:
        // - verify permissions are created
        // - verify opsportal tool definitions are defined.
    AD.module.bootstrap(__dirname, function(err){

    	if (err) {
    		cb(err);
    	} else {
			// setup our EmailNotifications API:
			EmailNotifications.____init(cb);	
    	}
    });


	
	var schedule = require('node-schedule');

	if (sails.config.crontab) {

		Object.keys(sails.config.crontab).forEach(function(key) {
			var val = sails.config.crontab[key];
			schedule.scheduleJob(key, val);
		});

	}

};
