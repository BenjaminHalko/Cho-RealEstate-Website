// app.js
// ======
const express = require("express")
const path = require('path')

// Init app
const app = express();
app.set('view engine', 'ejs');

// Compile sass
const sass = require("dart-sass")
app.use('/public/css', (req, res, next) => {
  sass.renderSync({
    file: path.join(__dirname, 'public', 'scss', 'main.scss'),
    outputStyle: 'compressed'
  }, (err, result) => {
    if (err) {
      console.log(err)
      res.send('Error')
    } else {
      res.set('Content-Type', 'text/css')
      res.send(result.css.toString())
    }
  })
});

// Load static files
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