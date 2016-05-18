var http = require('http');
    var url = require('url');
    var fs = require('fs');
    var io = require('socket.io');

    //Create server with http library
    var server = http.createServer(function(request, response){
    	var path = url.parse(request.url).pathname;

    	//Response based upon 'path' value
    	switch(path){
    		case '/':
    		    response.writeHead(200, {'Content-Type': 'text/html'});
    		    response.write('Hellow World');
    		    response.end();
    		    break;
    		case '/socket.html':
    		    fs.readFile(__dirname + path, function(error, data){
    		    	if (error){
    		    		response.writeHead(404);
    		    		response.write("Page Not Found");
    		    		response.end();
    		    	}
    		    	else{
    		    		response.writeHead(200, {"Content-Type": "text/html"});
    		    		response.write(data, "utf8");
    		    		response.end();
    		    	}
    		    });
    		    break;
    		default:
    		    response.writeHead(404);
    		    response.write("Page Not Found");
    		    response.end();
    	}

     var listener = io.listen(server);
     listener.sockets.on('connection', function(socket){
     	socket.emit('message', {'message': 'hello world'});
     });

     listener.sockets.on('connection', function(socket){
	  	//send data to client/ time
	  	setInterval(function(){
	  		socket.emit('date', {'date': new Date()});
	  	}, 1000);

	  	//receive client data and print to command line
     	socket.on('client_data', function(data){
     		process.stdout.write(data.letter);
     	});
	  });


    });

	//Server started on port 8080
    server.listen(8080);
    //Socket.IO listen to server on port 8080
    io.listen(server);