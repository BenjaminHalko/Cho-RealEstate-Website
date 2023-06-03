const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const loadLocationData = require('./common/common.js').loadLocationData;

// Load location-data
const locationData = loadLocationData();

// Function to compile ejs templates
const compile = function (filename, options, buildFolder) {
    console.log("Compiling " + filename + " template");
    const templatePath = path.resolve(__dirname, './views/pages/', filename + '.ejs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);
    fs.mkdirSync(path.resolve(__dirname,"build",buildFolder), {recursive: true});
    fs.writeFileSync(path.resolve(__dirname,"build",buildFolder,'index.html'), htmlString);
}

// Clear build folder
if (fs.existsSync(path.resolve(__dirname,"build"))) {
    console.log("Clearing build folder");
    fs.rmSync(path.resolve(__dirname,"build"), {recursive: true});
}

// Compile templates
compile('bio', {featured: locationData.featured}, 'bio/');
compile('presales', {featured: locationData.featured, locations: locationData.locations}, 'presales/');

for (let location in locationData.locations) {
    compile('location', {location: locationData.locations[location]}, location + '/');
}

// Create copy of Bootstrap
console.log("Creating copy of Bootstrap");
fs.mkdirSync(path.resolve(__dirname,"build","js"), {recursive: true});
fs.copyFileSync(path.resolve(__dirname,"node_modules","bootstrap","dist","js","bootstrap.bundle.min.js"), path.resolve(__dirname,"build","js","bootstrap.bundle.min.js"));