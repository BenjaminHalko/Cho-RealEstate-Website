const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Pages
const pages = [['',  path.resolve(__dirname, './views/pages/home.ejs')]];

// Load data
const { locationData, reviews, newsletters } = require('./common/common.js').loadCommonData();

// Function to compile ejs templates
const compile = function (filename, options, buildFolder, error=false) {
    console.log("Compiling " + buildFolder + " template");
    const templatePath = path.resolve(__dirname, './views/pages/', filename + '.ejs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);
    if (error) {
        fs.writeFileSync(path.resolve(__dirname,"build",buildFolder+".shtml"), htmlString);
    } else {
        fs.mkdirSync(path.resolve(__dirname,"build",buildFolder), {recursive: true});
        fs.writeFileSync(path.resolve(__dirname,"build",buildFolder,'index.html'), htmlString);
        
        pages.push([buildFolder+'/', templatePath]);
    }
}

// Function to get date of file
const getFileDate = function (filename) {
    const stats = fs.statSync(path.resolve(__dirname, filename));
    return stats.mtime.toISOString().split('T')[0];
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
compile('buy/reasons_for_realtor',{featured: locationData.featured}, 'top-5-reasons-for-using-a-realtor');
//sell
compile('sell/thinking_of_selling',{featured: locationData.featured}, 'thinking-of-selling');
compile('sell/unique_approach',{featured: locationData.featured}, 'my-unique-approach');
//other
compile('newsletter', {featured: locationData.featured, newsletters: newsletters}, 'newsletter');
compile('presales', {featured: locationData.featured, locations: locationData.sortedLocations}, 'properties');
for (let location in locationData.locations) {
    compile('location', {location: locationData.locations[location]}, location);
}
//errors
errorList = [["403","The server could not process the request, it is probably rebooting."],["404","This page no longer exists."]];
for (let error of errorList) {
    compile('error', {code: error[0], message: error[1], featured: locationData.featured}, error[0], true);
}
// Create copy of Bootstrap
console.log("Creating copy of Bootstrap");
fs.mkdirSync(path.resolve(__dirname,"build","js"), {recursive: true});
fs.copyFileSync(path.resolve(__dirname,"node_modules","bootstrap","dist","js","bootstrap.bundle.min.js"), path.resolve(__dirname,"build","js","bootstrap.bundle.min.js"));

// Create XML sitemap
console.log("Creating XML sitemap");
let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
for (let page of pages) {
    xmlString += `
    <url>
        <loc>https://kittycho.ca/${page[0]}</loc>
        <lastmod>${getFileDate(page[1])}</lastmod>
    </url>`;
}
xmlString += `
</urlset>`;
fs.writeFileSync(path.resolve(__dirname,"build","sitemap.xml"), xmlString);