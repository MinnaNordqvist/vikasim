import calculateCS from './checksum.js';
import { verifyCS } from './checksum.js';
import { directions } from './directions.js';
import { getLat, setLat } from './directions.js';
import { getDefLat, setDefLat } from './directions.js';
import { getLong, setLong } from './directions.js';
import { getDefLong, setDefLong } from './directions.js';

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

//Manipuloidaan sijaintia haluttuun suuntaan, lasketaan uusi checksum ja palautetaan muutettu viesti. Ensimmäinen kutsu
export const moveShip = (input, direction) => {
    if (input == null) {
        return console.log("Invalid input");
    }

    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }

    let going = directions.find(({dir}) => dir === direction);

    if (going == undefined) {
        return console.log("Direction not found");
    }
    
    let modLat = going.lat;
    let modLong = going.long;
    
    let iterate = message.slice(1, -3).split(',');    
    let latDeg = iterate[3].slice(0, 2); // [0, 90]
    let latMin = iterate[3].slice(2, 11); // [0, 59.999]
    let lat = iterate[4]; // N/S
    let longDeg = iterate[5].slice(0,3); // [0, 180]
    let longMin = iterate[5].slice(3,12); // [0, 59.999]
    let long = iterate[6]; // E/W
    //Tarkistetaan onko Lat N ja Long E, mikäli ei ole, vaihdetaan moderaattorien merkit +-
    let chooseLat = (lat == "N") ? modLat : -(modLat);
    let chooseLong = (long == "E") ? modLong : -(modLong);

    // Lasketaan latituden muutos minuuteissa
    latMin = (parseFloat(latMin) + chooseLat).toFixed(6);
    if (latMin >= 60){
        latDeg = parseInt(latDeg) + 1;
        latMin = (parseFloat(latMin) - 60).toFixed(6);
    }
    if (latMin < 0 && latDeg > 0){
        latDeg = parseInt(latDeg) - 1;
        latMin = (60 + parseFloat(latMin)).toFixed(6);
    }
  
    //Mikäli Latitude menee negatiiviseksi laskutoimituksen jälkeen:
    if (latMin < 0 && latDeg <= 0 ) {
        latMin = Math.abs(latMin).toFixed(6);
        latDeg = Math.abs(latDeg);
        let x = (lat == "N") ? "S" :
                (lat == "S") ? "N" :
        lat = x;     
    }
   
    latMin = latMin.toString();
    latDeg = latDeg.toString();
    //Palautetaan puuttuvat nollat
    if (latMin.length < 9){latMin = 0 + latMin;}
    if (latDeg.length < 2){latDeg = 0 + latDeg;}
    iterate[3] = latDeg+latMin;

    //Lasketaan longitude muutos minuuteissa
    longMin = (parseFloat(longMin) + chooseLong).toFixed(6);
    if (longMin >= 60){
        longDeg = parseInt(longDeg) + 1;
        longMin = (parseFloat(longMin) - 60).toFixed(6);
    }
    if (longMin < 0 && longDeg > 0){
        longDeg = parseInt(longDeg) - 1;
        longMin = (60 + parseFloat(longMin)).toFixed(6);
    }
    
    //Mikäli Longitude menee negatiiviseksi laskutoimituksen jälkeen:
    if(longMin && longDeg <= 0 ){
        longDeg = Math.abs(longDeg);
        longMin = Math.abs(longMin).toFixed(6);
        let x = (long == "E") ? "W" :
                (long == "W") ? "E" :
        long = x;  
    }

    longMin = longMin.toString();
    longDeg = longDeg.toString();
    //Palautetaan nollat
    if (longDeg.length < 3){longDeg = 0 + longDeg;}
    if (longMin.length < 9){longMin = 0 + longMin;}
    iterate[5] = longDeg+longMin;
    
    iterate[4] = lat;
    iterate[6] = long;
    // Tallennetaan arvot settereihin
    setLat(iterate[3]);
    setLong(iterate[5]);
    setDefLat(iterate[4]);
    setDefLong(iterate[6]);

    let almost = iterate.toString();
    let cs = calculateCS(almost);
    let modified = `$${almost}*${cs}`
        
    return modified;
    
}

