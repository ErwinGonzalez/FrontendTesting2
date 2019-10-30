const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CreateRequest = new Schema({
    id: {
        type: String
    },
    url: {
        type: String
    },
    date: {
        type: String
    },
    idEvento:{
        type:String
    },
    create: {
        type: Object
    }
}, {
    collection: 'CreateRequest'
});

module.exports = mongoose.model('CreateRequest',CreateRequest);