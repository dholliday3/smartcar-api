// smartcar.js
// routes all Smartcar api calls to appropriate GM api calls
"use strict";
var request = require('request');

// gmapi endpoints
const gmapiURI = 'http://gmapi.azurewebsites.net';
const getVehicle = '/getVehicleInfoService';
const getSecurity = '/getSecurityStatusService';
const getEnergy = '/getEnergyService';
const getEngine = '/actionEngineService';

// constant for gas or energy when making gm api call
// (the GM api call is the same so this cuts down on writing 2 functions for same call)
const GAS_CALL = 'GAS';
const BATTERY_CALL = 'BATTERY';

// API CALLS
// ==================================================================

// GET /vehicles/:id
function getVehicleByID(req, res) {
    var id = req.params.id;
    console.log('/:id - ' + id);

    // calling gmapi ----------------------------
    request({
        url: gmapiURI + getVehicle,
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: {
            'id': id,
            'responseType': 'JSON'
        }
    }, function(error, response, body) { // returning response to smartcar api call
        if (!error && response.statusCode == 200) {
            //check if 4 or 2 door
            var doorCount = 0;
            if (body.data.fourDoorSedan.value == 'True') {
                doorCount = 4;
            } else {
                doorCount = 2;
            }
            //return api response after reformatting
            res.json({
                'vin': body.data.vin.value,
                'color': body.data.color.value,
                'doorCount': doorCount,
                'driveTrain': body.data.driveTrain.value
            });
        } else {
            res.status(400).send('Incorrect request in GET Vehicle Info');
            console.log(error);
            console.log("Error in GMAPI call: " + response.statusCode);
        }
    });
};

// GET /vehicles/:id/doors
function getVehicleDoor(req, res) {
    var id = req.params.id;
    console.log('we in these doors: ' + id);

    request({
        url: gmapiURI + getSecurity,
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: {
            'id': id,
            'responseType': 'JSON'
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var securityResponse = [{ // default response with locked == false to start with
                    'location': 'frontLeft',
                    'locked': false
                },
                {
                    'location': 'frontRight',
                    'locked': false
                }
            ];
            var frontLeft = body.data.doors.values[0].locked.value;
            var frontRight = body.data.doors.values[1].locked.value;
            //console.log(frontLeft);
            //console.log(frontRight);
            if (frontLeft == 'True') { // check if gmapi call
                securityResponse[0].locked = true;
            }
            if (frontRight == 'True') {
                securityResponse[1].locked = true;
            }
            //return api response after reformatting
            res.json(securityResponse);
        } else {
            res.status(400).send('Incorrect request in GET Vehicle Security');
            console.log(error);
            console.log("Error in GMAPI call: " + response.statusCode);
        }
    });
};

// GET /vehicles/:id/fuel
function getVehicleFuel(req, res) {
    getAndReturnEnergyLevel(req.params.id, GAS_CALL, res);
};

// GET /vehicles/:id/battery
function getVehicleBattery(req, res) {
    getAndReturnEnergyLevel(req.params.id, BATTERY_CALL, res);
};

// POST /vehicles/:id/engine
function postVehicleEngine(req, res) {
    var id = req.params.id;
    var engineAction = req.query.action;
    //console.log('Engine action: ' + engineAction);
    var gmAPIEngineAction = '';
    if (engineAction == 'START') {
        gmAPIEngineAction = 'START_VEHICLE';
    } else if (engineAction == 'STOP') {
        gmAPIEngineAction = 'STOP_VEHICLE';
    } else {
        res.status(400).send('Incorrect request');
    }

    // calling gmapi ----------------------------
    request({
        url: gmapiURI + getEngine,
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: {
            'id': id,
            'command': gmAPIEngineAction,
            'responseType': 'JSON'
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //check if 4 or 2 door
            var engineStatus = '';
            if (body.actionResult.status == 'EXECUTED') {
                engineStatus = 'success';
            } else {
                engineStatus = 'error';
            }
            //return api response after reformatting
            res.json({
                'status': engineStatus
            });
        } else {
            res.status(400).send('Incorrect request POST starting|stopping Engine');
            console.log(error);
            console.log("Error in GMAPI call: " + response.statusCode);
        }
    });
};

// Helper functions
// ==================================================================
// function that makes a call to the GM API and returns the percentage
// of energy left.
function getAndReturnEnergyLevel(id, energyType, res) {
    request({
        url: gmapiURI + getEnergy,
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: {
            'id': id,
            'responseType': 'JSON'
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var energyLevel = 0;
            if (energyType == GAS_CALL) {
                energyLevel = body.data.tankLevel.value;
            } else if (energyType == BATTERY_CALL) {
                energyLevel = body.data.batteryLevel.value;
                if (energyLevel == 'null') {
                    console.log('This car does not have a battery');
                }
            }

            //return api response after reformatting
            res.json({
                'percent': Number(Number(energyLevel).toPrecision(2))
            });
        } else {
            if (energyType == GAS_CALL) {
                res.status(400).send('Incorrect request in GET Gas Info');
            } else if (energyType == BATTERY_CALL) {
                res.status(400).send('Incorrect request in GET Battery Info');
            }
            console.log(error);
            console.log("Error in GMAPI call: " + response.statusCode);
        }
    });
}

// export functions so can be called by server.js
module.exports = {
    getVehicleByID,
    getVehicleDoor,
    getVehicleFuel,
    getVehicleBattery,
    postVehicleEngine
};