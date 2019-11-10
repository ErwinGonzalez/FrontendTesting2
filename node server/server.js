const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()

var os = require('os');
var ifaces = os.networkInterfaces();

app.use(bodyparser.json())
app.use(cors())

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var iphardware = "192.168.3.4";
var ipPlataforma = "192.168.1.1";
var idPlataforma = 'SeVaQuemar!!'

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'temp'

});

app.post('/datos', function (req, res) {
  console.log(req.body);
  let now = new Date();
  var fecha_formato = now.toJSON();
  //"2017-09-15T12:30:28.757Z"
  var fechamsq = fecha_formato.substring(0, 10);
  var horamsq = fecha_formato.substring(11, 19);
  var datetime = fechamsq + " " + horamsq;
  console.log(datetime);
  var temp = req.query.Temperatura;
  var hum = req.query.Humedad;
  var freq = req.query.Frecuencia;
  var estado = req.query.Status
  //console.log("temperatura: " + temp + " humedad: " + hum +"   fecha/hora:"+now);
  //meter a la base de datos conforme van llegando
  //connection.connect();
  let consulta = 'INSERT INTO `iot`(temperatura,humedad,frecuencia,status,fecha) VALUES(' + temp + "," + hum + "," + freq + "," + estado + ",\'" + datetime + '\')';
  connection.query(consulta, function (err, rows, fields) {
    if (err) throw err;
    return;
  });

  //connection.end();
  //console.log(req.query.Temperatura);
  //console.log(req.query.Humedad);
  //console.log(req.query.Frecuencia);
  res.send("ok");

});
//esto va quemado por que no se va a hacer mesh
app.post('/info', function (req, res) {
  let event = new Date();
  var fecha = event.toJSON();
  var s2 = fecha.substring(0, fecha.length - 1);
  var keys = Object.keys(req.body);
  console.log(req.ip)
  console.log(req.body)
  console.log(keys);
  console.log(s2)
  if (req.body.hasOwnProperty('id') &&
    req.body.hasOwnProperty('url') &&
    req.body.hasOwnProperty('date')) {
    //console.log(req);
    var date = req.body.date;
    var s = date.substring(0, date.length - 1);

    let qStmt = "INSERT INTO `info_requests`(`id`, `url`, `date`)";
    let vStmt = ' VALUES (\'' + req.body.id + '\',\'' +
      req.body.url + '\',\'' +
      s + '\')';

    console.log(vStmt);
    connection.query(qStmt + vStmt);

    res.send({
      "id": idPlataforma,
      "url": ipPlataforma,
      "date": fecha,
      "hardware": {
        "id01": {
          "tag": "Termistor",
          "type": "input"
        },
        "id02": {
          "tag": "LED",
          "type": "output"
        }
      }//copiar impares en cuestionario de sp2
    });

    qStmt = 'INSERT INTO `info_response`(`id`, `url`, `date`, `id_hardware`, `hardware_tag`, `hardware_type`) ';
    vStmt = ' VALUES (\'SeVaQuemar!!\',\'' +
      ipPlataforma + '\',\'' +
      s2 + '\',\'id01\',\'Termistor\', \'input\')';
    console.log(vStmt);
    connection.query(qStmt + vStmt);
    vStmt = ' VALUES (\'SeVaQuemar!!\',\'' +
      ipPlataforma + '\',\'' +
      s2 + '\',\'id02\',\'LED\', \'output\')';
    connection.query(qStmt + vStmt);
    console.log("mando algo");
    console.log(req.body);//guardar un log de esto
  } else {
    let qStmt = "INSERT INTO `info_requests`(`id`, `url`, `date`)";
    let vStmt = ' VALUES (\'undefined\',\'' +
      req.ip + '\',\'' +
      s2 + '\')';
    connection.query(qStmt + vStmt);
    var r = {
      'error': 'error reading body',
      'req': req.body
    }
    res.send(r)
  }
});

