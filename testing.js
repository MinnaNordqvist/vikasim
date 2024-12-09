import fs from 'node:fs';
import readline from 'node:readline';

import { moveShip } from './hooks/RMC.js';
import { moveShipAgain } from './hooks/RMC.js';
var data = [];
let message = "";
let gps = [];
let dist = [];
let mod;
let iterate;
let iterated;
let north = "N";
let south = "S";
let east = "E";
let west = "W";

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
for(var i = 0; i < data.length -1; i++){
    let j = i + 1;
    if(data[i].match("RMC")){
        gps.push(data[i]);
        message = moveShip(data[i], "N");
        iterate = moveShipAgain(data[i], "W");
        console.log(iterate);
     //   console.log(message);
    }
   
   
}

//console.log(gps.length);
for(var i = 0; i < gps.length; i++){
    message = gps[i].toString();
    mod = message.slice(1, -3);
    iterate = mod.split(',');
    dist.push(iterate[3] + ":" + iterate[5] + ":" + iterate[8] + ":" + iterate[7]);
    
}

//console.log(dist.length);
//dist.forEach((element) => console.log(element));
let j;
let N;
let E;
let T;
let K;

const Lat = "Lat";
const Long = "Long";
const True = "True";
const Knots = "Knots"
const finding = [];

for(let i = 0; i < dist.length - 1; i++){
    j = i + 1;
   //console.log(dist[i]);
    message = dist[i].toString();
    iterate = message.split(':');
    mod = dist[j].toString();
    iterated = mod.split(':');
    N = iterated[0] - iterate[0];
    E = iterated[1] - iterate[1];
    T = iterated[2];
    K = iterated[3];
    var going = {
        [Lat]: iterated[0] - iterate[0], 
        [Long]: iterated[1] - iterate[1], 
        [True]: iterated[2], 
        [Knots]: iterated[3],
    };
   
   // stringifyRMC = JSON.stringify(going);
    finding.push(going);
    //console.log(going);
   // console.log(stringifyRMC);
  
   // console.log(N.toFixed(6) + " N and " + E.toFixed(6) + " E and " + T + " Deg and " + K + " Knots");
}
//console.log(finding.length);
//finding.forEach((element) => console.log(element));
const sorted = [...finding].sort((a,b) => a.True - b.True);

const result = sorted.filter((a) => Math.abs(a.Lat) < 1 && Math.abs(a.Long) < 1);
//result.forEach((element) => console.log(Math.abs(element.Lat) + " - " + Math.abs(element.Long) + " - " + element.Knots + " - " + element.True ));