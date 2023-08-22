const instagram_access_token = process.env.instagram_access_token;
const instagram_user_id = process.env.instagram_user_id;
const youtube_access_token = process.env.youtube_access_token;
const youtube_playlist_id = process.env.youtube_playlist_id;

// Functions
function initApp() {
    console.log("Initializing app");
    const express = require('express');
    const path = require('path');

    // Init app
    const app = express();
    app.set('view engine', 'ejs');

    // Load static files
    app.use('/js/components/bootstrap.bundle.min.js', express.static(path.resolve(__dirname, '..', 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')));
    app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

    // Return app
    return app;
}

function loadCommonData() {
    const fs = require('fs');
    const path = require('path');

    // Locations
    console.log("Loading location data");
    const locationData = require('../data/location.json');
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
    locationData.featured = locationData.locations[locationData.featured];
    if (typeof locationData.secondary !== 'undefined') {
        locationData.secondary = locationData.locations[locationData.secondary];
    } else {
        locationData.secondary = null;
    }

    // Sorted locations
    locationData.sortedLocations = {};
    for (let [name,location] of Object.entries(locationData.locations)) {
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
        if (b[0] == 'Featured') return 0;
        const aLength = a[1].reduce((acc, cur) => {
            return acc + cur[1].length;
        }, 0);
        const bLength = b[1].reduce((acc, cur) => {
            return acc + cur[1].length;
        }, 0);
        return bLength - aLength;
    });
    
    // Reviews
    console.log("Loading review data");
    const reviews = require('../data/reviews.json');
    
    // News
    console.log("Loading news data");
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const newsletters = [];
    for (file of fs.readdirSync(path.resolve(__dirname, '..', 'public', 'files', 'newsletters')).reverse()) {
        newsletters.push({
            file: file,
            name: months[Number(file.split('_')[1].split('.')[0])-1] + ' ' + file.split('_')[0]
        })
    }

    // Return data
    return {
        locationData: locationData,
        reviews: reviews,
        newsletters: newsletters
    };
}

async function loadInstagramData() {
    const res = await fetch(`https://graph.facebook.com/${instagram_user_id}?access_token=${instagram_access_token}&fields=
        username,name,biography,media_count,followers_count,follows_count,profile_picture_url,
        media{media_type,thumbnail_url,permalink,like_count,comments_count}`)
    .then(res => res.json());

    if (res.error) {
        console.log(res.error);
        return undefined;
    }

    return res;
}

async function loadYouTubeData() {
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=3&fields=items(contentDetails(videoId))&playlistId=${youtube_playlist_id}&key=${youtube_access_token}`).then(res => res.json());

    if (res.error) {
        console.log(res.error);
        return undefined;
    }
    
    return res.items.map(item => item.contentDetails.videoId);
}

async function loadHomePageData() {
    const instagramData = loadInstagramData();
    const youtubeData = loadYouTubeData();

    return {
        instagramData: await instagramData,
        youtubeData: await youtubeData
    };
}

// Export functions
module.exports = {
    initApp,
    loadCommonData,
    loadHomePageData
};