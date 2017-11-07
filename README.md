# smartcar-gm-api
Api that layers the gm api and restructures the REST calls to follow best 
practices.

## How to use this project 
Clone the repo onto local and run server.js. The current PORT is set as 3000. 
``` 
node server.js
```

## How to run tests 
From the command line go to /tests - run mocha. 
``` 
mocha
```

## Smartcar REST Calls

### Vehicle Info
##### Request: 
```
GET /vehicles/:id
``` 
##### Response: 
```
{
  "vin": "1213231",
  "color": "Metallic Silver",
  "doorCount": 4,
  "driveTrain": "v8"
}
``` 
### Security 
##### Request: 
```
GET /vehicles/:id/doors
```
##### Response: 
```
[
  {
    "location": "frontLeft",
    "locked": true
  },
  {
    "location": "frontRight",
    "locked": true
  }
]
```
### Fuel Range 
##### Request: 
```
GET /vehicles/:id/fuel
```
##### Response:
```
{
  "percent": 30
}
```
### Battery Range 
##### Request: 
```
GET /vehicles/:id/battery
```
##### Response: 
```
{
  "percent": 50
}
```
### Start/Stop Engine 
##### Request: 
```
POST /vehicles/:id/engine
Content-Type: application/json

{
  "action": "START|STOP"
}
```
##### Response: 
```
{
  "status": "success|error"
}
```
