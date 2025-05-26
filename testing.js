import fs from 'node:fs';
import readline from 'node:readline';

//Tämä tiedosto on tarkoitettu funktioiden testaamiseen valmiilla datasetillä. 
//Suorita ajamalla konsolissa käsky "node testing.js"

//Hae testattavat funktiot kansiosta hooks
import { moveShip } from './hooks/RMC.js';
import { moveShipAgain } from './hooks/RMC.js';

var data = [];
let message = "";
let iterate;

//Tiedosto data.txt luetaan tiedostosta
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

//Testaa haluamasi funktiot täällä ja tulosta manipuloitu viesti konsoliin.
for(var i = 0; i < data.length - 1; i++){
    let j = i + 1;
    if(data[i].match("RMC")){
        message = moveShip(data[i], "NW");
        iterate = moveShipAgain(data[i], "E");
        console.log(iterate);
    //  console.log(message);
    }
      
}





