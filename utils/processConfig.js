// Import modules
const fs = require('fs');
const path = require('path');

function processLocations() {
    console.log("Processing locations");
    const locationData = require('../config/location.json');

    // Loop through locations
    for (let location in locationData.locations) {
        locationData.locations[location].id = location;
        if (!locationData.locations[location].isListing) { locationData.locations[location].isListing = false; }
        
        // Load Images
        if (fs.existsSync(path.resolve(__dirname, '..', 'public', 'images', location))) {
            locationData.locations[location].images = fs.readdirSync(path.resolve(__dirname, '..', 'public', 'images', location));
            const cardPath = locationData.locations[location].images.find(filename => filename.match(/card.*/g));
            const backgroundPath = locationData.locations[location].images.find(filename => filename.match(/background.*/g));
            
            if (cardPath) {
                locationData.locations[location].card_image = cardPath;
                locationData.locations[location].images.splice(locationData.locations[location].images.indexOf(cardPath), 1);
                locationData.locations[location].images.push(cardPath);
            }

            if (backgroundPath) {
                locationData.locations[location].background = backgroundPath;
                locationData.locations[location].images.splice(locationData.locations[location].images.indexOf(backgroundPath), 1);
                locationData.locations[location].images.push(backgroundPath);
            }
        }

        // Load PDFs
        locationData.locations[location].pdfs = [];
        if (fs.existsSync(path.resolve(__dirname, '..', 'public', 'files', location))) {
            let brochureData = null;
            let floorplanData = [];
            for(let file of fs.readdirSync(path.resolve(__dirname, '..', 'public', 'files', location))) {
                const pdfData = {
                    'file': file,
                    'name': file.replace(location+'-', '').replace('.pdf', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                };
                if (pdfData.name === 'Brochure') {
                    pdfData.icon = 'card-list';
                    brochureData = pdfData;
                } else if (pdfData.name.includes('Floorplan') || pdfData.name == 'Floorplate') {
                    pdfData.icon = 'building';
                    floorplanData.push(pdfData);
                } else {
                    pdfData.icon = 'info-circle';
                    locationData.locations[location].pdfs.push(pdfData);
                }
            }

            // Add brochure/floorplan
            if (floorplanData != []) {
                locationData.locations[location].pdfs = floorplanData.concat(locationData.locations[location].pdfs);
            }
            if (brochureData) {
                if (!floorplanData) {
                    brochureData.name = 'Brochure/Floorplan';
                }
                locationData.locations[location].pdfs.unshift(brochureData);
            }
        }

        // State
        if (typeof locationData.locations[location].state === 'undefined') {
            locationData.locations[location].state = "default";
        }
    }

    // Set featured location
    locationData.featured = locationData.locations[locationData.featured];
    if (typeof locationData.secondary !== 'undefined') {
        locationData.secondary = locationData.locations[locationData.secondary];
    } else {
        locationData.secondary = null;
    }

    // Set up sorted locations
    locationData.sortedLocations = {};
    for (let location of Object.values(locationData.locations)) {
        if (location.state == 'featured') {
            if (typeof locationData.sortedLocations['Featured'] === 'undefined') {
                locationData.sortedLocations['Featured'] = [location];
            } else {
                locationData.sortedLocations['Featured'].push(location);
            }
        }

        if (typeof locationData.sortedLocations[location.catagory] === 'undefined') {
            locationData.sortedLocations[location.catagory] = {};
        }

        if (typeof locationData.sortedLocations[location.catagory][location.location] === 'undefined') {
            locationData.sortedLocations[location.catagory][location.location] = [location];
        } else {
            locationData.sortedLocations[location.catagory][location.location].push(location);
        }
    }

    // Sort locations
    for (let name of Object.keys(locationData.sortedLocations)) {
        if (name == 'Featured') {
            locationData.sortedLocations[name] = locationData.sortedLocations[name].sort((a,b) => { return a.name.localeCompare(b.name) });
            continue;
        }
        for(let location of Object.keys(locationData.sortedLocations[name])) {
            locationData.sortedLocations[name][location] = locationData.sortedLocations[name][location].sort((a,b) => { return a.name.localeCompare(b.name) + ((a.state == "sold") - (b.state == "sold"))*2 + ((a.state == "rented") - (b.state == "rented"))*3 + ((b.state == "featured") - (a.state == "featured"))*4 });
        }
        locationData.sortedLocations[name] = Object.entries(locationData.sortedLocations[name]).sort((a,b) => { return a[0].localeCompare(b[0]) });
    }
    locationData.sortedLocations = Object.entries(locationData.sortedLocations).sort((a,b) => {
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

    // Return data
    return locationData;
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
    for (file of fs.readdirSync(path.resolve(__dirname, '..', 'public', 'files', 'newsletters')).reverse()) {
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