const express = require('express');
const app = express();
const requestRoutes = express.Router();

// Require Product model in our routes module
let InfoRequest = require('../models/InfoRequest');
let InfoResponse = require('../models/InfoResponse');

// Defined store route
requestRoutes.route('/infoRequest/add').post(function (req, res) {
    
    let infoRequest = new InfoRequest(req.body);
    
    console.log(infoRequest);
  infoRequest.save()
    .then(res => {
        
      res.status(200).json({'Request': 'Request has been added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/infoResponse/add').post(function (req, res) {
    
  let infoResponse = new InfoResponse(req.body);
  
  console.log(infoResponse);
infoResponse.save()
  .then(res => {
      
    res.status(200).json({'Request': 'Request has been added successfully'});
  })
  .catch(err => {
  res.status(400).send("unable to save to database");
  });
});

// Defined get data(index or listing) route
requestRoutes.route('/').get(function (req, res) {
  InfoRequest.find(function (err, requests){
    if(err){
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});


module.exports = requestRoutes;