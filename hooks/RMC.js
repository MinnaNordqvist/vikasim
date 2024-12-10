import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';

//RMC = Recommended Minimum. 
//$GPRMC,UTC_TIME,STATUS,LATITUDE,N/S,LONGITUDE,E/W,SPEED_KNOTS,DEGREES_TRUE,DATE,DEGREES_MAGNETIC,E/W,FAA*hh
//Esim. $GPRMC,122332.58,A,5959.966064,N,02435.708935,E,40.3,337.1,281024,,,A*67
//LATITUDE: ddmm.mmmmmm jossa dd = asteet ja mm.mmmmmm = minuutit [0000.000000, 9000.000000]
//LONGITUDE: dddmm.mmmmmm jossa ddd = asteet ja mm.mmmmmm = minuutit [00000.000000, 18000.000000]
//5959.966064,N = N 59° 59,966064’
//02435.708935,E = E 024° 35,708935’
const rmc = (input) => {
    if (input == null) {
        return "Invalid input";
    }
    let message = input.toString();
    if (message.length == 0 || !message.match("RMC")) {
        return "Invalid input";
    }

    let csVerify = verifyCS(input);

    return message + " " + csVerify;

}

//Lisätään parametrin prosenttiluku nopeuteen (SPEED_KNOTS), lasketaan uusi cheksum, palautetaan muutettu viesti
export const modifyRMCspeed = (input, change) => {
    if (input == null) {
        return console.log("Invalid input");
    }

    let modifyer = 1;
    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    if (change == null || typeof change != 'number'){
        return console.log("Rate not defined");
    }
    if (change != 0) {
        modifyer = ((100 + change)/100).toFixed(2);
    }

    let iterate = message.slice(1, -3).split(',');
    iterate[7] = (iterate[7] * modifyer).toFixed(1);
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = "$"+almost+"*"+cs;
        
    return modified;

}

//Otetaan sijainti pois käytöstä korvaamalla LATITUDE ja LONGITUDE arvolla null, lasketaan uusi checksum ja palautetaan muutettu viesti
export const locationLostRMC = (input) => {
    if (input == null) {
        return console.log("Invalid input");
    }
    
    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    let iterate = message.slice(1, -3).split(',');
    iterate[3] = null;
    iterate[5] = null;    
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`
        
    return modified;

}

let firstLat = 0;
let firstLong = 0;
let defLat = "N";
let defLong = "E";
const getLat = () => firstLat;
const setLat = (val) => {firstLat = val;};
const getLong = () => firstLong;
const setLong = (val) => {firstLong = val;};
const getDefLat = () => defLat;
const setDefLat = (val) => {defLat = val;};
const getDefLong = () => defLong;
const setDefLong = (val) => {defLong = val;};

//Oletetaan alussa että LATITUDE = N ja LONGITUDE = E
const directions = [
    {dir: "N", lat:  0.011, long: 0},
    {dir: "S", lat:  -0.011, long: 0},
    {dir: "E", lat:  0, long: 0.037},
    {dir: "W", lat:  0, long: -0.037},
    {dir: "NE", lat:  0.006, long: 0.019},
    {dir: "NW", lat:  0.006, long: -0.019},
    {dir: "SE", lat:  -0.006, long: 0.019},
    {dir: "SW", lat:  -0.006, long: -0.019}
];

//Manipuloidaan sijaintia haluttuun suuntaan, lasketaan uusi checksum ja palautetaan muutettu viesti. Ensimmäinen kutsu
export const moveShip = (input, direction) => {
    let latDeg;
    let longDeg;
    let latMin;
    let longMin;
    let lat;
    let long;
    let modLat;
    let modLong;
    let going;   

    if (input == null) {
        return console.log("Invalid input");
    }

    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }

    going = directions.find(({dir}) => dir === direction);

    if (going == undefined) {
        return console.log("Direction not found");
    }
    
    modLat = going.lat;
    modLong = going.long;
    
    let iterate = message.slice(1, -3).split(',');    
    latDeg = iterate[3].slice(0, 2); // [0, 90]
    latMin = iterate[3].slice(2, 11); // [0, 59.999]
    lat = iterate[4]; // N/S
    longDeg = iterate[5].slice(0,3); // [0, 180]
    longMin = iterate[5].slice(3,12); // [0, 59.999]
    long = iterate[6]; // E/W
    //Tarkistetaan onko Lat N ja Long E, mikäli ei ole, vaihdetaan moderaattorien merkit +-
    let chooseLat = (lat == "N") ? modLat : -(modLat);
    let chooseLong = (long == "E") ? modLong : -(modLong);

    // Lasketaan latituden muutos minuuteissa
    latMin = (parseFloat(latMin) + chooseLat).toFixed(6);
    if (latMin >= 60){
        latDeg = parseInt(latDeg) + 1;
        latMin = (parseFloat(latMin) - 60).toFixed(6);
    }
    if (latMin < 0){
        latDeg = parseInt(latDeg) - 1;
        latMin = (60 + parseFloat(latMin)).toFixed(6);
    }
  
    //Mikäli Latitude menee negatiiviseksi laskutoimituksen jälkeen:
    if (latDeg < 0 ) {
        latDeg = Math.abs(latDeg);
        let x = (lat == "N") ? "S" :
                (lat == "S") ? "N" :
        lat = x;     
    }
    //Palautetaan puuttuvat nollat
    if (latMin < 10.00){latMin = 0 + latMin;}
    if (latDeg < 10.00){latDeg = 0 + latDeg;}
    iterate[3] = latDeg+latMin;

    //Lasketaan longitude muutos minuuteissa
    longMin = (parseFloat(longMin) + chooseLong).toFixed(6);
    if (longMin >= 60){
        longDeg = parseInt(longDeg) + 1;
        longMin = (parseFloat(longMin) - 60).toFixed(6);
    }
    if (longMin < 0){
        longDeg = parseInt(longDeg) - 1;
        longMin = (60 + parseFloat(longMin)).toFixed(6);
    }
    
    //Mikäli Longitude menee negatiiviseksi laskutoimituksen jälkeen:
    if(longDeg < 0 ){
        longDeg = Math.abs(longDeg);
        let x = (long == "E") ? "W" :
                (long == "W") ? "E" :
        long = x;  
    }

    //Palautetaan nollat
    if (longDeg < 10){longDeg = 0 + longDeg;}
    if (longMin < 10){longMin = 0 + longMin;}
    iterate[5] = longDeg+longMin;
    
    iterate[4] = lat;
    iterate[6] = long;
    setLat(iterate[3]);
    setLong(iterate[5]);

    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`
        
    return modified;
    
}

