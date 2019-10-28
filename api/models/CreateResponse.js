const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CreateResponse = new Schema({
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
    },
    idEvent:{
        type: String
    }
}, {
    collection: 'CreateResponse'
});

module.exports = mongoose.model('CreateResponse',CreateResponse);