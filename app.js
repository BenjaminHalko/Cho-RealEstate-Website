const { initApp, loadLocationData, loadInstagramInfo } = require('./common/common.js');

// Load reload secret
let reloadSecret = "";
try { reloadSecret = require('./common/secret.json').reload_secret;
} catch (err) { console.log("No secret.json file found. Please create one with your reload secret."); }

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
app.get("/reload", (req, res) => {
    if (req.query.secret != reloadSecret) { res.send("Invalid secret"); return; }
    locationData = loadLocationData();
    res.send("Data reloaded");
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});