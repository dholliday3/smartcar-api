// smartcar.test.js
//
'use strict';
process.env.NODE_ENV = 'test';
var app = require("../");
var request = require("supertest").agent(app.listen());
var chai = require('chai');
var expect = chai.expect;

// UNIT tests
// =================================================================

describe('Unit tests', function() {

    // #1 return vehicle info
    it('#1 - should return vehicle info', function(done) {
        // calling vehicle info api
        request.get('/vehicles/1234').end(function(err, res) {
            this.timeout(10000); // allows test to take up to 10sec
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object'); //test return type
            expect(res.body).to.all.keys('vin', 'color', 'doorCount', 'driveTrain'); // test if have keys
            expect(res.body.doorCount).to.be.a('number'); //test type of doorCount is number
            expect(res.body.vin).to.be.a('String');
            expect(res.body.color).to.be.a('String');
            expect(res.body.driveTrain).to.be.a('String');
            done();
        });
    });

    // #2 vehicle security info
    it('#2 - should return security info', function(done) {
        // call security api 
        request.get('/vehicles/1234/doors').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body[0]).to.be.a('Object');
            expect(res.body[1]).to.be.a('Object');
            expect(res.body[0]).to.all.keys('location', 'locked'); // test if have keys
            expect(res.body[1]).to.all.keys('location', 'locked');
            expect(res.body[0].locked).to.be.a('boolean'); // test if returns boolean
            expect(res.body[1].locked).to.be.a('boolean');
            expect(res.body[0].location).to.be.a('String'); // test if returns string
            expect(res.body[1].location).to.be.a('String');
            expect(res.body[0].locked).to.be.oneOf([true, false]);
            expect(res.body[1].locked).to.be.oneOf([true, false]);
            expect(res.body[0].location).to.equal('frontLeft');
            expect(res.body[1].location).to.equal('frontRight');
            done();
        });
    });

    // #3 vehicle battery info
    it('#3 - should return battery info', function(done) {
        // call battery api 
        request.get('/vehicles/1234/battery').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object');
            expect(res.body).to.all.keys('percent');
            //test if returns number or null
            if (res.body.percent != null) {
                expect(res.body.percent).to.be.a('number');
            } else {
                expect(res.body.percent).to.equal(null);
            }
            done();
        })
    });

    // #4 vehicle fuel info 
    it('#4 - should return fuel info', function(done) {
        // call battery api 
        request.get('/vehicles/1234/fuel').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object');
            expect(res.body).to.all.keys('percent');
            //test if returns number or null
            if (res.body.percent != null) {
                expect(res.body.percent).to.be.a('number');
            } else {
                expect(res.body.percent).to.equal(null);
            }
            done();
        })
    });

    // #5.1 START engine
    it('#5.1 - should return START engine', function(done) {
        // call battery api 
        request.post('/vehicles/1234/engine?action=START').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object');
            expect(res.body).to.all.keys('status');
            done();
        })
    });

    // #5.2 STOP engine
    it('#5.2 - should return STOP engine', function(done) {
        // call battery api 
        request.post('/vehicles/1234/engine?action=STOP').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object');
            expect(res.body).to.all.keys('status');
            expect(res.body.status).to.be.oneOf(['success', 'error']);
            done();
        })
    });

    // #6 pass in incorrect URI
    it('#6 - should test wrong api uri - return 404', function(done) {
        // call battery api 
        request.post('/vehicles/1234/nothing').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).to.equal(404);
            done();
        })
    });

    // #7 POST wrong start|stop in engine call
    it('#7 - POST wrong start|stop in engine call', function(done) {
        // call battery api 
        request.post('/vehicles/1234/engine?action=NOT_RIGHT').end(function(err, res) {
            this.timeout(5000);
            expect(res.statusCode).equals(400); //returns error code as specified in API
            done();
        })
    });
});