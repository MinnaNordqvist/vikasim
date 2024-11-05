import fs from 'node:fs';
import readline from 'node:readline';
import hdt from './hooks/HDT.js';
import rpm from './hooks/RPM.js';
import rmc from './hooks/RMC.js';
import calculateCS from './hooks/checksum.js'
var data = [];
var HDT = [];
var RPM = [];
var RMC = [];

//Luetaan datasetti, poistetaan tyhjät välit ja ylimääräinen tieto. Tallennetaan Arrayn.
async function processLineByLine() {
    const filestream = fs.createReadStream('./data/nmea0183.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity,
    });
  
    for await (const line of rl) {
        if (line != ""){
            var mod = line.slice(2);
           // console.log(mod);
            data.push(mod);
        }
    }
    console.log("Data length: " + data.length);
    return data;
} 

await processLineByLine();     


console.log("Hello world!");

let sentence = '$GPVHW,,T,347.9,M,50.3,N,93.2,K*6B';
let cs = calculateCS(sentence);

console.log(cs);


let message = "";
for (var i = 0; i < data.length; i++){
    if (data[i].match("HDT")){
        message = hdt(data[i]);
        HDT.push(message);
       // console.log(message);
    }
    if (data[i].match("RPM")){
        message = rpm(data[i]);
        RPM.push(message);
        //console.log(message);
    }
    if (data[i].match("RMC")){
        message = rmc(data[i]);
        RMC.push(message);
       // console.log(message);
    }
}


