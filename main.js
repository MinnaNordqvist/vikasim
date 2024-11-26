import fs from 'node:fs';
import net from 'node:net';
import { locationLostRMC } from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { modifyRPM } from './hooks/RPM.js';
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

   //Tänne laitetaan mitä tehdään sitten kun ei lueta dataa tiedostosta
   socket.on('data', (data) =>{
        //socket.write(data);
     
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
var client  = net.connect({port: server.address().port, host:''}, function(){
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
    let res="";
    let message = "";
    for (const chunk of data){
        res += chunk;
    }
    message = res.split("\r\n").filter(a => !!a).map(b => locationLostRMC(b)).join("\r\n");
    client.write(message);
    
});      

console.log("Hello world!");




