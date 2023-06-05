require('dotenv').config('.env');
const { initApp, loadInstagramInfo } = require('./common/common.js');

// Load components
const app = initApp();
const locationData = require('./common/location.json');
const featured = locationData.locations[locationData.featured];
const reviews = require('./common/reviews.json');

// Load routes
app.get("/", (req, res) => {
  loadInstagramInfo().then(instagramData => {
    res.render('pages/home',{
      featured: featured,
      instagramData: instagramData
    });
  });
});

app.get("/bio", (req, res) => {
  res.render('pages/bio',{
    featured: featured
  });
});

app.get("/reviews", (req, res) => {
  res.render('pages/reviews',{
    featured: featured,
    reviews: reviews
  });
});

app.get("/presales", (req, res) => {
  res.render('pages/presales',{
    featured: featured,
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