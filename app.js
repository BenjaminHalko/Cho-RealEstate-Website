// app.js
// ======
const express = require("express")
const path = require('path')

// Init app
const app = express();
app.set('view engine', 'ejs');

// Load static files
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/', express.static(path.join(__dirname, 'public')))

// Load presale-data
const presaleData = require('./presale-data.json');

// Load routes
const featured = presaleData["locations"][presaleData["featured-location"]];
app.get("/", (req, res) => {
  res.render('pages/home',
    {
      featured: presaleData["featured-location"],
      main_background: featured["images"][Math.floor(Math.random() * featured["images"].length)]
    });
});

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});