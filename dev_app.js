const express = require("express")
const path = require('path')
const fs = require('fs')

// Init app
const app = express();
app.set('view engine', 'ejs');

// Load static files
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/', express.static(path.join(__dirname, 'public')))

// Load location-data
const locationData = require('./location-data.json');

// Load instagram-data
if (!fs.existsSync(path.resolve(__dirname,"instagram_api","data.json"))) {
  console.log("No instagram data found. Please run the instagram_api script first.");
  const instagramData = [];
} else {
  const instagramData = require('./instagram_api/data.json');
}


// Adjust location-data to be more easily accessible
for (var location in locationData["locations"]) {
  locationData["locations"][location]["id"] = location;
}

// Load routes
const featured = locationData["locations"][locationData["featured_location"]];
app.get("/", (req, res) => {
  res.render('pages/home',
    {
      featured: featured,
      instagramData: instagramData
    });
});

app.get("/presales", (req, res) => {
  res.render('pages/presales',
    {
      locations: locationData["locations"]
    });
});

// Load location routes
for (var location in locationData["locations"]) {
  app.get("/" + location, (req, res) => {
    res.render('pages/location',
      {
        location: locationData["locations"][location]
      }); 
  });
}

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});