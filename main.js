import fs from 'node:fs';
import readline from 'node:readline';
import net from 'node:net';

import { locationLostRMC } from './hooks/RMC.js';

const data = [];

//Luodaan serveri
const server = net.createServer((c) => {
      
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
 
  c.pipe(c);
});

server.on('error', (err) => {
    throw err;
});

server.on('connection',(socket) =>{
    var lport = socket.localPort;
    var laddr = socket.localAddress;
    console.log('Server is listening at LOCAL port ' + lport);
    console.log('Server LOCAL ip :' + laddr);
    socket.setEncoding('utf8');

});


server.listen(2222, () => {
    var address = server.address();
    console.log("opened server on %j", address);
});



//Luodaan client joka lukee muokatut arvot ja lähettää ne eteenpäin.
var client  = net.connect({port: 2222}, function(){
    console.log('Client: connection established with server');
    var address = client.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Client is listening at port ' + port);
    console.log('Client ip :' + ipaddr);
    console.log('Client is IP4/IP6 : ' + family);

    
});

client.setEncoding('utf8');
client.on('data',function(data){
    console.log('Data sent to server : ' + data);
   
     //echo data
     var is_kernel_buffer_full = client.write(data);
     if(is_kernel_buffer_full){
     
     }else{
       client.pause();
     }
 });

//Luetaan datasetti, poistetaan tyhjät välit ja ylimääräinen tieto. Tallennetaan Arrayn.
async function processLineByLine() {
    const filestream = fs.createReadStream('./data/nmea0183.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity,
    });
    
    try {
        for await (const line of rl) {
            if (line != ""){
                let index = line.indexOf("$");
                var mod = line.slice(index);
                //console.log(mod);
                data.push(mod);
            }
        }
        console.log("Data length: " + data.length);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
} 


await processLineByLine();     

console.log("Hello world!");

let message = "";

for (var i = 0; i < data.length; i++){
    if (data[i].match("RMC")){
        message = locationLostRMC(data[i]);
        client.write(message);
    };
}
