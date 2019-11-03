const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Event = new Schema({
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
    event: {
        type: Object
    }
}, {
    collection: 'Event'
});

module.exports = mongoose.model('Event',Event);