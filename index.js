var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


/// code block for http request from socket.io to django



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
	//console.log(JSON.parse(request.rawBody));
	//console.log(objs.name);

	//{post_body:objs.name,post_name:objs.action}
	io.sockets.emit('post_received',objs);


	//code block for http request to django backend
	let http2 = require('http')

	let data = JSON.stringify(request.rawBody)
	console.log(data)
	let options = {
	  hostname: '127.0.0.1',
	  port: 8000,
	  path: '/handler/receiver/',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': data.length
	  }
	}

	let req = http2.request(options, (res) => {
	  console.log(`statusCode: ${res.statusCode}`)

	  res.on('data', (d) => {
	    process.stdout.write(d)
	  })
	})

	req.on('error', (error) => {
	  console.error(error)
	})

	req.write(data)
	req.end()
	//console.log(data);
	/*
	connect.then(db =>{
		 console.log("connected correctly to the server");
		 let post_value = new TestSchema({message: objs.message,sender:objs.name});
		 
		 post_text.save();
	}
	*/

});
//database connection 
const TestSchema = require("./models/FirstSchema.js");
const connect = require("./dbconnection.js");

//setup event listener
// for chat app
io.on("connection",socket => {
	console.log("user connected");

	socket.on("disconnect",function(){
		console.log("user disconnected");
	});

	socket.on("chat message", function(msg){
		console.log("message: " + msg);
		//broadcast message to everyone in port:5000 except yourself
		socket.broadcast.emit("received",{message: msg });

		//save chat to the database
		connect.then(db => {
			console.log("connected correctly to the server");
			let chatMessage = new TestSchema({message:msg,sender:"anonymous"});
			chatMessage.save();

		});
	});
})

/*
var roomno1 = 1,roomno2=2,roomno3=3;
var roomno=1;

io.on('connection', function(socket) {
   
   socket.join("room2");
   io.sockets.in("room2").emit('connectToRoom2',"Sending to room 2: con variable room2");
   socket.leave("rooom2");

   socket.join("room3");
   io.sockets.in("room3").emit('connectToRoom3',"Sending to room 3: con variable room3");
   socket.leave("rooom3");

   socket.join("room4");
   io.sockets.in("room4").emit('connectToRoom4',"Sending to room 4: con variable room4");
   socket.leave("rooom4");

   //Increase roomno 2 clients are present in a room.
   //if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   //socket.join("room-"+roomno);

   //Send this event to everyone in the room.
   //io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);

	//socket.join("room-"+roomno);
	//socket.leave("room-"+roomno);
})
*/

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
 