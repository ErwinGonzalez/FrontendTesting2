const express = require('express');
const app = express();
const requestRoutes = express.Router();

// Require Product model in our routes module
let InfoRequest = require('../models/InfoRequest');
let InfoResponse = require('../models/InfoResponse');
let SearchRequest = require('../models/SearchRequest');
let SearchResponse = require('../models/SearchResponse');
let ChangeRequest = require('../models/ChangeRequest');
let ChangeResponse = require('../models/ChangeResponse');
let CreateRequest = require('../models/CreateRequest');
let CreateResponse = require('../models/CreateResponse');
let EventRequest = require('../models/Event');
let DeleteRequest = require('../models/DeleteRequest');
let DeleteResponse = require('../models/DeleteResponse');
let UpdateRequest = require('../models/UpdateRequest');
let UpdateResponse = require('../models/UpdateResponse');

// Defined store route
requestRoutes.route('/infoRequest/add').post(function (req, res) {

  let infoRequest = new InfoRequest(req.body);

  console.log("routes");
  console.log(infoRequest);
  console.log(infoRequest);
  infoRequest.save()
    .then(infoRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/infoRequest').get(function (req, res) {
  InfoRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/infoResponse/add').post(function (req, res) {

  let infoResponse = new InfoResponse(req.body);

  console.log(infoResponse);
  infoResponse.save()
    .then(infoResponse => {

      res.status(200).json({ 'Request': 'Response has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/infoResponse').get(function (req, res) {
  InfoResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/infoResponse/update/:id').post(function (req, res) {
  console.log(req.params.id);
  InfoResponse.findById(req.params.id,function (err, response) {
    if (!response) {
      res.status(404).send("Not Found");
    }
    else {
      response.id = req.body.id;
      response.url = req.body.url;
      response.date = req.body.date;
      response.hardware = req.body.hardware;
      
      response.save().then( response => {
        res.json('Update Complete');
      }).
      catch(err=>{
        res.status(400).send("Unable to update Database");
      });

    }
  });
});

requestRoutes.route('/searchRequest/add').post(function (req, res) {

  let searchRequest = new SearchRequest(req.body);

  console.log(searchRequest);
  searchRequest.save()
    .then(searchRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/searchRequest').get(function (req, res) {
  SearchRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/searchResponse/add').post(function (req, res) {

  let searchResponse = new SearchResponse(req.body);

  console.log(searchResponse);
  searchResponse.save()
    .then(searchResponse => {

      res.status(200).json({ 'Request': 'Response has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/searchResponse').get(function (req, res) {
  SearchRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/changeRequest/add').post(function (req, res) {

  let changeRequest = new ChangeRequest(req.body);

  console.log(changeRequest);
  changeRequest.save()
    .then(changeRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/changeRequest').get(function (req, res) {
  ChangeRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/changeResponse/add').post(function (req, res) {

  let changeResponse = new ChangeResponse(req.body);

  console.log(changeResponse);
  changeResponse.save()
    .then(changeResponse => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/changeResponse').get(function (req, res) {
  ChangeResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});
requestRoutes.route('/createRequest/add').post(function (req, res) {

  let createRequest = new CreateRequest(req.body);

  console.log("routes");
  
  createRequest.save()
    .then(createRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/createRequest').get(function (req, res) {
  createRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});
requestRoutes.route('/createResponse/add').post(function (req, res) {

  let createResponse = new CreateResponse(req.body);

  console.log(createResponse);
  createResponse.save()
    .then(createResponse => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/createResponse').get(function (req, res) {
  CreateResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});
requestRoutes.route('/Events/add').post(function (req, res) {

  let eventRequest = new EventRequest(req.body);

  console.log(eventRequest);
  eventRequest.save()
    .then(eventRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/Events').get(function (req, res) {
  EventRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});
requestRoutes.route('/Events/update/:_id').post(function (req, res) {
  console.log(req.params._id);
  EventRequest.findById(req.params._id,function (err, response) {
    if (!response) {
      res.status(404).send("Not Found");
    }
    else {
      response.id = req.body.id;
      response.url = req.body.url;
      response.date = req.body.date;
      response.event = req.body.event;
      
      response.save().then( response => {
        res.json('Update Complete');
      }).
      catch(err=>{
        res.status(400).send("Unable to update Database");
      });

    }
  });
});

requestRoutes.route('/Events/delete/:id').get(function (req,res){
  console.log(req.params.id)
  EventRequest.findByIdAndRemove({_id: req.params.id}, function(err, request){
    if(err) res.json(err);
    else res.json('Success');
  });
});

requestRoutes.route('/updateRequest/add').post(function (req, res) {

  let updateRequest = new UpdateRequest(req.body);

  console.log(updateRequest);
  updateRequest.save()
    .then(updateRequest => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/updateRequest').get(function (req, res) {
  UpdateRequest.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/updateResponse/add').post(function (req, res) {

  let updateResponse = new UpdateResponse(req.body);

  console.log(updateResponse);
  updateResponse.save()
    .then(updateResponse => {

      res.status(200).json({ 'Response': 'Response has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/updateResponse').get(function (req, res) {
  UpdateResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/deleteResponse/add').post(function (req, res) {

  let deleteResponse = new DeleteResponse(req.body);

  console.log(deleteResponse);
  deleteResponse.save()
    .then(deleteResponse => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/deleteResponse').get(function (req, res) {
  DeleteResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

requestRoutes.route('/deleteResponse/add').post(function (req, res) {

  let deleteResponse = new DeleteResponse(req.body);

  console.log(deleteResponse);
  deleteResponse.save()
    .then(deleteResponse => {

      res.status(200).json({ 'Request': 'Request has been added successfully' });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

requestRoutes.route('/deleteResponse').get(function (req, res) {
  DeleteResponse.find(function (err, requests) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(requests);
    }
  });
});

module.exports = requestRoutes;