// app.js
// ======
const express = require("express")
const path = require('path')

// Init app
const app = express();
app.set('view engine', 'ejs');

// Load static files
//app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/', express.static(path.join(__dirname, 'public')))

// Load presale-data
const presaleData = require('./presale-data.json');

// Adjust presale-data to be more easily accessible
for (var location in presaleData["locations"]) {
  presaleData["locations"][location]["id"] = location;
}

// Load routes
const featured = presaleData["locations"][presaleData["featured_location"]];
app.get("/", (req, res) => {
  res.render('pages/home',
    {
      featured: featured,
      main_background: featured['images'][Math.floor(Math.random() * featured["images"].length)]
    });
});

app.get("/presales", (req, res) => {
  res.render('pages/presale',
    {
      featured: featured,
      locations: presaleData["locations"]
    });
});

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});