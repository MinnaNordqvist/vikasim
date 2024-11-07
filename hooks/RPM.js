import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RPM = Revolutions Per Minute. $GPRPM,S/E,SOURCE_NUMBER,SPEED_RPM,PROPELLER_PITCH_RATE,STATUS*hh 
//Huom: datasetissä viestistä puuttuu viimeinen arvo STATUS.
const rpm = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return "No input";
    }
    
    let csVerify = verifyCS(input);
    let iterate = message.split(',');
    const RevolutionsPerMinute = {
        speaker: "GP",
    };
    const sentence = "sentence";
    const source = "source";
    const sourceNumber = "sourceNumber";
    const speed = "RPM";
    const propellerPitchRate = "max";
    const checksum = "cheksum";
    
    Object.assign(RevolutionsPerMinute, {
        [sentence] : iterate[0].slice(3),
        [source] : iterate[1],
        [sourceNumber] : iterate[2],
        [speed] : iterate[3],
        [propellerPitchRate] : iterate[4].slice[-3],
        [checksum] : iterate[4].slice(4),  
    });

    let stringifyRPM = JSON.stringify(RevolutionsPerMinute);

    return stringifyRPM + csVerify;
};

//Lisätään parametrin prosenttimuutos kierroslukuun, lasketaan uusi checksum, palautetaan muutetu viesti
export const modifyRPM = (input, change) => {
    let modifyer = 1;
    let message = input.toString();
    if (message.length == 0) {
        return "No input found";
    }
    if (change == null){
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