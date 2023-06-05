const { initApp, loadLocationData, loadInstagramInfo } = require('./common/common.js');

// Load components
const app = initApp();
let locationData = loadLocationData();

// Load routes
app.get("/", (req, res) => {
    loadInstagramInfo().then(instagramData => {
        res.render('pages/home',{
            featured: locationData.featured,
            instagramData: instagramData
        });
    });
});

// Reload data, when requested
app.get("/.reload", (req, res) => {
    if (!process.env.reload_secret) { res.send("No reload secret"); return; }
    if (req.query.secret != process.env.reload_secret) { res.send("Invalid secret"); return; }
    locationData = loadLocationData();
    res.send("Data reloaded");
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});