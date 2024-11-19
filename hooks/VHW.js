import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//VHW = Water Speed and Heading. $GPVHW,HEADING_DEGRESS_TRUE,T,HEADING_DEG_MAGNETIC,M,SPEED_KNOTS,N,SPEED_KMH,K*hh
//Esim. $GPVHW,,T,331.7,M,47.2,N,87.4,K*60
const vhw = (input) => {
    let message = input.toString();
    if (message.length == 0 || !message.match("VHW")) {
        return "Invalid input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;
}

//Lisätään parametrin prosenttiluku nopeuteen, lasketaan uusi cheksum, palautetaan muutettu viesti
export const modifyVHW = (input, change) => {
    let modifyer = 1;
    let message = input.toString();
    if (message.length == 0 || !message.match("VHW")) {
        return "Invalid input";
    }
    if (change == null || typeof change != 'number'){
        return "Rate not defined"
    }
    if (change != 0) {
        modifyer = ((100 + change)/100).toFixed(2);
    }

    let mod = message.slice(1, -3);
    let iterate = mod.split(',');
    iterate[5] = (iterate[5] * modifyer).toFixed(1);
    iterate[7] = (iterate[7] * modifyer).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs+"\r\n";
    return modified;
}

export default vhw;