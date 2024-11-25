import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RPM = Revolutions Per Minute. $GPRPM,S/E,SOURCE_NUMBER,SPEED_RPM,PROPELLER_PITCH_RATE,STATUS*hh 
//Esim. $GPRPM,E,0,5350.0,100*01
//Huom: datasetissä viestistä puuttuu viimeinen arvo STATUS.

const rpm = (input) => {
    if (input == null) {
        return "Invalid input";
    }

    let message = input.toString();
    if (message.length == 0 || !message.match("RPM")) {
        return "Invalid input";
    }
    
    let csVerify = verifyCS(input);
    
    return message + " " + csVerify;
};

//Lisätään parametrin prosenttimuutos kierroslukuun, lasketaan uusi checksum, palautetaan muutetu viesti
export const modifyRPM = (input, change) => {
    if (input == null) {
        return "Invalid input";
    }
    
    let modifyer = 1;
    let message = input.toString();
    if (!message.match("RPM")) {
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
    iterate[3] = (iterate[3] * modifyer).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
        
    return modified;
} 

export default rpm;