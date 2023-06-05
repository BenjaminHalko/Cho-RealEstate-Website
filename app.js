const fs = require('fs');
const { initApp, loadLocationData, loadInstagramData } = require('./common/common.js');

// Load components
const app = initApp();
const locationData = loadLocationData();

// Load routes
app.get("/", (req, res) => {
    loadInstagramData().then(instagramData => {
        res.render('pages/home',{
            featured: locationData.featured,
            instagramData: instagramData
        });
    });
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});