//Jatketaan sijainnin manipulointia edellisestä paikasta haluttuun suuntaan, lasketaan uusi checksum ja palautetaan muutettu viesti.
export const moveShipAgain = (input, direction) => {
    if (input == null) {
        return console.log("Invalid input");
    }

    let message = input.toString();
    if (!message.match("RMC")) {
        return message;
    }
    let going = directions.find(({dir}) => dir === direction);

    if (going == undefined) {
        return console.log("Direction not found");
    }

    let modLat = going.lat;
    let modLong = going.long;
    let startLat = getLat();
    let startLong = getLong();
    let lat = getDefLat();
    let long = getDefLong();

    let iterate = message.slice(1, -3).split(','); 
   
    //Tarkistetaan onko Lat N ja Long E, mikäli ei ole, vaihdetaan moderaattorien merkit +-
    let chooseLat = (lat == "N") ? modLat : -(modLat);
    let chooseLong = (long == "E") ? modLong : -(modLong);

    if (startLat === 0 || startLong === 0){
        return moveShip(input, direction);  
        
    } else {    
        let latDeg = startLat.slice(0, 2); // [0, 90]
        let latMin = startLat.slice(2, 11); // [0, 59.999]
        let longDeg = startLong.slice(0,3); // [0, 180]
        let longMin = startLong.slice(3,12); // [0, 59.999]
        
        latMin = (parseFloat(latMin) + chooseLat).toFixed(6);
        if (latMin >= 60){
            latDeg = parseInt(latDeg) + 1;
            latMin = (parseFloat(latMin) - 60).toFixed(6);
        }
        if (latMin < 0 && latDeg > 0){
            latDeg = parseInt(latDeg) - 1;
            latMin = (60 + parseFloat(latMin)).toFixed(6);
        }
        //Mikäli Latitude menee negatiiviseksi laskutoimituksen jälkeen:
        if (latMin < 0 && latDeg <= 0 ) {
            latMin = Math.abs(latMin).toFixed(6);
            latDeg = Math.abs(latDeg);
            let x = (lat == "N") ? "S" :
                    (lat == "S") ? "N" :  
            lat = x;        
            setDefLat(x);
        }
        //Mikäli Latitude > 90 laskutoimituksen jälkeen:
        if (latDeg >= 90 ) {
            latDeg = 180 - latDeg;
            if (latMin > 0) {latDeg = latDeg - 1;}
            longDeg = 180 - longDeg;
            if (longMin > 0) {longDeg = longDeg - 1; longMin = (60 - longMin).toFixed(6);}
            let x = (long == "E") ? "W" :
                    (long == "W") ? "E" : 
            long = x;        
            setDefLong(x);
        }
        latMin = latMin.toString();
        latDeg = latDeg.toString();
        //Palautetaan puuttuvat nollat
        if (latMin.length < 9){latMin = 0 + latMin;}
        if (latDeg.length < 2){latDeg = 0 + latDeg;}
        iterate[3] = latDeg+latMin;
        //Tallennetaan setteriin
        setLat(iterate[3]);
        
        //Lasketaan longitude muutos minuuteissa
        longMin = (parseFloat(longMin) + chooseLong).toFixed(6);
        if (longMin >= 60){
            longDeg = parseInt(longDeg) + 1;
            longMin = (parseFloat(longMin) - 60).toFixed(6);
        }
        if (longMin < 0 && longDeg > 0){
            longDeg = parseInt(longDeg) - 1;
            longMin = (60 + parseFloat(longMin)).toFixed(6);
        }
        //Mikäli Longitude menee negatiiviseksi laskutoimituksen jälkeen:
        if (longMin < 0 && longDeg <= 0 ){
            longDeg = Math.abs(longDeg);
            longMin = Math.abs(longMin).toFixed(6);
            let x = (long == "W")  ? "E" :
                    (long == "E") ? "W":
            long = x;        
            setDefLong(x);
        }
        //Mikäli Longitude menee yli 180 asteen
        if (longDeg >= 180 ){
            longDeg = 360 - longDeg;
            if(longMin > 0) {longDeg = longDeg - 1; longMin = (60 - longMin).toFixed(6);}
            let x = (long == "W")  ? "E" :
                    (long == "E") ? "W":
            long = x;        
            setDefLong(x); 
        }

        longMin = longMin.toString();
        longDeg = longDeg.toString();
        //Palautetaan nollat
        if (longDeg.length < 2){longDeg = "00" + longDeg;}
        if (longDeg.length < 3){longDeg = "0" + longDeg;}
      
        if (longMin.length < 9){longMin = "0" + longMin;}
        iterate[5] = longDeg+longMin;
        //Tallennetaan arvo
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