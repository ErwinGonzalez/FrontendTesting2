const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InfoResponse = new Schema({
    id: {
      type: String
    },
    url: {
      type: String
    },
    date: {
      type: String
    },
    hardware:{
      type: Array
    }
  },{
      collection: 'InfoResponse'
  });

  module.exports = mongoose.model('InfoResponse', InfoResponse);