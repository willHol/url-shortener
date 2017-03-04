const express = require('express');
const routes = require('./controllers/index');

// Initialise
const app = express();

// Use routing middleware
app.use('/', routes);

// Export the server instance for unit tests
module.exports = app.listen(process.env.PORT || 3000);