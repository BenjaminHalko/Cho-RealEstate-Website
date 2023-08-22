const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const webpack = require('webpack');

const loadCommonData = require('./helper/loadData.js').loadCommonData;
const getPages = require('./helper/loadPages.js').getPages;

// Load Pages
const pageList = getPages(loadCommonData());

// Function to compile ejs templates
function compile(filename, options, buildFolder, error=false) {
    console.log("Compiling " + buildFolder + " template");
    const templatePath = path.resolve(__dirname, './views/pages/', filename + '.ejs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const htmlString = ejs.compile(templateStr, {filename: templatePath})(options);
    if (error) {
        fs.writeFileSync(path.resolve(__dirname,"build",buildFolder+".shtml"), htmlString);
    } else {
        fs.mkdirSync(path.resolve(__dirname,"build",buildFolder), {recursive: true});
        fs.writeFileSync(path.resolve(__dirname,"build",buildFolder,'index.html'), htmlString);
    }
}

// Function to get date of file
function getFileDate(templateName) {
    const stats = fs.statSync(path.resolve(__dirname, `./views/pages/${templateName}.ejs`));
    return stats.mtime.toISOString().split('T')[0];
}

// Clear build folder
if (fs.existsSync(path.resolve(__dirname,"build"))) {
    console.log("Clearing build folder");
    fs.rmSync(path.resolve(__dirname,"build"), {recursive: true});
}

// Compile templates
for(let page of pageList.pages) {
    compile(page.template, page.options, page.name);
}
for(let error of pageList.errors) {
    compile(error.template, error.options, error.name, true);
}

// Create copy of Bootstrap
console.log("Creating copy of Bootstrap.js");
fs.mkdirSync(path.resolve(__dirname,"build","js","components"), {recursive: true});
fs.copyFileSync(path.resolve(__dirname,"node_modules","bootstrap","dist","js","bootstrap.bundle.min.js"), path.resolve(__dirname,"build","js","components","bootstrap.bundle.min.js"));

// Create XML sitemap
console.log("Creating XML sitemap");
let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
for (let page of [{name: '', template: 'home'}, ...pageList.pages]) {
    xmlString += `
    <url>
        <loc>https://kittycho.ca/${page.name}</loc>
        <lastmod>${getFileDate(page.template)}</lastmod>
    </url>`;
}
xmlString += `
</urlset>`;
fs.writeFileSync(path.resolve(__dirname,"build","sitemap.xml"), xmlString);