const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()
app.use(bodyparser.json())
app.use(cors())


/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost:8080',
  user     : 'root',
  password : '',
  database : 'temp'
  
});*/
var now = new Date();
app.get('/datos', function (req, res) {
  
  var temp = req.query.Temperatura;
  var hum = req.query.Humedad;
  console.log("temperatura: " + temp + " humedad: " + hum +"   fecha/hora:"+now);
  //meter a la base de datos conforme van llegando
  connection.connect();

   connection.query('INSERT INTO temperatura'+temp+','+hum+freq+fecham+'INTO', function(err, rows, fields) {
     if (err) throw err;
     console.log('The solution is: ', rows[0].solution);
   });
  
  connection.end();
});
//esto va quemado por que no se va a hacer mesh
app.post('/info',function(req,res) {
  
  
  res.send({
    "id": 'proyecto02',
    "url": "localhost:3000",
    "date": now.toISOString(),
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
 
 console.log(req.body);
    res.send ({
      "​id​": "proyecto02",
      "​url​": "localhost:3000",
      "​date​": now.toISOString(),
      "​search​": {
        "​id_hardware​": "id01",
        "​type​": "input"
      },
      "​data​": {
        "1989-12-20T07:35:49.757Z": {
          "​sensor​": 233,
          "​status​": false,
          "​freq​": 30000,
          "​text​": "Estable"
        },
        "1989-12-20T07:40:58.757Z": {
          "​sensor​": 570,
          "​status​": false,
          "​freq​": 30000,
          "​text​": "Estable"
        },
        "1989-12-20T07:45:49.757Z": {
          "​sensor​": 770,
          "​status​": true,
          "​freq​": 10000,
          "​text​": "Peligro"
        }
      }
    });
});

app.post('/change',function (req,res) {
  console.log(req.body);
  res.send(
    {
      "​id​": "proyecto02",
      "​url​": "localhost:3000",
      "​date​": now.toISOString(),
      "​status​": "ERROR"
    }
  );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
