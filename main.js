import fs from 'node:fs';
import readline from 'node:readline';
var data = [];

async function processLineByLine() {
    const filestream = fs.createReadStream('./data/nmea0813.dat');
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

//for(var i = 0; i < data.length; i++){
//    console.log(data[i]);
//}

