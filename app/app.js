var IP = "127.0.0.1";

var PORT = 3000; 

var http = require('http'),

	fs = require('fs'),

	index = fs.readFileSync(__dirname + '/index.html');

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

var osc = require('node-osc');

var oscServer = new osc.Server(PORT, IP);

oscServer.on("message", function (msg) {
	io.sockets.send(msg);
});

app.listen(PORT);

console.log ("Servidor corriendo en: HTTP://" + IP + ":" + PORT);