app.post('/search', function (req, res) {

  console.log(req.body);
  let datetime = getDate()
  let fecha_inicio, s1
  let fecha_final, s2
  let id_req, hard
  try {
    id_req = req.body.id
    hard = req.body.search.hardware
  } catch{
    console.log('error reading id')
  }
  try {
    fecha_inicio = req.body.search.start_date;
    fecha_final = req.body.search.finish_date;
    s1 = fecha_inicio.substring(0, fecha_inicio.length - 1);
    s2 = fecha_final.substring(0, fecha_final.length - 1);

  } catch{
    console.log('error reading dates')
  }
  if (req.body.hasOwnProperty('id') &&
    req.body.hasOwnProperty('url') &&
    req.body.hasOwnProperty('date') &&
    req.body.hasOwnProperty('search')) {
    //TODO obtain the correct dates, from ISO format
    console.log(fecha_inicio);
    console.log(fecha_final);

    //Save the request
    let qStmt = 'INSERT INTO `search_req`(`id`, `url`, `date`, `id_hardware`, `start_date`, `finish_date`)';
    let vStmt = ' VALUES (\'' +
      req.body.id + '\',\'' + req.body.url + '\',\'' + req.body.date + '\',\'' +
      req.body.search.id_hardware + '\',\'' + s1 + '\',\'' + s2 + '\')';

    connection.query(qStmt + vStmt);

    //Obtain the selected data
    connection.query('SELECT * FROM iot', function (err, rows, fields) {
      if (err) throw err;

      //Determine if the request is an input or an output
      let type = rows[0].frecuencia > 0 ? 'input' : 'output';
      var obj = {
        'id': req.body.id,
        'url': req.body.url,
        'date': req.body.date,
        'search': {
          'id_hardware': req.body.search.id_hardware,
          'type': type
        },
      };


      var data = {};
      /**
       * If it's an input it should return it's sensor value and frequency
       * If it's an output it should return it's status and text keyword
       */
      for (let i = 0; i < rows.length; i++) {
        var f = rows[i].fecha;
        if (type == 'input') {
          data[f.toISOString()] = {
            'sensor': rows[i].humedad,
            'freq': rows[i].frecuencia
          }
        } else if (type == 'output') {
          data[f.toISOString()] = {
            'status': rows[i].status,
            'text': rows[i].texto
          }
        }
      }

      //Format the response data
      obj['data'] = data;

      console.log(obj);
      res.send(obj);
      var keys = Object.keys(data);
      var values = Object.values(data);
      var data_array = [];
      /**
       * Create SQL friendly data objects
       */
      for (let i = 0; i < keys.length; i++) {
        let d1 = keys[i].substring(0, keys[i].length - 1);
        data_array[i] = [obj.id, obj.url, obj.date, obj.search.id_hardware, obj.search.type, d1, values[i].sensor, values[i].status, values[i].freq, values[i].text];
      }
      /**
       * Insert the data responses into the SQL database
       */
      let q = 'INSERT INTO search_response(id,url,fecha_req,id_hard,type,fecha_res,sensor,status,freq,texto) VALUES ?';
      //let v = '(\''+obj2.id+'\',\''+obj2.url+'\',\''+obj2.date+'\',\''+obj2.search.id_hardware+'\',\''+obj2.search.type+'\',\''+'2019-10-31T08:00:54.000'+'\',\''+100+'\',\''+true+'\',\''+1000+'\',\''+'ok'+'\')';
      connection.query(q, [data_array]);
    });
    //    connection.query('SELECT * FROM search_response', function(err, rows, fields){
  } else {
    let qStmt = 'INSERT INTO `search_req`(`id`, `url`, `date`, `id_hardware`, `start_date`, `finish_date`)';
    let vStmt = ' VALUES (\'' +
      id_req + '\',\'' + req.ip + '\',\'' + datetime + '\',\'' + hard + '\',\'' + s1 + '\',\'' + s2 + '\')';

    connection.query(qStmt + vStmt);
    var r = {
      'error': 'error reading body',
      'req': req.body
    }
    res.send(r)
  }
});

