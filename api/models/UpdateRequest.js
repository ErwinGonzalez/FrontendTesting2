const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UpdateRequest = new Schema({
    id: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    },
    update:{
        type: Object
    }
}, {
    collection: 'UpdateRequest'
});

module.exports = mongoose.model('UpdateRequest',UpdateRequest);