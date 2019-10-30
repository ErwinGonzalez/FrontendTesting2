var express = require('express');
const cors = require('cors');
var bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());


/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost:8080',
  user     : 'root',
  password : '',
  database : 'temp'
  
});*/

app.get('/datos', function (req, res) {
  let now= new Date();
  var temp = req.query.Temperatura;
  var hum = req.query.Humedad;
  console.log("temperatura: " + temp + " humedad: " + hum +"   fecha/hora:"+now);
  //meter a la base de datos conforme van llegando
  //connection.connect();

  // connection.query('INSERT INTO temperatura'+temp+','+hum+freq+fecham+'INTO', function(err, rows, fields) {
  //   if (err) throw err;
  //   console.log('The solution is: ', rows[0].solution);
  // });
  
  //connection.end();
});
//esto va quemado por que no se va a hacer mesh
app.post('/info', cors(),function(req,res) {
  
  res.send({
    "id": 'proyecto02',
    "url": "127.0.0.1",
    "date": "hoy",
    "hardware": {
      "id01": {
        "tag": "Termistor",
        "type": "input"
      },
      "id02": {
        "tag": "LED RGB",
        "type": "output"
      }
    }//copiar impares en cuestionario de sp2
  });
  console.log("mando algo");
  console.log(req.body);
});

app.post('/search',function (req,res) {
 console.log( req.length );
  
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
