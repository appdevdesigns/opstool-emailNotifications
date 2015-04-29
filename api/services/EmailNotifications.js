var path = require('path');




//-----------------------------------------------------------------------------
// Variables:
//-----------------------------------------------------------------------------
var AD = require('ad-utils');       // reusable AD utilities (log, sal, etc...)
var Models = {};                    // reference our /api/models/* here.
                                    // so that our unit tests can Mock them 
                                    // easier.


module.exports= {

        /*
         *  @function ____init
         *
         *  function called during the bootstrap.js process in order to setup
         *  variables that are not available when this file is initially read.
         *
         *  @param {fn} cb  the callback to call when finished.
         *                  if there was an error: 
         *                      var err = new Error('That didnt work!');
         *                      cb(err);
         *                  else
         *                      cb();
         *
         *
         */
        ____init:function(cb) {
            AD.log('... <green><bold>EmailNotifications.____init()</bold></green>');


            // 1) Setup local References to the Global Models to use:
            //    suppose you had /api/models/ENTemplates.js model definition:
            //    Models.Templates = ENTemplates;



            cb();
        },



        /*
         *  @function ____mockObjects
         *
         *  Allow our unit tests to send in Mock objects to return
         *  predetermined values.
         */
        ____mockObjects:function(opt) {


            if (opt.AD) {
                AD = opt.AD;
            }

            // add any other variables you want to overwrite here:


            // 1) Like checking for any Model References here:
            //    if (opt.Templates) {  Models.Templates = opt.Templates; }

        },



        /*
         *  @function ____originalObjects
         *
         *  Allow our unit tests to retrieve the original objects that are 
         *  in use.  So they can reset them to the proper values when they
         *  are done.
         *
         *  @codestart
         *  // get the original Object references
         *  var originalObjects = EmailNotifications.____originalObjects();
         *
         *  // update with our mocked versions:
         *  EmailNotifications.____mockObjects({ AD:MockAD, Templates:MockTemplateModel });
         *
         *  //// perform your tests.
         *
         *  // return the original objects 
         *  EmailNotificaitons.____mockObjects(originalObjects);
         *  @codeend
         */
        ____originalObjects:function() {


            return {
                AD:AD,
                // Templates: Models.Templates
            }

        },



//
// OK this is just an example.
// 
// For Asynchronous methods: create and return Deferreds.
// 
// (delete this.)
// 
exampleFn: function(){
    var dfd = AD.sal.Deferred();


    // now do your Async Operation here:


    // Model.Template.findOne({ key:'CoolTemplate'})
    // .then(function(template){
    //    dfd.resolve(template);
    // })
    // .catch(function(err){
    //    dfd.reject(err);
    // })

    // for this example I'm just resolving it:
    dfd.resolve({ key:'CoolTemplate', date:'1970-01-01' });


    return dfd;
}



}




