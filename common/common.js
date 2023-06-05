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
async function loadInstagramInfo() {
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
    loadInstagramInfo
};