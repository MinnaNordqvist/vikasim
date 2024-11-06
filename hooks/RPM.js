import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RPM = Revolutions Per Minute. $GPRPM,SOURCE,SOURCE_NUMBER,SPEED_RPM,PROPELLER_PITCH_RATE*hh 
const rpm = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }
    
    let csVerify = verifyCS(input);
    let mes = input.slice(1);
    let iterate = mes.split(',');
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
        [sentence] : iterate[0].slice(2),
        [source] : iterate[1],
        [sourceNumber] : iterate[2],
        [speed] : iterate[3],
        [propellerPitchRate] : iterate[4].slice[-3],
        [checksum] : iterate[4].slice(4),  
    });

    let stringifyRPM = JSON.stringify(RevolutionsPerMinute);

    return stringifyRPM + csVerify;
};

//Lisätään 10% kierroslukuun, lasketaan uusi checksum, palautetaan muutetu viesti
export const modifyRPM = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }
    
    let mod = message.slice(1, -3);
    let iterate = mod.split(',');
    iterate[3] = (iterate[3] * 1.10).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
    let csVerify = verifyCS(modified);
    
    return modified + " " + csVerify;
} 

export default rpm;