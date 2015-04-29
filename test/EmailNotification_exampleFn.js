
var AD = require('ad-utils');
var async = require('async');


////  Load Sails so everything is actually running.
var sailsObj = null;


////  Our Mock Objects
var mockAD     = AD.test.mockAD;


var reqObj     = { session:{} };        // a reuseable valid req object


////
////  Now the Unit Tests for EmailNotification.exampleFn()
//// 
var assert = require('chai').assert;
describe('test EmailNotification.exampleFn()',function(){

    before(function(done){

        // loading Sails can take a few seconds:
        this.timeout(80000);

        async.series([

            // load Sails:  AD.test.sails.load( fn(err, sails) );
            function(next) {

                AD.test.sails.load()
                .fail(function(err){
                    AD.log.error('... error loading sails : ', err);
                    next(err);
                })
                .done(function(obj) {
                    sailsObj = obj;
                    next();
                });

            },


            // for methods requiring a valid sails request (req) object:
            // let's simulate one here:
            function(next) {

                // properly initialize the req object with a test.guid  using user.
                ADCore.auth.markAuthenticated(reqObj, 'test.guid');
                next();
            }


        ], function(err, results){

            done(err);
        });
    
    });

    after(function(done){

        // AD.test.data.restore([LNSSCoreNSC])
        // .fail(function(err){
        //     done(err);
        // })
        // .done(function(){
        //     done();
        // });
        done();

    });



    it('calling .exampleFn() should return an object:',function(done){


        var originalObjects = EmailNotifications.____originalObjects();

//        EmailNotifications.____mockObjects({ Templates:mockTemplates });

        EmailNotifications.exampleFn()
        .fail(function(err){
            assert.ok(false, ' --> should not have called this. ');
            done();
        })
        .then(function(data){

            assert.ok(true, ' --> should have been called. ');
            assert.isObject(data,' --> data was an object');
            assert.property(data, 'key', ' --> had our Key field ');
            assert.notProperty(data, 'invalid', ' --> did not have property .invalid ');


            // return the original objects
            EmailNotifications.____mockObjects(originalObjects);
            done();
        })

    });




});

