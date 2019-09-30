
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema debe usar los mismos nombres que tiene el servicio
 * por ejemplo para el info request son los parametros definidos aqui
 * C:\Users\Erwin\Desktop\projects\Proy-Frontend\frontend\src\app\inforequest.service.ts*/

let InfoRequest = new Schema({
  id: {
    type: String
  },
  url: {
    type: String
  },
  date: {
    type: String
  }
},{
    collection: 'InfoRequest'
});

module.exports = mongoose.model('InfoRequest', InfoRequest);