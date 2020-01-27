var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// code block for http request from socket.io to django
const bodyParser = require("body-parser");

//funcion auxiliar que permite acceder a la data cruda mediante bodyparser
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

//bloque de codigo que permite manejar los GET request
app.get('/', function(req, res) {
   res.sendFile( __dirname+'/index.html');
});

//bloque de codigo que permite manejar los POST request
app.post('/',function (request,response){

	let objs = JSON.parse(request.rawBody);
	response.send('POST request to the URL succesfull---> \n');
	console.log("\nPOST request succesfull");

	io.sockets.emit('post_received',objs);

});
 