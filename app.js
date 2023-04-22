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

// Load routes
app.get("/", (req, res) => {
  res.render('pages/main');
});

// Start server
app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});