app.post('/change', function (req, res) {

  let now = getDate()
  var sensor
  try {
    sensor = Object.keys(req.body.change)[0]
  } catch{
    console.log('sensor not found')
  }


  let status, freq = 0, text, id, fecha
  try {
    id = req.body.id
    status = req.body.change[sensor].status
    freq = req.body.change[sensor].freq
    text = req.body.change[sensor].text
    fecha = req.body.date
  } catch{
    fecha = getDate()
  }
  if (req.body.hasOwnProperty('id') &&
    req.body.hasOwnProperty('url') &&
    req.body.hasOwnProperty('date') &&
    req.body.hasOwnProperty('change')) {

    var s2 = fecha.substring(0, fecha.length - 1);
    let qStmt = 'INSERT INTO `change_req`(`id`, `url`, `date`, `id_hardware`, `status`,`freq`,`text`)';
    let vStmt = ' VALUES (\'' +
      req.body.id + '\',\'' +
      req.body.url + '\',\'' +
      s2 + '\',\'' +
      Object.keys(req.body.change)[0] + '\',\'' +
      status + '\',\'' +
      freq + '\',\'' +
      text + '\')';

    connection.query(qStmt + vStmt);
    const Http = new XMLHttpRequest();
    const url = 'http://' + iphardware;
    //agregar a la base de datos 
    if (req.body.change.id01) {
      //aqui odo lo que le mande al id01: el sensor de temperatura, humedad
      var status01 = req.body.change.id01.status;
      var freq01 = req.body.change.freq;
      var text01 = req.body.change.text;
      //texto solo lo leo para guardarlo en la base de datos, el sensor no se va a apagar nunca
      //entonces el status no lo voy a modificar, lo que modificare es la frecuencia de toma de datos

      //buscar como mandar al nodemcu por http

    }
    //esto es el led rgb que solo va a tener encendido y apagado por el momento luego agrego lo de la temperatura
    //y la sintensidades de pwm para cada color dependiendo de la temperatura
    if (req.body.change.id02) {
      var status02 = req.body.change.id02.status;
      var freq02 = req.body.change.freq;
      var text02 = req.body.change.text;
      var estado;
      console.log(status02);
      if (status02 == false) {
        console.log("hola");
      }


    }

    var sensor_response = 'OK'
    var date = new Date().toISOString()
    let s3 = date.substring(0, date.length - 1);
    var r = {
      'id': idPlataforma,
      'url': ipPlataforma,
      'date': date,
      'status': sensor_response
    }
    res.send(r);
    qStmt = 'INSERT INTO `change_response`(`id`, `url`, `date`, `status`)';
    vStmt = ' VALUES (\'' + idPlataforma + '\',\'' +
      ipPlataforma + '\',\'' +
      s3 + '\',\'' +
      sensor_response + '\')';

    console.log(vStmt);
    connection.query(qStmt + vStmt);
  }
  else {
    let qStmt = 'INSERT INTO `change_req`(`id`, `url`, `date`, `id_hardware`, `status`,`freq`,`text`)';
    let vStmt = ' VALUES (\'' +
      id + '\',\'' +
      req.ip + '\',\'' +
      fecha + '\',\'' +
      sensor + '\',\'' +
      status + '\',\'' +
      freq + '\',\'' +
      text + '\')';
    var err = {
      'error': 'error reading request',
      'req': req.body
    }
    connection.query(qStmt + vStmt);
    res.send(err)
  }

});

//app.get('/',function(req,res){
//res.send("hola,si funciona es arduino el que esta mal");
//});

