import fs from 'node:fs';
import net from 'node:net';
import 'dotenv/config'
import config from './config.js';

import { locationLostRMC } from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { moveShip } from './hooks/RMC.js';
import { modifyRPM } from './hooks/RPM.js';
import { modifyVHW } from './hooks/VHW.js';

//Tähän määritellään Stormwindin ja Clientin (=plotteri) portit ja IP:t
const serverPort = config.ServerPort;
const ServerAddress = config.ServerAddress;
const ServerHost = config.ServerHost;
const localP = config.StormWindLocalPort;
const localAddr = config.StormWindLocalAddr;
const clientPort = config.ClientLocalPort;
const clientAddr = config.ClientLocalAddr;
console.log("Serverin portti: " + serverPort + " ja sen osoite on: " + ServerAddress + " ja sen host on: " + ServerHost);
console.log("Stormwind Portista: " + localP + " ja osoitteesta: " + localAddr);
console.log("Plotteri portista: " + clientPort + " ja osoitteesta: " + clientAddr); 


//let server, istream = fs.createReadStream("./data/data.txt");
//Luodaan serveri joka lukee tiedostosta "Stormwind dataa"
//server = net.createServer((socket) => {
//    socket.pipe(process.stdout);
//    istream.on("readable", function () {
//        let data;
//        while (data = this.read()) {
//            socket.write(data);
//        }
//    })
//    istream.on("end", function(){
//        socket.end();
//    }) 
//});

//Luodaan serveri joka lukee dataa Stormwindista:
let server = net.createServer();

server.on('close',function(){
    console.log('Server closed !');
});

server.on('connection', (socket) =>{
    socket.setEncoding('utf8');
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is IP4/IP6 : ' + family);
    console.log('Server is listening to port ' + port);
    console.log("Server host: " + ServerHost);
    //Näiden pitäisi olla samat:
    console.log('Server ip ' + ipaddr + " and " + ServerAddress);
    
    var socketaddr = socket.address();
    var ip = socketaddr.address;
    var sport = socketaddr.port;
    //Näiden pitäisi olla samat:
    console.log('Socket port ' + sport + " and " + localP);
    console.log('Socket ip ' + ip + " and " + localAddr);
   

   //Tänne laitetaan mitä tehdään sitten kun ei lueta dataa tiedostosta
   socket.on('data', (data) =>{
    let res="";
    let message = "";
    for (const chunk of data){
        res += chunk;
    }
    message = res.split("\r\n").filter(a => !!a).map(b => locationLostRMC(b)).join("\r\n");
    socket.write(message);
    
    //Jos Stormwind ei lähetä dataa, lukeminen laitetaan tauolle
    if(!socket.write(message)){
        socket.pause();
    }

    socket.on('drain', () =>{
        socket.resume();
    })   
    
    socket.on('end', socket.end);
    });
});

server.on('error', (err) => {
    throw err;
});

//Staattinen portin valinta. Kuunnellaan Stormwindin porttia
server.listen({port: localP, host: ServerAddress},() => {
    var address = server.address();
    console.log("opened server on %j", address);
});

server.getConnections((error,count) =>{
    console.log('Number of connections: ' + count);
});

//Luodaan client joka lähettää muokatut arvot eteenpäin.
var client  = net.connect({port: localP, host: ServerHost}, function(){
    console.log('Client: connection established with server');
    var address = client.address();
    var ip = address.address; 
    var family = address.family; 
    var port = address.port;
    console.log('Client is IP4/IP6 : ' + family);
    //Näiden pitäisi antaa samat arvot
    console.log('Client port ' + clientPort + " and: " + port);
    console.log('Client ip ' + clientAddr + " and: " + ip);
});


client.setEncoding('utf8');
client.on('data', (data) =>{
    //Jos pitää testata, saako client dataa serveriltä:
   // console.log(data);
    
    client.write(data);

    client.on('end', client.end);
});

      

console.log("Hello world!");




