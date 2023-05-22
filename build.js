const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");

// Load location-data
const locationData = require('./location-data.json');
for (var location in locationData["locations"]) { locationData["locations"][location]["id"] = location; }
const featured = locationData["locations"][locationData["featured_location"]];

// Function to compile ejs templates
const compile = function (filename, options, buildFolder) {
    const templatePath = path.resolve(__dirname, './views/pages/', filename + '.ejs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);
    fs.mkdirSync(path.resolve(__dirname,"build",buildFolder), {recursive: true});
    fs.writeFileSync(path.resolve(__dirname,"build",buildFolder,'index.html'), htmlString);
}

// Clear build folder
if (fs.existsSync(path.resolve(__dirname,"build"))) fs.rmSync(path.resolve(__dirname,"build"), {recursive: true});

// Compile templates
compile('home', {featured: featured}, '');
compile('presales', {locations: locationData["locations"]}, 'presales/');

for (var location in locationData["locations"]) {
    compile('location', {location: locationData["locations"][location]}, location + '/');
}

// Create loop over folders in public folder
for(var folder of fs.readdirSync(path.resolve(__dirname,"public"))) {
    fs.symlinkSync(path.resolve(__dirname,"public",folder), path.resolve(__dirname,"build",folder), 'dir');
}

// Copy files
exec("rsync --delete -Lacv --exclude='.*' ~/repository/build/ ~/public_html", (error, stdout, stderr) => {
    console.log(stdout);

    // Remove build folder
    fs.rmSync(path.resolve(__dirname,"build"), {recursive: true});
});