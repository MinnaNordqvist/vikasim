import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//HDT = Heading True. $GPHDT,HEADING_DEGRESS,T*hh
//Esim. $GPHDT,339.3,T*3F
const hdt = (input) => {
    let message = input.toString();
    if (message.length == 0 || !message.match("HDT")) {
        return "Invalid input";
    }

    let csVerify = verifyCS(input);

    return message + " " + csVerify;
};

export default hdt;