import fs from 'node:fs';
import readline from 'node:readline';
import hdt from './hooks/messages/HDT.js';
var data = [];
var HDT = [];

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
            data.push(mod);
        }
    }
    console.log("Data length: " + data.length);
    return data;
} 


await processLineByLine();     

console.log("Hello world!");
let message = "";
for(var i = 0; i < data.length; i++){
    if(data[i].match("HDT")){
       message = hdt(data[i]);
        HDT.push(message);
    }
}


