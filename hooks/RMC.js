import calculateCS from './checksum.js';

const rmc = (input) => {
    let message = input.toString();
    if (message.length == 0) {
        return;
    }

    let cs = calculateCS(input);

    const RecommendedMinimum ={
        speaker: "GP",
    };
    const sentence = "sentence";
    const time = "UTC time";
    const status = "status";
    const latitude = "latitude";
    const NorS = "N or S";
    const longitude = "longitude";
    const EorW = "E or W";
    const speed = "knots";
    const track = "degrees true";
    const date = "date";
    const faa = "FAA";
    const checksum = "cheksum";

    let iterate = message.split(',');
    Object.assign(RecommendedMinimum, {
        [sentence] : iterate[0].slice(3),
        [time] : iterate[1],
        [status]: iterate[2],
        [latitude]: iterate[3],
        [NorS]: iterate[4],
        [longitude]: iterate[5],
        [EorW]: iterate[6],
        [speed]: iterate[7],
        [track]: iterate[8],
        [date]: iterate[9],
        [faa]: iterate[12].slice(0,1),
        [checksum]: iterate[12].slice(2),
    });
    
    let stringifyRMC = JSON.stringify(RecommendedMinimum);

    return stringifyRMC + cs;

};

export default rmc;