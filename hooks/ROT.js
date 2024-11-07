import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//ROT = Rate of Turn. $GPROT,NAVIGATION_RATE_OF_TURN_DEG,STATUS*hh
const rot = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return "No input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;

}

export default rot;
