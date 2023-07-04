const { initApp, loadCommonData, loadInstagramData } = require('./common/common.js');

// Load components
const app = initApp();
const locationData = loadCommonData().locationData;

// Load routes
app.get("/", (req, res) => {
    loadInstagramData().then(instagramData => {
        res.render('pages/home',{
            featured: locationData.featured,
            secondary: locationData.secondary,
            instagramData: instagramData
        });
    });
});

// 404
app.get("*", (req, res) => {
    res.render('pages/error',{
        featured: locationData.featured,
        code: "404",
        message: "This page no longer exists."
    });
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});