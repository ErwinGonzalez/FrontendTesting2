const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UpdateResponse = new Schema({
    id: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    },
    status: {
        type: String
    }
}, {
    collection: 'UpdateResponse'
});

module.exports = mongoose.model('UpdateResponse',UpdateResponse);