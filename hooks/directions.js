
let firstLat = 0;
let firstLong = 0;
let defLat = "N";
let defLong = "E";
export const getLat = () => firstLat;
export const setLat = (val) => {firstLat = val;};
export const getLong = () => firstLong;
export const setLong = (val) => {firstLong = val;};
export const getDefLat = () => defLat;
export const setDefLat = (val) => {defLat = val;};
export const getDefLong = () => defLong;
export const setDefLong = (val) => {defLong = val;};

export const directions = [
    {dir: "N", lat:  0.011, long: 0},
    {dir: "S", lat:  -0.011, long: 0},
    {dir: "E", lat:  0, long: 0.037},
    {dir: "W", lat:  0, long: -0.037},
    {dir: "NE", lat:  0.006, long: 0.019},
    {dir: "NW", lat:  0.006, long: -0.019},
    {dir: "SE", lat:  -0.006, long: 0.019},
    {dir: "SW", lat:  -0.006, long: -0.019}
];