//Jatketaan sijainnin manipulointia edellisestä paikasta haluttuun suuntaan, lasketaan uusi checksum ja palautetaan muutettu viesti.
export const moveShipAgain = (input, direction) => {
    let lat;
    let long;
    let modLat;
    let modLong;
    let going;   
    let startLat;
    let startLong;

    if (input == null) {
        return console.log("Invalid input");
    }

    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    going = directions.find(({dir}) => dir === direction);

    if (going == undefined) {
        return console.log("Direction not found");
    }

    modLat = going.lat;
    modLong = going.long;
    startLat = getLat();
    startLong = getLong();
    lat = getDefLat();
    long = getDefLong();

    let iterate = message.slice(1, -3).split(','); 
    //Tarkistetaan onko Lat N ja Long E, mikäli ei ole, vaihdetaan moderaattorien merkit +-
    let chooseLat = (lat == "N") ? modLat : -(modLat);
    let chooseLong = (long == "E") ? modLong : -(modLong);

    if (startLat !== 0 && startLong !== 0){
        iterate[3] = (parseFloat(startLat) + chooseLat).toFixed(6);
        //Mikäli Latitude menee negatiiviseksi laskutoimituksen jälkeen:
        if (iterate[3] < 0 && lat === "N") {
            iterate[3] = Math.abs(iterate[3]);
            setDefLat("S");
        }
        if (iterate[3] < 0 && lat === "S"){
            iterate[3] = Math.abs(iterate[3]);
            setDefLat("N");
        }
        iterate[5] = (parseFloat(startLong) + chooseLong).toFixed(6);
        //Mikäli Longitude menee negatiiviseksi laskutoimituksen jälkeen:
         if(iterate[5] <= 0){
            iterate[5] = Math.abs(iterate[5]).toFixed(6);
            let x = (getDefLong() == "W")  ? "E" :
                    (getDefLong() == "E") ? "W":
            setDefLong(x);
        }     
        //Mikäli Longitude menee yli 180 asteen
        if (iterate[5] > 18000) {
            iterate[5] = (36000 - iterate[5]).toFixed(6);
            let x = (getDefLong() == "W")  ? "E" :
                    (getDefLong() == "E") ? "W":
            setDefLong(x); 
        }

         //Palautetaan nolla, mikäli JavaScript poisti.
        if(iterate[5] < 10000){iterate[5] = 0 + iterate[5];}    
        setLat(iterate[3]);
        setLong(iterate[5]);
    } else {
        iterate[3] = (parseFloat(iterate[3]) + chooseLat).toFixed(6);
        if (iterate[3] < 0 && lat === "N") {
            iterate[3] = Math.abs(iterate[3]);
            setDefLat("S");
        }
        if (iterate[3] <= 0 && lat === "S"){
            iterate[3] = Math.abs(iterate[3]);
            setDefLat("N");
        }
        iterate[5] = (parseFloat(iterate[5]) + chooseLong).toFixed(6);
         //Mikäli Longitude menee negatiiviseksi laskutoimituksen jälkeen:
         if(iterate[5] <= 0){
            iterate[5] = Math.abs(iterate[5]).toFixed(6);
            let x = (getDefLong() == "W")  ? "E" :
                    (getDefLong() == "E") ? "W":
            setDefLong(x); 
        }
         //Mikäli Longitude menee yli 180 asteen
         if (iterate[5] > 18000) {
            iterate[5] = (36000 - iterate[5]).toFixed(6);
            let x = (getDefLong() == "W")  ? "E" :
                    (getDefLong() == "E") ? "W":
            setDefLong(x); 
        }
         //Palautetaan nolla, mikäli JavaScript poisti.
        if(iterate[5] < 10000){iterate[5] = 0 + iterate[5];}    
        setLat(iterate[3]);
        setLong(iterate[5]);
    }

    iterate[4] = getDefLat();
    iterate[6] = getDefLong();    
    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`

    return modified; 
}

export default rmc;