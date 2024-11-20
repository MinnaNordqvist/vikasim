import net from 'node:net';

var server = net.createServer();

server.on('close',function(){
    console.log('Server closed !');
});

server.on('connection',function(socket){
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port ' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);

    var lport = socket.localPort;
    var laddr = socket.localAddress;
    console.log('Server is listening at LOCAL port ' + lport);
    console.log('Server LOCAL ip :' + laddr);

    var rport = socket.remotePort;
    var raddr = socket.remoteAddress;
    var rfamily = socket.remoteFamily;
  
    console.log('REMOTE Socket is listening at port ' + rport);
    console.log('REMOTE Socket ip :' + raddr);
    console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);

    server.getConnections(function(error,count){
        console.log('Number of concurrent connections to the server : ' + count);
    });
    
    socket.setEncoding('utf8');

    socket.setTimeout(800000,function(){
        console.log('Socket timed out');
    }); 

    socket.on('data',function(data){
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Data sent to server : ' + data);
      
        //echo data
        var is_kernel_buffer_full = socket.write('Data ::' + data);
        if(is_kernel_buffer_full){
          console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
        }else{
          socket.pause();
        }
      
    });

    socket.on('drain',function(){
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });
      
    socket.on('error',function(error){
        console.log('Error : ' + error);
    });
      
    socket.on('timeout',function(){
        console.log('Socket timed out !');
        socket.end('Timed out!');
    
    });
      
    socket.on('end',function(data){
        console.log('Socket ended from other end!');
        console.log('End data : ' + data);
    });

    socket.on('close',function(error){
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Socket closed!');
        if(error){
          console.log('Socket was closed coz of transmission error');
        }
    }); 
      
      setTimeout(function(){
        var isdestroyed = socket.destroyed;
        console.log('Socket destroyed:' + isdestroyed);
        socket.destroy();
      },1200000);
      
});
      
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen("PORT", "HOST");
      }, 1000);
    }
});

server.on('listening',function(){
    console.log('Server is listening!');
  });
  
server.maxConnections = 10;
  
//static port allocation
server.listen(2222);

var islistening = server.listening;

if(islistening){
  console.log('Server is listening');
}else{
  console.log('Server is not listening');
}

setTimeout(function(){
  server.close();
},5000000);


var client  = new net.Socket();
client.connect({
  port:2222
});

client.on('connect',function(){
    console.log('Client: connection established with server');
    var address = client.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Client is listening at port' + port);
    console.log('Client ip :' + ipaddr);
    console.log('Client is IP4/IP6 : ' + family);

    client.write('hello from client');

});

client.setEncoding('utf8');

client.on('data',function(data){
  console.log('Data from server:' + data);
});

setTimeout(function(){
    client.end('Bye bye server');
  },5000);

