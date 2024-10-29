
const hdt = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }

    const headingTrue = {
        speaker: "GS",
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

    return stringifyHDT;
};

export default hdt;