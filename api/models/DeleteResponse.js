const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DeleteResponse = new Schema({
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
    collection: 'DeleteResponse'
});

module.exports = mongoose.model('DeleteResponse',DeleteResponse);