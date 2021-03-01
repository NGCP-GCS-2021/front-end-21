// Javascript port of GPS to Cartesian conversion logic
// From AUVSI search path algorithm

var EARTH_RADIUS = 6378137; // Radius of the Earth in meters
// Aliases for indexing into arrays that represent coordinates
var X = 0;
var Y = 1;
var Z = 2;
// Variables used in coordinate conversion
// IMPORTANT: Initialize with init() and computeBasis() before using
var refCart = []; // Reference point in standard basis 3D Cartesian coordinates
// Our new basis vectors
var ourX = [0, 0, 0];
var ourY = [0, 0, 0];
var ourZ = [0, 0, 0];
var convMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
var REF_LONG = 0;
var REF_LAT = 0;

export function toRadians(degrees) {
    return degrees * (Math.PI / 180.0);
}

export function toDegrees(radians) {
    return radians * (180.0 / Math.PI);
}

export function init(longitude, latitude) {
    REF_LONG = longitude;
    REF_LAT = latitude;
    refCart = GPStoCartesian(REF_LONG, REF_LAT);
}

export function computeBasis() {
    ourZ = refCart.slice();
    var length = Math.sqrt(ourZ[X] * ourZ[X] + ourZ[Y] * ourZ[Y] + ourZ[Z] * ourZ[Z]);
    ourX[X] = 1.0;
    ourX[Y] = 0;
    ourX[Z] = ((ourZ[X] * refCart[X] - ourZ[X] * ourX[X] + ourZ[Y] * refCart[Y] - ourZ[Y] * ourX[Y] + ourZ[Z] * refCart[Z]) / ourZ[Z]);
    // Make our X the positional vector anchored at global::refCart and pointing towards the point we just calculated on the plane
    ourX[X] -= refCart[X];
    ourX[Y] -= refCart[Y];
    ourX[Z] -= refCart[Z];
    // Cross our X and our Z to get our Y
    ourY[X] = (ourZ[Y] * ourX[Z] - ourZ[Z] * ourX[Y]);
    ourY[Y] = (-(ourZ[X] * ourX[Z] - ourZ[Z] * ourX[X]));
    ourY[Z] = (ourZ[X] * ourX[Y] - ourZ[Y] * ourX[X]);
    // Scale basis vectors to unit length
    ourZ[X] /= length;
    ourZ[Y] /= length;
    ourZ[Z] /= length;
    length = Math.sqrt(ourX[X] * ourX[X] + ourX[Y] * ourX[Y] + ourX[Z] * ourX[Z]);
    ourX[X] /= length;
    ourX[Y] /= length;
    ourX[Z] /= length;
    length = Math.sqrt(ourY[X] * ourY[X] + ourY[Y] * ourY[Y] + ourY[Z] * ourY[Z]);
    ourY[X] /= length;
    ourY[Y] /= length;
    ourY[Z] /= length;
    // Compute the conversion matrix by inverting the standard matrix
    var standardMatrix = [
        [ourX[X], ourY[X], ourZ[X]],
        [ourX[Y], ourY[Y], ourZ[Y]],
        [ourX[Z], ourY[Z], ourZ[Z]]
    ];
    var determinate = (standardMatrix[0][0] * (standardMatrix[1][1] * standardMatrix[2][2] - standardMatrix[1][2] * standardMatrix[2][1])) -
	(standardMatrix[0][1] * (standardMatrix[1][0] * standardMatrix[2][2] - standardMatrix[1][2] * standardMatrix[2][0])) +
	(standardMatrix[0][2] * (standardMatrix[1][0] * standardMatrix[2][1] - standardMatrix[1][1] * standardMatrix[2][0]));
    for (var i = 0; i < 3; ++i) {
        // Transpose the standard matrix
        for (var j = i; j < 3; ++j) {
            var temp = standardMatrix[i][j];
            standardMatrix[i][j] = standardMatrix[j][i];
            standardMatrix[j][i] = temp;
        }
    }
    convMatrix[0][0] = standardMatrix[1][1] * standardMatrix[2][2] - standardMatrix[1][2] * standardMatrix[2][1];
    convMatrix[0][1] = standardMatrix[1][0] * standardMatrix[2][2] - standardMatrix[1][2] * standardMatrix[2][0];
    convMatrix[0][2] = standardMatrix[1][0] * standardMatrix[2][1] - standardMatrix[1][1] * standardMatrix[2][0];
    convMatrix[1][0] = standardMatrix[0][1] * standardMatrix[2][2] - standardMatrix[0][2] * standardMatrix[2][1];
    convMatrix[1][1] = standardMatrix[0][0] * standardMatrix[2][2] - standardMatrix[0][2] * standardMatrix[2][0];
    convMatrix[1][2] = standardMatrix[0][0] * standardMatrix[2][1] - standardMatrix[0][1] * standardMatrix[2][0];
    convMatrix[2][0] = standardMatrix[0][1] * standardMatrix[1][2] - standardMatrix[0][2] * standardMatrix[1][1];
    convMatrix[2][1] = standardMatrix[0][0] * standardMatrix[1][2] - standardMatrix[0][2] * standardMatrix[1][0];
    convMatrix[2][2] = standardMatrix[0][0] * standardMatrix[1][1] - standardMatrix[0][1] * standardMatrix[1][0];
    for (var i = 0; i < 3; ++i) {
        for (var j = 0; j < 3; ++j) {
            convMatrix[i][j] /= determinate;
        }
    }
    convMatrix[0][1] *= -1;
    convMatrix[1][0] *= -1;
    convMatrix[1][2] *= -1;
    convMatrix[2][1] *= -1;
}