app.post('/create', cors(), function (req, res) {

  var id
  var ifRightSensor = 0, ifRightStatus, ifRightFreq = 0, ifRightText;
  var ifThenStatus, ifThenFreq = 0, ifThenText;
  var ifElseStatus, ifElseFreq = 0, ifElseText;
  var date, s
  try {
    id = req.body.id
    date = req.body.date;
    s = date.substring(0, date.length - 1);
    ifRightSensor = req.body.create.if.right.sensor
    ifRightFreq = req.body.create.if.right.freq
    ifRightStatus = req.body.create.if.right.status
    ifRightText = req.body.create.if.right.text
    ifThenStatus = req.body.create.then.status
    ifThenFreq = req.body.create.then.freq
    ifThenText = req.body.create.then.text
    ifElseStatus = req.body.create.else.status
    ifElseFreq = req.body.create.else.freq
    ifElseText = req.body.create.else.text
  } catch{
    date = new Date().toISOString();
    s = date.substring(0, date.length - 1);
    ifRightStatus = false
    ifThenStatus = false
    ifElseStatus = false
  }

  if (req.body.hasOwnProperty('id') &&
    req.body.hasOwnProperty('url') &&
    req.body.hasOwnProperty('date') &&
    req.body.hasOwnProperty('create')) {
    console.log(req.body);

    /**
     * Save the received request
     */
    let qStmt = 'INSERT INTO `create_req`(`id_fe`, `url`, `date`, `if_l_url`, `if_l_id`, `if_l_freq`, `if_cond`, `if_r_sensor`, `if_r_stat`, `if_r_freq`, `if_r_text`, `then_url`, `then_id`, `then_status`, `then_freq`, `then_text`, `else_url`, `else_id`, `else_status`, `else_freq`, `else_text`) ';
    let vStmt;
    if (req.body.create.if.right.sensor > 0) {
      vStmt = ' VALUES (\'' + id + '\',\'' +
        req.body.url + '\',\'' +
        s + '\',\'' +
        req.body.create.if.left.url + '\',\'' +
        req.body.create.if.left.id + '\',' +
        req.body.create.if.left.freq + ',\'' +
        req.body.create.if.condition + '\',' +
        ifRightSensor + ',' +
        ifRightStatus + ',' +
        ifRightFreq + ',\'' +
        ifRightText + '\',\'' +
        req.body.create.then.url + '\',\'' +
        req.body.create.then.id + '\',' +
        ifThenStatus + ',' +
        ifThenFreq + ',\'' +
        ifThenText + '\',\'' +
        req.body.create.else.url + '\',\'' +
        req.body.create.else.id + '\',' +
        ifElseStatus + ',' +
        ifElseFreq + ',\'' +
        ifElseText + '\')';

    }

    console.log(qStmt);
    console.log(vStmt);
    // Save the request
    connection.query(qStmt + vStmt);


    /**
     * TODO connect to the hardware and create the event
     */
    var x = function () {
      return obj = {
        'id': 'plataforma1',
        'url': '21.1.4.1',
        'date': '1989-12-20T07:35:12.457Z',
        'status': 'ok',
        'idEvent': 'EV001'
      };

    };

    let id_res = 'plataforma1';
    let url_res = '21.1.4.1';
    let date_res = '1989-12-20T07:35:12.457Z';
    let status_res = 'ok';
    let idEvent_res = 'EV001';

    /**
     * Get the response values and save
     */
    let s2 = date_res.substring(0, date_res.length - 1);
    qStmt = 'INSERT INTO `create_response`(`id`, `url`, `date`, `status`, `idEvent`)';
    vStmt = ' VALUES (\'' + id_res + '\',\'' +
      url_res + '\',\'' +
      s2 + '\',\'' +
      status_res + '\',\'' +
      idEvent_res + '\')';

    console.log(vStmt);
    connection.query(qStmt + vStmt);
    //SEND back the response
    res.send(x());
  } else {
    var r = {
      'error': 'error reading request',
      'req': req.body
    }
    let qStmt = 'INSERT INTO `create_req`(`id_fe`, `url`, `date`, `if_l_url`, `if_l_id`, `if_l_freq`, `if_cond`, `if_r_sensor`, `if_r_stat`, `if_r_freq`, `if_r_text`, `then_url`, `then_id`, `then_status`, `then_freq`, `then_text`, `else_url`, `else_id`, `else_status`, `else_freq`, `else_text`) ';
    let vStmt;
    vStmt = ' VALUES (\'' + id + '\',\'' +
      req.ip + '\',\'' +
      getDate() + '\',\'' +
      '' + '\',\'' +
      '' + '\',\'' +
      0 + '\',\'' +
      '' + '\',' +
      ifRightSensor + ',' +
      ifRightStatus + ',' +
      ifRightFreq + ',\'' +
      ifRightText + '\',\'' +
      '' + '\',\'' +
      '' + '\',' +
      ifThenStatus + ',' +
      ifThenFreq + ',\'' +
      ifThenText + '\',\'' +
      '' + '\',\'' +
      '' + '\',' +
      ifElseStatus + ',' +
      ifElseFreq + ',\'' +
      ifElseText + '\')';



    console.log(qStmt);
    console.log(vStmt);
    // Save the request
    connection.query(qStmt + vStmt);
    var r = {
      'error':'error reading body',
      'req':req.body
    }
    res.send(r);
  }
});

