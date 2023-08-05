require('dotenv').config('.env');
const { initApp, loadCommonData, loadHomePageData } = require('./common/common.js');

// Load components
const app = initApp();
const { locationData, reviews, newsletters } = loadCommonData();

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

app.get("/top-5-reasons-for-using-a-realtor", (req, res) => {
  res.render('pages/buy/reasons_for_realtor',{ featured: locationData.featured });
});

// SELL
app.get("/thinking-of-selling", (req, res) => {
  res.render('pages/sell/thinking_of_selling',{ featured: locationData.featured });
});

app.get("/my-unique-approach", (req, res) => {
  res.render('pages/sell/unique_approach',{ featured: locationData.featured });
});

// OTHER
app.get("/newsletter", (req, res) => {
  res.render('pages/newsletter',{ featured: locationData.featured, newsletters: newsletters });
});

app.get("/properties", (req, res) => {
  res.render('pages/presales',{
    featured: locationData.featured,
    locations: locationData.sortedLocations
  });
});

// Load location routes
for (var location in locationData.locations) {
  app.get("/" + location, (req, res) => {
    res.render('pages/location', {
      location: locationData.locations[req.url.substring(1)]
    }); 
  });
}

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