require('dotenv').config('.env');
const { initApp, loadCommonData, loadHomePageData } = require('./common/loadData.js');
const getPages = require('./common/loadPages.js').getPages;

// Load components
const app = initApp();
const { locationData, reviews, newsletters } = loadCommonData();
const pageList = getPages({locationData, reviews, newsletters});

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

for (let page of pageList.pages) {
  app.get(`/${page.name}`, (req, res) => {
    res.render(`pages/${page.template}`, page.options);
  });
}

// 404
app.get("*", (req, res) => {
  res.status(404).render(`pages/${pageList.errors[0].template}`, pageList.errors[0].options);
});

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});