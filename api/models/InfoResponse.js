

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InfoResponse = new Schema({
    RequestID: {
      type: String
    },
    RequestURL: {
      type: String
    },
    RequestDateTime: {
      type: String
    },
    RequestHardwareData:{
      type: Array
    }
  },{
      collection: 'InfoResponse'
  });

  module.exports = mongoose.model('InfoResponse', InfoResponse);