//Tuodaan serverimetodit
import server from './server.js';
import { socket } from './server.js';

//Tuodaan vikafunktiot
import dpt from "./hooks/DPT.js"
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import { modifyRPM } from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { locationLostRMC } from './hooks/RMC.js';
import { moveShip } from './hooks/RMC.js';
import { moveShipAgain } from './hooks/RMC.js';
import rot from './hooks/ROT.js'
import rsa from './hooks/RSA.js';
import vhw from './hooks/VHW.js';
import { modifyVHW } from './hooks/VHW.js';


let serveri = server;
let sock = socket;

serveri.listen();
let servadd = serveri.address();
let port = servadd.port;
sock.connect(port);


sock.on('data', (data) => {
    //console.log("Server sent " + data);
    let res="";
    let message = "";
    for (const chunk of data){
         res += chunk;
    }
    res=data.toString();
    message = res.split("\r\n").filter(a => !!a).map(b => moveShipAgain(b, "NW")).join("\r\n");
    //console.log("message: " + message);
    sock.write(message);
})


console.log("Hello world!");









