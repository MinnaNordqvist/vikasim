import fs from 'node:fs';
import net from 'node:net';

import dpt from "./hooks/DPT.js"
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import { modifyRPM } from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { locationLostRMC } from './hooks/RMC.js';
import { moveShip } from './hooks/RMC.js';
import rot from './hooks/ROT.js'
import rsa from './hooks/RSA.js';
import vhw from './hooks/VHW.js';
import { modifyVHW } from './hooks/VHW.js';


let server, istream = fs.createReadStream("./data/data.txt");
//Luodaan serveri
server = net.createServer((socket) => {
    socket.pipe(process.stdout);
    istream.on("readable", function () {
        let data;
        while (data = this.read()) {
            socket.write(data);
        }
    })
    istream.on("end", function(){
        console.log("End of server data");
        socket.end();
    }) 
});

server.on('error', (err) => {
    throw err;
});

server.on('connection', (socket) =>{
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening to port ' + port);
    console.log('Server ip ' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
    var lport = socket.localPort;
    var laddr = socket.localAddress;
    console.log('Server is listening to LOCAL port ' + lport);
    console.log('Server LOCAL ip ' + laddr);
    socket.setEncoding('utf8');

   socket.on('data', (data) =>{
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Data sent to server : ' + data);
        
    });
});

server.listen(() => {
    var address = server.address();
    console.log("opened server on %j", address);
});

server.getConnections((error,count) =>{
    console.log('Number of connections: ' + count);
});

//Luodaan client joka lähettää muokatut arvot eteenpäin.
var client  = net.connect({port: server.address().port, host:"", }, function(){
    console.log('Client: connection established with server');
    var address = client.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Client port ' + port);
    console.log('Client ip ' + ipaddr);
    console.log('Client is IP4/IP6 : ' + family);
   
});
client.setEncoding('utf8');


client.on('data', (data) =>{
    console.log("Got this much data: " + data.length);
    console.log(client.bytesRead);
    let res="";
    let message = "";
     
    for (const chunk of data){
        res += chunk;
    }
    message = res.split("\r\n").filter(a => !!a).map(b => moveShip(b, "N")).join("\r\n");
   // console.log(message);
    var is_kernel_buffer_full = client.write(message);
    if(!is_kernel_buffer_full){
        console.log("Client says wait");
        client.pause();
    }
    
    client.on('drain',function(){
       client.resume();
    });

    client.on('end', (data) => {
        console.log("No more data from Client " + client.bytesWritten);
    });
});      



console.log("Hello world!");









