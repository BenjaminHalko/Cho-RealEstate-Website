// Import modules
const express = require('express');

// Load .env in development mode
const development = process.env.NODE_ENV !== 'production';
if (development) require('dotenv').config();

// Load routes
const router = require('./routes/index.js')(development);

// Setup app
const app = express();
app.set('view engine', 'ejs');

// Load static files
app.use('/js/components/bootstrap.bundle.min.js', express.static('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'));
app.use('/', express.static('./public'));

// Load routes
app.use('/', router);

// Start server
app.listen(5000, () => {
    console.log('Listening on port ' + 5000);
});