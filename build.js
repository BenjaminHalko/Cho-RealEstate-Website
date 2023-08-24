// Import modules
const fs = require('fs');
const ejs = require('ejs');

// Config
const { processLocations, processReviews, processNewsletters } = require('./utils/processConfig');
const getStaticPages = require('./utils/getStaticPages');

const locations = processLocations();
const reviews = processReviews();
const newsletters = processNewsletters();

// Load static pages
const pageList = getStaticPages.getStaticPages(locations, reviews, newsletters);
const errorList = getStaticPages.getErrorPages(locations);

// Function to compile ejs templates
function compile(templateName, options, buildPath) {
    console.log(`Compiling ${buildPath} template`);
    const templatePath = `./views/pages/${templateName}.ejs`;
    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);
    if (templateName == 'error') {
        fs.writeFileSync(`./build/${buildPath}.shtml`, htmlString);
    } else {
        fs.mkdirSync(`./build/${buildPath}/`, {recursive: true});
        fs.writeFileSync(`./build/${buildPath}/index.html`, htmlString);
    }
}

// Function to get date of file
function getFileDate(templateName) {
    const stats = fs.statSync(`./views/pages/${templateName}.ejs`);
    return stats.mtime.toISOString().split('T')[0];
}

// Clear build folder
if (fs.existsSync('./build')) {
    console.log('Clearing build folder');
    fs.rmSync('./build', {recursive: true});
}

// Compile templates
for(let page of pageList) {
    compile(page.template, page.options, page.name);
}
for(let error of errorList) {
    compile(error.template, error.options, error.name);
}

// Create copy of Bootstrap
console.log("Creating copy of Bootstrap.js");
fs.mkdirSync('./build/js/components', {recursive: true});
fs.copyFileSync('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', './build/js/components/bootstrap.bundle.min.js');

// Create XML sitemap
console.log("Creating XML sitemap");
let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
for (let page of [{name: '', template: 'home'}, ...pageList]) {
    xmlString += `
    <url>
        <loc>https://kittycho.ca/${page.name}</loc>
        <lastmod>${getFileDate(page.template)}</lastmod>
    </url>`;
}
xmlString += `
</urlset>`;
fs.writeFileSync('./build/sitemap.xml', xmlString);

// Done
console.log("Build complete!")