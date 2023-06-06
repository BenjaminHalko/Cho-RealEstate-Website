const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const loadLocationData = require('./common/common.js').loadLocationData;

// Load data
const locationData = loadLocationData();
const reviews = require('./common/reviews.json');

// Function to compile ejs templates
const compile = function (filename, options, buildFolder) {
    console.log("Compiling " + buildFolder + " template");
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
//about
compile('about/bio', {featured: locationData.featured}, 'bio');
compile('about/testimonials', {featured: locationData.featured, reviews: reviews}, 'testimonials');
//buy
compile('buy/thinking_of_buying',{featured: locationData.featured}, 'thinking-of-buying');
compile('buy/first_time_buyers',{featured: locationData.featured}, 'first-time-home-buyers');
compile('buy/home_cost',{featured: locationData.featured}, 'cost-in-buying-a-home');
compile('buy/mortgage_calc',{featured: locationData.featured}, 'mortgage-payment-calculator');
//other
compile('presales', {featured: locationData.featured, locations: locationData.locations}, 'presales');
for (let location in locationData.locations) {
    compile('location', {location: locationData.locations[location]}, location);
}

// Create copy of Bootstrap
console.log("Creating copy of Bootstrap");
fs.mkdirSync(path.resolve(__dirname,"build","js"), {recursive: true});
fs.copyFileSync(path.resolve(__dirname,"node_modules","bootstrap","dist","js","bootstrap.bundle.min.js"), path.resolve(__dirname,"build","js","bootstrap.bundle.min.js"));