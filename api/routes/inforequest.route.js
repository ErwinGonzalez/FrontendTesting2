const express = require('express');
const app = express();
const infoRequestRoutes = express.Router();

// Require Product model in our routes module
let InfoRequest = require('../models/InfoRequest');

// Defined store route
infoRequestRoutes.route('/add').post(function (req, res) {
    
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

// Defined get data(index or listing) route
infoRequestRoutes.route('/').get(function (req, res) {
  InfoRequest.find(function (err, requests){
    if(err){
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});


module.exports = infoRequestRoutes;