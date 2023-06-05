const fs = require('fs');
const { initApp, loadInstagramInfo } = require('./common/common.js');

// Load components
const app = initApp();

// Load routes
app.get("/", (req, res) => {
    const locationData = JSON.parse(fs.readFileSync('./common/location.json'));
    loadInstagramInfo().then(instagramData => {
        res.render('pages/home',{
            featured: locationData.locations[locationData.featured],
            instagramData: instagramData
        });
    });
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});