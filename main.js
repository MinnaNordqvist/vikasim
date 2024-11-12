import fs from 'node:fs';
import readline from 'node:readline';
import dpt from "./hooks/DPT.js"
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import { modifyRPM } from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import { modifyRMCspeed } from './hooks/RMC.js';
import { locationLostRMC } from './hooks/RMC.js';
import rot from './hooks/ROT.js'
import rsa from './hooks/RSA.js';
import vhw from './hooks/VHW.js';
import { modifyVHW } from './hooks/VHW.js';
var data = [];

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
let modified = "";
let modifyMore = "";
for (var i = 0; i < data.length; i++){
       
    if (data[i].match("HDT")){
        message = hdt(data[i]);
        //console.log(message);
    }
    if (data[i].match("RPM")){
        message = rpm(data[i]);
        //console.log(message);
        modified = modifyRPM(data[i], 10);
       // console.log(modified);
    }
    if (data[i].match("RMC")){
        message = rmc(data[i]);
        console.log(message);
        modifyMore = locationLostRMC(data[i]);
        console.log(modifyMore);
        modified = modifyRMCspeed(data[i], 10);
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
       // console.log(message);
        modified = modifyVHW(data[i], 10);
       // console.log(modified);
       
    }
}


