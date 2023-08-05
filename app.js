const { initApp, loadCommonData, loadHomePageData } = require('./common/loadData.js');

// Load components
const app = initApp();
const locationData = loadCommonData().locationData;

// Load routes
app.get("/", (req, res) => {
    loadHomePageData().then(data => {
        res.render('pages/home',{
            featured: locationData.featured,
            secondary: locationData.secondary,
            instagramData: data.instagramData,
            youtubeData: data.youtubeData
        });
    });
});

// 404
app.get("*", (req, res) => {
    res.status(404).render('pages/error', {
      featured: locationData.featured,
      code: 404,
      message: "This page no longer exists."
    });
});

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});