app.post('/update', cors(), function (req, res) {
  var id, idEvento
  var ifRightSensor = 0, ifRightStatus, ifRightFreq = 0, ifRightText;
  var ifThenStatus, ifThenFreq = 0, ifThenText;
  var ifElseStatus, ifElseFreq = 0, ifElseText;
  var date, s
  try {
    id = req.body.id
    date = req.body.date;
    s = date.substring(0, date.length - 1);
    idEvento = req.body.update.if.id
    ifRightSensor = req.body.update.if.right.sensor
    ifRightFreq = req.body.update.if.right.freq
    ifRightStatus = req.body.update.if.right.status
    ifRightText = req.body.update.if.right.text
    ifThenStatus = req.body.update.then.status
    ifThenFreq = req.body.update.then.freq
    ifThenText = req.body.update.then.text
    ifElseStatus = req.body.update.else.status
    ifElseFreq = req.body.update.else.freq
    ifElseText = req.body.update.else.text
  } catch{
    date = new Date().toISOString();
    s = date.substring(0, date.length - 1);
    ifRightStatus = false
    ifThenStatus = false
    ifElseStatus = false
  }
  if (req.body.hasOwnProperty('id') &&
  req.body.hasOwnProperty('url') &&
  req.body.hasOwnProperty('date') &&
  req.body.hasOwnProperty('update')) {
  console.log(req.body);

  /**
   * Save the received request
   */
  let qStmt = 'INSERT INTO `update_req`(`id_fe`, `url`, `date`,`id_evento`, `if_l_url`, `if_l_id`, `if_l_freq`, `if_cond`, `if_r_sensor`, `if_r_stat`, `if_r_freq`, `if_r_text`, `then_url`, `then_id`, `then_status`, `then_freq`, `then_text`, `else_url`, `else_id`, `else_status`, `else_freq`, `else_text`) ';
  let vStmt;
  if (req.body.update.if.right.sensor > 0) {
    vStmt = ' VALUES (\'' + id + '\',\'' +
      req.body.url + '\',\'' +
      s + '\',\'' +
      idEvento+'\',\'' +
      req.body.update.if.left.url + '\',\'' +
      req.body.update.if.left.id + '\',' +
      req.body.update.if.left.freq + ',\'' +
      req.body.update.if.condition + '\',' +
      ifRightSensor + ',' +
      ifRightStatus + ',' +
      ifRightFreq + ',\'' +
      ifRightText + '\',\'' +
      req.body.update.then.url + '\',\'' +
      req.body.update.then.id + '\',' +
      ifThenStatus + ',' +
      ifThenFreq + ',\'' +
      ifThenText + '\',\'' +
      req.body.update.else.url + '\',\'' +
      req.body.update.else.id + '\',' +
      ifElseStatus + ',' +
      ifElseFreq + ',\'' +
      ifElseText + '\')';

  }

  console.log(qStmt);
  console.log(vStmt);
  // Save the request
  connection.query(qStmt + vStmt);

  //TODO Check only the updated fields

  var x = function () {
    return obj = {
      'id': 'plataforma1',
      'url': '21.1.4.1',
      'date': '1989-12-20T07:35:12.457Z',
      'status': 'ok'
    };

  };

  let id_res = 'plataforma1';
  let url_res = '21.1.4.1';
  let date_res = '1989-12-20T07:35:12.457Z';
  let status_res = 'ok';

  /**
   * Get the response values and save
   */
  let s2 = date_res.substring(0, date_res.length - 1);
  qStmt = 'INSERT INTO `update_response`(`id`, `url`, `date`, `status`)';
  vStmt = ' VALUES (\'' + id_res + '\',\'' +
    url_res + '\',\'' +
    s2 + '\',\'' +
    status_res + '\')';

  console.log(vStmt);
  connection.query(qStmt + vStmt);
  //SEND back the response
  res.send(x());
} else {
  var r = {
    'error': 'error reading request',
    'req': req.body
  }
  let qStmt = 'INSERT INTO `update_req`(`id_fe`, `url`, `date`,`id_evento`, `if_l_url`, `if_l_id`, `if_l_freq`, `if_cond`, `if_r_sensor`, `if_r_stat`, `if_r_freq`, `if_r_text`, `then_url`, `then_id`, `then_status`, `then_freq`, `then_text`, `else_url`, `else_id`, `else_status`, `else_freq`, `else_text`) ';
  let vStmt;
  vStmt = ' VALUES (\'' + id + '\',\'' +
    req.ip + '\',\'' +
    getDate() + '\',\'' +
    idEvento + '\',\'' +
    '' + '\',\'' +
    '' + '\',\'' +
    0 + '\',\'' +
    '' + '\',' +
    ifRightSensor + ',' +
    ifRightStatus + ',' +
    ifRightFreq + ',\'' +
    ifRightText + '\',\'' +
    '' + '\',\'' +
    '' + '\',' +
    ifThenStatus + ',' +
    ifThenFreq + ',\'' +
    ifThenText + '\',\'' +
    '' + '\',\'' +
    '' + '\',' +
    ifElseStatus + ',' +
    ifElseFreq + ',\'' +
    ifElseText + '\')';



  console.log(qStmt);
  console.log(vStmt);
  // Save the request
  connection.query(qStmt + vStmt);
  var r = {
    'error':'error reading body',
    'req':req.body
  }
  res.send(r);
}

});

