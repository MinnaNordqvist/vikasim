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

};

//Lisätään parametrin prosenttiluku nopeuteen (SPEED_KNOTS), lasketaan uusi cheksum, palautetaan muutettu viesti
export const modifyRMCspeed = (input, change) => {
    if (input == null) {
        return "Invalid input";
    }
    
    let modifyer = 1;
    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    if (change == null || typeof change != 'number'){
        return "Rate not defined"
    }
    if (change != 0) {
        modifyer = ((100 + change)/100).toFixed(2);
    }

    let mod = message.slice(1, -3);
    let iterate = mod.split(',');
    iterate[7] = (iterate[7] * modifyer).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
        
    return modified;

}

//Otetaan sijainti pois käytöstä korvaamalla LATITUDE ja LONGITUDE arvolla null, lasketaan uusi checksum ja palautetaan muutettu viesti
export const locationLostRMC = (input) => {
    if (input == null) {
        return "Invalid input";
    }

    let message = input.toString();
    if (!message.match("RMC")){
        return message;
    }
    let mod = message.slice(1, -3);
    let iterate = mod.split(',');
    iterate[3] = null;
    iterate[5] = null;    
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
        
    return modified;

}

export default rmc;
