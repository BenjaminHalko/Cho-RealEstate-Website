// Import modules
const fs = require('fs');

function processLocations() {
    console.log("Processing properties");
    const properties = require('../config/properties.json');

    // Loop through locations
    for (let pName in properties) {
        const property = properties[pName];
        property.id = pName;
        if (!property.isListing) { property.isListing = false; }
        
        // Load Images
        if (fs.existsSync(`./public/images/${property.id}`)) {
            property.images = fs.readdirSync(`./public/images/${property.id}`);
            const cardPath = property.images.find(filename => filename.match(/card.*/g));
            const backgroundPath = property.images.find(filename => filename.match(/background.*/g));
            
            if (cardPath) {
                property.card_image = cardPath;
                property.images.splice(property.images.indexOf(cardPath), 1);
                property.images.push(cardPath);
            }

            if (backgroundPath) {
                property.background = backgroundPath;
                property.images.splice(property.images.indexOf(backgroundPath), 1);
                property.images.push(backgroundPath);
            }
        }

        // Load PDFs
        property.pdfs = [];
        if (fs.existsSync(`./public/files/${property.id}`)) {
            let brochureData = null;
            let floorplanData = [];
            for(let file of fs.readdirSync(`./public/files/${property.id}`)) {
                const pdfData = {
                    'file': file,
                    'name': file.replace(property.id+'-', '').replace('.pdf', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                };
                if (pdfData.name === 'Brochure') {
                    pdfData.icon = 'card-list';
                    brochureData = pdfData;
                } else if (pdfData.name.includes('Floorplan') || pdfData.name == 'Floorplate') {
                    pdfData.icon = 'building';
                    floorplanData.push(pdfData);
                } else {
                    pdfData.icon = 'info-circle';
                    property.pdfs.push(pdfData);
                }
            }

            // Add brochure/floorplan
            if (floorplanData != []) {
                property.pdfs = floorplanData.concat(property.pdfs);
            }
            if (brochureData) {
                if (!floorplanData) {
                    brochureData.name = 'Brochure/Floorplan';
                }
                property.pdfs.unshift(brochureData);
            }
        }

        // State
        if (typeof property.state === 'undefined') {
            property.state = "default";
        }
    }

    // Set up sorted locations
    let sortedProperties = {};
    for (let property of Object.values(properties)) {
        if (property.state == 'featured') {
            if (typeof sortedProperties['Featured'] === 'undefined') {
                sortedProperties['Featured'] = [property];
            } else {
                sortedProperties['Featured'].push(property);
            }
        }

        if (typeof sortedProperties[property.catagory] === 'undefined') {
            sortedProperties[property.catagory] = {};
        }

        if (typeof sortedProperties[property.catagory][property.location] === 'undefined') {
            sortedProperties[property.catagory][property.location] = [property];
        } else {
            sortedProperties[property.catagory][property.location].push(property);
        }
    }

    // Sort locations
    for (let name of Object.keys(sortedProperties)) {
        if (name == 'Featured') {
            sortedProperties[name] = sortedProperties[name].sort((a,b) => { return a.name.localeCompare(b.name) });
            continue;
        }
        for(let location of Object.keys(sortedProperties[name])) {
            sortedProperties[name][location] = sortedProperties[name][location].sort((a,b) => { return a.name.localeCompare(b.name) + ((a.state == "sold") - (b.state == "sold"))*2 + ((a.state == "rented") - (b.state == "rented"))*3 + ((b.state == "featured") - (a.state == "featured"))*4 });
        }
        sortedProperties[name] = Object.entries(sortedProperties[name]).sort((a,b) => { return a[0].localeCompare(b[0]) });
    }

    sortedProperties = Object.entries(sortedProperties).sort((a,b) => {
        if (a[0] == 'Featured') return -1;
        if (b[0] == 'Featured') return 0;
        const aLength = a[1].reduce((acc, cur) => {
            return acc + cur[1].length;
        }, 0);
        const bLength = b[1].reduce((acc, cur) => {
            return acc + cur[1].length;
        }, 0);
        return bLength - aLength;
    });

    // Get featured location
    const featureData = require('../config/featured.json');
    const featured = properties[featureData.featured];
    const secondary = (typeof featureData.secondary !== 'undefined') ? properties[featureData.secondary] : null;

    // Return data
    return {
        locations: properties,
        sortedLocations: sortedProperties,
        featured: featured,
        secondary: secondary
    };
}

function processReviews() {
    console.log("Processing reviews");
    const reviews = require('../config/reviews.json');
    return reviews;
}

function processNewsletters() {
    console.log("Processing newsletters");
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const newsletters = [];
    for (file of fs.readdirSync("./public/files/newsletters").reverse()) {
        newsletters.push({
            file: file,
            name: months[Number(file.split('_')[1].split('.')[0])-1] + ' ' + file.split('_')[0]
        })
    }

    return newsletters;
}

// Export functions
module.exports = {
    processLocations,
    processReviews,
    processNewsletters
};