app.post('/delete', function (req, res) {
  let event = new Date();
  var fecha = event.toJSON();
  var s2 = fecha.substring(0, fecha.length - 1);
  var keys = Object.keys(req.body);

  var id,url,id_evento,date,s1

  try{
    id=req.body.id
    url = req.body.url
    date = req.body.date
    id_evento = req.body.delete.id
  }catch{
    url = req.ip
    date = new Date().toISOString()
  }
  s1 = date.substring(0, date.length - 1);

  if (req.body.hasOwnProperty('id') &&
    req.body.hasOwnProperty('url') &&
    req.body.hasOwnProperty('date') && 
    req.body.hasOwnProperty('delete')){
      console.log(date)
      let qStmt = "INSERT INTO `delete_req`(`id`, `url`, `date`,`id_evento`)";
      let vStmt = ' VALUES (\''+id+'\',\'' +
        url + '\',\'' +
        s1 + '\',\'' +
        id_evento + '\')';
      connection.query(qStmt + vStmt);


      //TODO delete the event from the database


      var delete_response = 'OK'
      var response_date = new Date().toISOString();
      var s3 = response_date.substring(0,response_date.length-1)
      var obj = {
        'id':idPlataforma,
        'url':ipPlataforma,
        'date':response_date,
        'status': delete_response
      } 
      res.send(obj);
      console.log(s3)
      qStmt = "INSERT INTO `delete_response`(`id`, `url`, `date`,`status`)";
      vStmt = ' VALUES (\''+ipPlataforma+'\',\'' +
        url + '\',\'' +
        s3 + '\',\'' +
        delete_response + '\')';
      connection.query(qStmt + vStmt);

    }else{
      let qStmt = "INSERT INTO `delete_req`(`id`, `url`, `date`,`id_evento`)";
      let vStmt = ' VALUES (\''+id+'\',\'' +
        url + '\',\'' +
        s1 + '\',\'' +
        id_evento + '\')';
      connection.query(qStmt + vStmt);
      var r = {
        'error': 'error reading body',
        'req': req.body
      }
      res.send(r)
    }
  });
app.listen(3000, function () {
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (ifname == 'Wi-Fi') {
        ipPlataforma = iface.address
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
  console.log('IoT server listening on port 3000!');
  console.log(ipPlataforma)
});
function getDate() {
  let now = new Date();
  var fecha_formato = now.toJSON();
  //"2017-09-15T12:30:28.757Z"
  var fechamsq = fecha_formato.substring(0, 10);
  var horamsq = fecha_formato.substring(11, 19);
  return fechamsq + " " + horamsq;
}
