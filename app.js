var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var clients = 0;

io.on('connection', function(socket){
  console.log('A user connected');

  	 clients++;
     socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
     socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
  //Send a message after a timeout of 4seconds
  setTimeout(function(){
    socket.send('Sent a message 4 seconds after connection!');
  }, 4000);


  setTimeout(function(){
    socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
	}, 8000);

  socket.on('clientEvent', function(data){
	   socket.send('Client event feedback!');
  });


  var nsp = io.of('/my-namespace');
  nsp.on('connection', function(socket){
    console.log('someone connected');
    nsp.emit('hi', 'Hello everyone!');
  });


  socket.on('disconnect', function () {
    clients--;
    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
