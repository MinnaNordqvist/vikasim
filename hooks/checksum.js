
//Lasketaan viestille checksum ja muunnetaan se hexaksi
const calculateCS = (input) => {
    if (input == null){
        return;
    }
    
    let checksum = 0;
    let sliced = input.slice(1, -3);
    
    for(var i = 0; i < sliced.length; i++) {
        checksum = checksum ^ sliced.charCodeAt(i);
      }

    let hexa = checksum.toString(16).toUpperCase();
    if (hexa.length < 2 ){
        hexa = 0 + hexa;
    }  

    return hexa;
};

const verifyCS = (input) => {
    if (input == null) {
        return;
    }


};

export default calculateCS;
