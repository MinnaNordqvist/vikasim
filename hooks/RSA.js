import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RSA = Rudder Sensor Angle. $GPRSA,RUDDER_SENSOR,STATUS,PORT_RUDDER_SENSOR,STATUS*hh
const rsa = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return "No input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;

}

export default rsa;