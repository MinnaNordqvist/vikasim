import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//DPT = Depth. $GPDPT,METRES,OFFSET_METRES,MAXIMUM_METRES*hh
//Huom: Datasetissä viestiin lisätty arvo T ennen checksumia.
const dpt = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return "No input";
    }
    
    let csVerify = verifyCS(input);

    return message + " " + csVerify;
}

export default dpt;