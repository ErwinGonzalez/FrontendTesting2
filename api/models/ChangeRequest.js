const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChangeRequest = new Schema({
    id: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    },
    change: {
        type: Object
    }
}, {
    collection: 'ChangeRequest'
});

module.exports = mongoose.model('ChangeRequest',ChangeRequest);