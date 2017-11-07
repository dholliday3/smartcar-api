// server.js

// BASE SETUP
// =================================================================

// wrapper for server configuration. Determines which port and what
// routes to include.

// call the packages we need
"use strict";
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var request = require('request'); // used to handle http requests to GM API
var smartcar = require('./controllers/routes/smartcar.js');

// configure app to use bodyParser()
// get data from POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000; //set port 
//(process.argv[2] || 3000) // optional

if (!module.parent) { app.listen(port); }

// ROUTES FOR API
// ==================================================================
var router = express.Router(); //instance of express Router

// middleware - notifies running for all requests
// should probably handle errors
router.use(function(req, res, next) {
    //log
    console.log('The api was called.');
    next();

    //TO-DO - need to include error handling

});

// Route calls to smartcar.js where request implementation is

// GET /vehicles/:id
router.route('/:id').get(smartcar.getVehicleByID);

// GET /vehicles/:id/doors
router.route('/:id/doors').get(smartcar.getVehicleDoor);

// GET /vehicles/:id/fuel
router.route('/:id/fuel').get(smartcar.getVehicleFuel);

// GET /vehicles/:id/battery
router.route('/:id/battery').get(smartcar.getVehicleBattery);

// POST /vehicles/:id/engine
router.route('/:id/engine').post(smartcar.postVehicleEngine);

//add more api calls

// REGISTER ROUTES
// ==================================================================
app.use('/vehicles', router); // routes use /vehicles prefix

// START SERVER
// ==================================================================
//app.listen(port);
console.log('Yuhhhh, server happening on this port: ' + port);

module.exports = app;