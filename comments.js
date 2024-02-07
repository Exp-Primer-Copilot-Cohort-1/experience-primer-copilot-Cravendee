//Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.wav': 'audio/wav'
};

var server = http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), uri);
	console.log('Loading ' + uri);
	var stats;

	try {
		stats = fs.lstatSync(filename);
	} catch(e) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return;
	}

	if (stats.isFile()) {
		var mimeType = mimeTypes[path.extname(filename)];
		res.writeHead(200, {'Content-Type': mimeType});

		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	} else if (stats.isDirectory()) {
		res.writeHead(302, {'Location': 'index.html'});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('500 Internal server error\n');
		res.end();
	}
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
	socket.emit('message', {message: 'Welcome to the chat room!'});
	socket.on('send', function(data){
		io.sockets.emit('message', data);
		comments.addComment(data.message);
	});
});

server.listen(8000);
console.log('Server running at http://localhost:8000/');