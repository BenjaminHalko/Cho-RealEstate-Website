const user_id = process.env.user_id;
const access_token = process.env.access_token;

// Functions
function initApp() {
    console.log("Initializing app");
    const express = require('express');
    const path = require('path');

    // Init app
    const app = express();
    app.set('view engine', 'ejs');

    // Load static files
    app.use('/js', express.static(path.resolve(__dirname, '..', 'node_modules/bootstrap/dist/js')));
    app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

    // Return app
    return app;
}

function loadCommonData() {
    const fs = require('fs');
    const path = require('path');

    // Locations
    console.log("Loading location data");
    const locationData = require('./location.json');
    for (let location in locationData.locations) {
        locationData.locations[location].id = location;
        locationData.locations[location].images = fs.readdirSync(path.resolve(__dirname, '..', 'public', 'images', 'locations', location));
    }
    locationData.featured = locationData.locations[locationData.featured];

    // Reviews
    console.log("Loading review data");
    const reviews = require('./reviews.json');
    
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
    const res = await fetch(`https://graph.facebook.com/${user_id}?access_token=${access_token}&fields=
        username,name,biography,media_count,followers_count,follows_count,profile_picture_url,
        media{caption,media_url,media_type,thumbnail_url,permalink,like_count,comments_count}`)
    .then(res => res.json());

    if (res.error) {
        console.log(res.error);
        return undefined;
    }

    return await res;
}

// Export functions
module.exports = {
    initApp,
    loadCommonData,
    loadInstagramData
};