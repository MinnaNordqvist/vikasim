import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//VHW = Water Speed and Heading. $GPVHW,HEADING_DEGRESS_TRUE,T,HEADING_DEG_MAGNETIC,M,SPEED_KNOTS,N,SPEED_KMH,K*hh
const vhw = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return "No input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;
}

export default vhw;