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

function loadLocationData() {
    console.log("Loading location data");
    const locationData = require('./location.json');
    for (let location in locationData.locations) { locationData.locations[location].id = location; }
    locationData.featured = locationData.locations[locationData.featured];
    return locationData;
}

async function loadInstagramInfo() {
    const res = await fetch(`https://graph.facebook.com/${process.env.user_id}?access_token=${process.env.access_token}&fields=
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
    loadLocationData,
    loadInstagramInfo
};