export function GPStoCartesian(longitude, latitude) {
    // Converts GPS to standard basis Cartesian coordiantes
    // Assumes longitude and latitude are given in radians
    var coord = [];
    coord.push(EARTH_RADIUS * Math.cos(latitude) * Math.cos(longitude)); // X coordinate
    coord.push(EARTH_RADIUS * Math.cos(latitude) * Math.sin(longitude)); // Y coordinate
    coord.push(EARTH_RADIUS * Math.sin(latitude)); // Z coordinate
    return coord.slice();
}

export function GPStoCoord(longitude, latitude) {
    // Converts GPS lat long to Cartesian coordinates measured in meters
    var standardCart = GPStoCartesian(longitude, latitude);
    var result = [0, 0];
    // Shift so that our reference coordinate is the origin
    standardCart[X] -= refCart[X];
    standardCart[Y] -= refCart[Y];
    standardCart[Z] -= refCart[Z];
    // Convert to our basis vectors
    // Because of how we defined our basis vectors, we should be able to disregard the resulting Z-coordinate since it will be approximately 0
    result[X] = convMatrix[0][0] * standardCart[X] + convMatrix[0][1] * standardCart[Y] + convMatrix[0][2] * standardCart[Z];
    result[Y] = convMatrix[1][0] * standardCart[X] + convMatrix[1][1] * standardCart[Y] + convMatrix[1][2] * standardCart[Z];
    return result.slice();
}

export function CoordtoGPS(c) {
    // Converts a coordinate in our coordinate system to GPS longitude and latitude in RADIANS
    var standardCoord = [0, 0, 0];
    var longLat = [0, 0];
    standardCoord[X] = c[X] * ourX[X] + c[Y] * ourY[X]; // Get the X value in standard basis
    standardCoord[Y] = c[X] * ourX[Y] + c[Y] * ourY[Y]; // Get the Y value in standard basis
    standardCoord[Z] = c[X] * ourX[Z] + c[Y] * ourY[Z]; // Get the Z value in standard basis
    // Shift the origin back to the center of the Earth
    standardCoord[X] += refCart[X];
    standardCoord[Y] += refCart[Y];
    standardCoord[Z] += refCart[Z];
    longLat[0] = Math.atan2(standardCoord[Y], standardCoord[X]);
    longLat[1] = Math.asin(standardCoord[Z] / EARTH_RADIUS);
    return longLat.slice();
}
