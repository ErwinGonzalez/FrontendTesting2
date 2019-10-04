const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SearchResponse = new Schema({
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
    data: {
        type: Array
    }
}, {
    collection: 'SearchResponse'
});

module.exports = mongoose.model('SearchResponse', SearchResponse);