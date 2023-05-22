const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");
const sass = require('sass');

// Compile Sass folder to CSS
for(var file of fs.readdirSync(path.resolve(__dirname,'scss'))) {
    if(file.startsWith('_')) continue;
    console.log("Compiling " + file);

    fs.writeFileSync(path.resolve(__dirname,'public','css',file.replace('.scss','.css')),
        sass.compile(path.resolve(__dirname,'scss',file), {style: "compressed"}).css
    );
}

// Load location-data
console.log("Loading location data");
const locationData = require('./location-data.json');
for (var location in locationData["locations"]) { locationData["locations"][location]["id"] = location; }
const featured = locationData["locations"][locationData["featured_location"]];

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
compile('home', {featured: featured}, '');
compile('presales', {locations: locationData["locations"]}, 'presales/');

for (var location in locationData["locations"]) {
    compile('location', {location: locationData["locations"][location]}, location + '/');
}

// Create loop over folders in public folder
console.log("Creating symlinks");
for(var folder of fs.readdirSync(path.resolve(__dirname,"public"))) {
    fs.symlinkSync(path.resolve(__dirname,"public",folder), path.resolve(__dirname,"build",folder), 'dir');
}

// Copy files
console.log("Copying files");
exec("rsync --delete -Lacv --exclude='.*' ~/repository/build/ ~/public_html", (error, stdout, stderr) => {
    console.log(stdout);

    // Remove build folder
    console.log("Removing build folder");
    fs.rmSync(path.resolve(__dirname,"build"), {recursive: true});
});