import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RMC = Recommended Minimum. 
//$GPRMC,UTC_TIME,STATUS,LATITUDE,N/S,LONGITUDE,E/W,SPEED_KNOTS,DEGREES_TRUE,DATE,DEGREES_MAGNETIC,E/W,FAA*hh
//Esim. $GPRMC,122332.58,A,5959.966064,N,02435.708935,E,40.3,337.1,281024,,,A*67
const rmc = (input) => {
    if (input == null) {
        return "Invalid input";
    }
    let message = input.toString();
    if (message.length == 0 || !message.match("RMC")) {
        return "Invalid input";
    }

    let csVerify = verifyCS(input);

    return message + " " + csVerify;

}

//Lisätään parametrin prosenttiluku nopeuteen (SPEED_KNOTS), lasketaan uusi cheksum, palautetaan muutettu viesti
export const modifyRMCspeed = (input, change) => {
    if (input == null) {
        return console.log("Invalid input");
    }

    let modifyer = 1;
    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    if (change == null || typeof change != 'number'){
        return console.log("Rate not defined");
    }
    if (change != 0) {
        modifyer = ((100 + change)/100).toFixed(2);
    }

    let iterate = message.slice(1, -3).split(',');
    iterate[7] = (iterate[7] * modifyer).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
        
    return modified;

}

//Otetaan sijainti pois käytöstä korvaamalla LATITUDE ja LONGITUDE arvolla null, lasketaan uusi checksum ja palautetaan muutettu viesti
export const locationLostRMC = (input) => {
    if (input == null) {
        return console.log("Invalid input");
    }
    
    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    let iterate = message.slice(1, -3).split(',');
    iterate[3] = null;
    iterate[5] = null;    
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`
        
    return modified;

}

//Manipuloidaan sijaintia haluttuun suuntaan, lasketaan uusi checksum ja palautetaan muutettu viesti
export const moveShip = (input, direction) => {
    const directions = [
        {dir: "N", lat:  0.011, long: 0},
        {dir: "S", lat:  -0.011, long: 0},
        {dir: "E", lat:  0, long: 0.037},
        {dir: "W", lat:  0, long: -0.037},
        {dir: "NE", lat:  0.006, long: 0.019},
        {dir: "NW", lat:  0.006, long: -0.019},
        {dir: "SE", lat:  -0.006, long: 0.019},
        {dir: "SW", lat:  -0.006, long: -0.019}
    ];
 
    let modLat;
    let modLong;
    let going;   
    
    if (input == null) {
        return console.log("Invalid input");
    }

    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }

    going = directions.find(({dir}) => dir === direction);

    if (going == undefined) {
        return console.log("Direction not found");
    }
    
    modLat = going.lat;
    modLong = going.long;
 
    let iterate = message.slice(1, -3).split(',');    
    iterate[3] = (parseFloat(iterate[3]) + modLat).toFixed(6);
    iterate[5] =  0 + (parseFloat(iterate[5]) + modLong).toFixed(6);    
 
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`
        
    return modified;
    
}

export default rmc;