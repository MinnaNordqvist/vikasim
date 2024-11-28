import fs from 'node:fs';
import net from 'node:net';
import 'dotenv/config'
import config from './config.js';

import { locationLostRMC } from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { modifyRPM } from './hooks/RPM.js';
import { modifyVHW } from './hooks/VHW.js';

//Tähän määritellään Stormwindin ja Clientin (=plotteri) portit ja IP:t
const serverPort = config.ServerPort;
const ServerAddress = config.ServerAddress;
const localP = config.StormWindLocalPort;
const localAddr = config.StormWindLocalAddr;
const clientPort = config.ClientLocalPort;
const clientAddr = config.ClientLocalAddr;
console.log("Serveri kuuntelee porttia: " + serverPort + " ja sen osoite on: " + ServerAddress);
console.log("Stormwind Portista: " + localP + " ja osoitteesta: " + localAddr);
console.log("Plotteri portista: " + clientPort + " ja osoitteesta: " + clientAddr); 


let server, istream = fs.createReadStream("./data/data.txt");
//Luodaan serveri joka lukee tiedostosta "Stormwind dataa"
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

//Luodaan serveri joka lukee dataa Stormwindista:
// let server = net.createServer();

server.on('close',function(){
    console.log('Server closed !');
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
    console.log('Server LOCAL port ' + lport);
    console.log('Server LOCAL ip ' + laddr);
    socket.setEncoding('utf8');

   //Tänne laitetaan mitä tehdään sitten kun ei lueta dataa tiedostosta
   socket.on('data', (data) =>{
        //socket.write(data);
        
       // socket.on('end', socket.end);
    });
});

server.on('error', (err) => {
    throw err;
});

//Dynaaminen portin valinta
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
    //Jos pitää testata, saako client dataa serveriltä:
   // console.log(data);
    
    let res="";
    let message = "";
    for (const chunk of data){
        res += chunk;
    }
    message = res.split("\r\n").filter(a => !!a).map(b => locationLostRMC(b)).join("\r\n");
    client.write(message);
    
    //Jos client ei lähetä dataa, lukeminen laitetaan tauolle
    if(!client.write(message)){
        client.pause();
    }

    client.on('drain', () =>{
        client.resume();
    })

    client.on('end', client.end);
});

      

console.log("Hello world!");




