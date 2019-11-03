const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DeleteRequest = new Schema({
    id: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    },
    delete: {
        type: Object
    }
}, {
    collection: 'DeleteRequest'
});

module.exports = mongoose.model('DeleteRequest',DeleteRequest);