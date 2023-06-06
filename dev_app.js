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

// ABOUT
app.get("/bio", (req, res) => {
  res.render('pages/about/bio',{
    featured: locationData.featured
  });
});

app.get("/testimonials", (req, res) => {
  res.render('pages/about/testimonials',{
    featured: locationData.featured,
    reviews: reviews
  });
});

// BUY
app.get("/thinking-of-buying", (req, res) => {
  res.render('pages/buy/thinking_of_buying',{ featured: locationData.featured });
});

app.get("/first-time-home-buyers", (req, res) => {
  res.render('pages/buy/first_time_buyers',{ featured: locationData.featured });
});

app.get("/cost-in-buying-a-home", (req, res) => {
  res.render('pages/buy/home_cost',{ featured: locationData.featured });
});

app.get("/mortgage-payment-calculator", (req, res) => {
  res.render('pages/buy/mortgage_calc',{ featured: locationData.featured });
});

// OTHER
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