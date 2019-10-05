const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChangeResponse = new Schema({
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
    collection: 'ChangeResponse'
});

module.exports = mongoose.model('ChangeResponse', ChangeResponse);