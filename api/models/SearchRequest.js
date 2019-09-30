const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SearchRequest = new Schema({
    id: {
      type: String
    },
    url: {
      type: String
    },
    date: {
      type: String
    },
    search: {
      type: Object
    },
  },{
      collection: 'SearchRequest'
  });

  module.exports = mongoose.model('SearchRequest', SearchRequest);