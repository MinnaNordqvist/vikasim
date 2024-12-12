import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';
/*
ROT = Rate of Turn. $GPROT,NAVIGATION_RATE_OF_TURN_DEG,STATUS*hh
Esim $GPROT,-113.3,A*1C
*/
const rot = (input) => {
    if (input == null) {
        return "Invalid input";
    }
   
    let message = input.toString();
    if (message.length == 0 || !message.match("ROT")) {
        return "Invalid input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;

}

export default rot;
