const { initApp, loadLocationData, loadInstagramInfo } = require('./common/common.js');

// Load components
const app = initApp();
const locationData = loadLocationData();

// Load routes
app.get("/", (req, res) => {
  loadInstagramInfo().then(instagramData => {
    res.render('pages/home',{
      featured: locationData.featured,
      instagramData: instagramData
    });
  });
});

app.get("/bio", (req, res) => {
  res.render('pages/bio',{
    featured: locationData.featured
  });
});

app.get("/presales", (req, res) => {
  res.render('pages/presales',{
    featured: locationData.featured,
    locations: locationData.locations
  });
});

// Load location routes
for (var location in locationData.locations) {
  app.get("/" + location, (req, res) => {
    res.render('pages/location', {
      location: locationData.locations[location]
    }); 
  });
}

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});