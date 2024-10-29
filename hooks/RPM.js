
const rpm = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }

    const RevolutionsPerMinute = {
        speaker: "GS",
    };
    const sentence = "sentence";
    const source = "source";
    const sourceNumber = "sourceNumber";
    const speed = "RPM";
    const propellerPitchRate = "max";
    const checksum = "cheksum";

    let iterate = message.split(',');
    Object.assign(RevolutionsPerMinute, {
        [sentence] : iterate[0].slice(3),
        [source] : iterate[1],
        [sourceNumber] : iterate[2],
        [speed] : iterate[3],
        [propellerPitchRate] : iterate[4].slice(0,3),
        [checksum] : iterate[4].slice(4),  
    });

    let stringifyRPM = JSON.stringify(RevolutionsPerMinute);

    return stringifyRPM;
};

export default rpm;