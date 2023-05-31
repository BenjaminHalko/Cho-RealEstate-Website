const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// Load location-data
console.log("Loading location data");
const locationData = require(path.join(__dirname,'..','location-data.json'));
for (var location in locationData["locations"]) { locationData["locations"][location]["id"] = location; }

// Load instagram-data
console.log("Loading instagram data");
const instagramData = require('./data.json');

// Compile home template
const options = {featured: locationData["locations"][locationData["featured_location"]], instagramData: instagramData};
const templatePath = path.join(__dirname, '..', 'views', 'pages', 'home.ejs');
const templateStr = fs.readFileSync(templatePath, 'utf8');
const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);

// Write home template
fs.writeFileSync(path.join(process.env.HOME,'public_html','index.html'), htmlString);