import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

const hdt = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }

    let cs = calculateCS(input);
    let csVerify = verifyCS(input);

    const headingTrue = {
        speaker: "GP",
    };
    const sentence = "sentence";
    const degrees = "degrees";
    const cheksum = "checksum";

    let iterate = message.split(',');
    Object.assign(headingTrue, {
        [sentence] : iterate[0].slice(3),
        [degrees] : iterate[1],
        [cheksum] : iterate[2].slice(2),  
    });
    
    let stringifyHDT = JSON.stringify(headingTrue);

    return stringifyHDT + cs + " " + csVerify;
};

export default hdt;