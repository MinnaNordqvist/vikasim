import net from 'node:net';

import 'dotenv/config'
import config from './config.js';

const serverPort = config.ServerPort;
const serverAddress = config.ServerAddress;
const serverHost = config.ServerHost;
const localP = config.StormWindLocalPort;
const localAddr = config.StormWindLocalAddr;
const clientPort = config.ClientLocalPort;
const clientAddr = config.ClientLocalAddr;


//Luodaan serveri joka lukee dataa Stormwindista:
let server = net.createServer();
export default server;

server.on('close',function(){
    console.log('Server closed !');
});

//Luodaan socket, joka parsii viestejä ja manipuloi niitä. Socket = Höynäyttäjä
server.on('connection', (socket) =>{
    socket.setEncoding('utf8');
    var saddress = server.address();
    var servport = saddress.port;
    var sipaddr = saddress.address;
    console.log("Server host: " + serverHost);
    //Näiden pitäisi olla samat:
    console.log('Server ip ' + sipaddr + " and " + serverAddress);
    console.log('Server port ' + servport + " and " + serverPort); 
    
    var socketaddr = socket.address();
    var ip = socketaddr.address;
    var sport = socketaddr.port;
    //Näiden pitäisi olla samat:
    console.log('Socket port ' + sport + " and " + localP);
    console.log('Socket ip ' + ip + " and " + localAddr);
    //Tämä otetaan pois kun on oikeaa datavirtaa luettavana:
    socket.write("$GPRMC,121940.58,A,6000.071651,N,02438.162693,E,0.6,185.2,281024,,,A*5F");
    //console.log("$GPRMC,121940.58,A,6000.071651,N,02438.162693,E,0.6,185.2,281024,,,A*5F");

    socket.on('error', function(ex) {
        console.log("Socket error:");
        console.log(ex);
    });

    //Höynäyttäjä lukee ja manipuloi Stormwind dataa
    socket.on('data', (data) =>{
      console.log(data)
      
    //Jos Stormwind ei lähetä dataa, lukeminen laitetaan tauolle
      if(!socket.write(data)){
        socket.pause();
      }
    
      socket.on('drain', () =>{
        socket.resume();
      })   
        
      socket.on('end', socket.end);
    });
});    

//Staattinen portin valinta. Kuunnellaan Stormwindin porttia
server.listen({port: localP, host: serverAddress},() => {
    var address = server.address();
    console.log("opened server on %j", address);
});

server.getConnections((error,count) =>{
    console.log('Number of connections: ' + count);
});

//Tämä on net-kirjaston yleisimpiä erroreita.
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen("PORT", "HOST");
      }, 1000);
    }
});

server.on('error', (error) => {
    throw error;
});

export const socket  = new net.Socket();


//Luodaan client joka lähettää muokatut arvot eteenpäin.
export const client  = net.createConnection({port: localP }, () => {
    console.log("Client connected to server!");
    var caddress = client.address();
    var cport = caddress.port;
    var cipaddr = caddress.address;
    //Näiden pitäisi antaa samat arvot
    console.log('Client port ' + cport + " and " + clientPort);
    console.log('Client ip ' + cipaddr + " and " + clientAddr);
    //client.write("$GPRMC,121842.66,A,6000.416990,N,02438.184823,E,40.9,170.3,281024,,,A*6B"); 
    
});

client.setEncoding('utf8');

client.on('error', function(ex) {
  console.log("Client error:");
  console.log(ex);
});


//Huom! Clientin ei ole tarkoitus muokata/kirjoittaa dataa. Se vain lukee muokatut arvot
client.on('data', (data) =>{
    //Jos pitää testata, saako client dataa serveriltä:
    //console.log(data);  
    client.read(data);
   
    client.on('end', client.end);
});


