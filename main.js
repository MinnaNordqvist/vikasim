import fs from 'node:fs';
import readline from 'node:readline';
import net from 'node:net';

import dpt from "./hooks/DPT.js"
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import { modifyRPM } from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { locationLostRMC } from './hooks/RMC.js';
import paikkatietoPois from './modules/loseLocation.js';
import nopeaVaihtelu from './modules/rapidRPM.js';
import rot from './hooks/ROT.js'
import rsa from './hooks/RSA.js';
import vhw from './hooks/VHW.js';
import { modifyVHW } from './hooks/VHW.js';

const data = [];
const RMC = [];
const RPM = [];


const server = net.createServer((c) => {
      // 'connection' listener.
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


client.on('data',function(data){
   // console.log('Data sent to server : ' + data);
  
    //echo data
    var is_kernel_buffer_full = client.write(data);
    if(is_kernel_buffer_full){
      //console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
    }else{
      client.pause();
    }
});

client.on('drain',function(){
    console.log('write buffer is empty now .. u can resume the writable stream');
    client.resume();
});

client.on('close',function(error){
    var bread = client.bytesRead;
    var bwrite = client.bytesWritten;
    console.log('Bytes read : ' + bread);
    console.log('Bytes written : ' + bwrite);
    console.log('Socket closed!');
    if(error){
        console.log('Socket was closed coz of transmission error');
    }
});


let message = "";
let modified = "";
let modifyMore = "";
for (var i = 0; i < data.length; i++){
       
    if (data[i].match("HDT")){
        message = hdt(data[i]);
        //console.log(message);
    }
    if (data[i].match("RPM")){
        RPM.push(data[i]);
        message = rpm(data[i]);
        //console.log(message);
        modified = modifyRPM(data[i], 10);
       // console.log(modified);
    }
    if (data[i].match("RMC")){
        message = rmc(data[i]);
        RMC.push(data[i]);
        //console.log(message);
        modifyMore = locationLostRMC(data[i]);
        client.write(modifyMore);
       // console.log(modifyMore);
        modified = modifyRMCspeed(data[i], -50);
       // console.log(modified);
    }
    if (data[i].match("DPT")){
        message = dpt(data[i]);
        //console.log(message);
    }
    if (data[i].match("ROT")){
        message = rot(data[i]);
       // console.log(message);
    }
    if (data[i].match("RSA")){
        message = rsa(data[i]);
        //console.log(message);
    }
    if (data[i].match("VHW")) {
        message = vhw(data[i]);
        //console.log(message);
        modified = modifyVHW(data[i], 10);
        //console.log(modified);
       
    }
};

//setTimeout(paikkatietoPois, 50, RMC);

//console.log(nopeaVaihtelu(RPM));
