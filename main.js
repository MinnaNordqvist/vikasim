import fs from 'node:fs';
import readline from 'node:readline';
import dpt from "./hooks/DPT.js"
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import { modifyRPM } from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import rot from './hooks/ROT.js'
import rsa from './hooks/RSA.js';
import calculateCS from './hooks/checksum.js'
import { verifyCS } from './hooks/checksum.js';
var data = [];
var HDT = [];
var RPM = [];
var RMC = [];

//Luetaan datasetti, poistetaan tyhjät välit ja ylimääräinen tieto. Tallennetaan Arrayn.
async function processLineByLine() {
    const filestream = fs.createReadStream('./data/nmea018322.dat');
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
for (var i = 0; i < data.length; i++){
    if (data[i].match("HDT")){
        message = hdt(data[i]);
        HDT.push(message);
        //console.log(message);
    }
    if (data[i].match("RPM")){
       // console.log(data[i] + " real");
        modified = modifyRPM(data[i], 10);
       // console.log(modified);
        message = rpm(data[i]);
        RPM.push(message);
       //console.log(message);
    }
    if (data[i].match("RMC")){
        message = rmc(data[i]);
        RMC.push(message);
        //console.log(message);
    }
    if (data[i].match("DPT")){
        message = dpt(data[i]);
        //console.log(message);
    }
    if (data[i].match("ROT")){
        message = rot(data[i]);
        //console.log(message);
    }
    if (data[i].match("RSA")){
        message = rsa(data[i]);
        console.log(message);
    }
}


