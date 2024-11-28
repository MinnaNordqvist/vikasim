
//Lasketaan viestille checksum ja muunnetaan se hexaksi
const calculateCS = (input) => {
    let checksum = 0;
    
    if (input == null){
        return console.log("No input");
    }
    
    for(var i = 0; i < input.length; i++) {
        checksum = checksum ^ input.charCodeAt(i);
      }

    let hexa = checksum.toString(16).toUpperCase();
    if (hexa.length < 2 ){
        hexa = 0 + hexa;
    }  

    return hexa;
};

//Tarkistetaan onko viestin Checksum oikein
export const verifyCS = (input) => {
    if (input == null) {
        return console.log("No input");
    }
    
    let og = input.slice(input.length - 2);
    let sliced = input.slice(1, -3);
    let cs = calculateCS(sliced);
   
    if(cs == og){
        return true;
    }
    return false;
};

export default calculateCS;
