import fs from 'node:fs';
import readline from 'node:readline';

import { moveShip } from './hooks/RMC.js';
import { moveShipAgain } from './hooks/RMC.js';
var data = [];
let message = "";
let iterate;



async function processLineByLine() {
    const filestream = fs.createReadStream('./data/data.txt');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        if (line != ""){
            data.push(line);
        }
    }
    console.log("Data length: " + data.length);
    return data;
}     

await processLineByLine();     
console.log("Hello world!");
for(var i = 0; i < data.length - 1; i++){
    let j = i + 1;
    if(data[i].match("RMC")){
        message = moveShip(data[i], "NW");
        iterate = moveShipAgain(data[i], "E");
        console.log(iterate);
    //  console.log(message);
    }
      
}





