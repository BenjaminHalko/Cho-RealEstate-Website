require('dotenv').config('.env');
const { initApp, loadLocationData, loadInstagramData } = require('./common/common.js');

// Load components
const app = initApp();
const locationData = loadLocationData();
const reviews = require('./common/reviews.json');

// Load routes
app.get("/", (req, res) => {
  loadInstagramData().then(instagramData => {
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

app.get("/testimonials", (req, res) => {
  res.render('pages/testimonials',{
    featured: locationData.featured,
    reviews: reviews
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