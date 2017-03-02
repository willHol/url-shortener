const express = require('express');
const routes = require('./controllers/index');

// Initialise
const app = express();

app.use('/', routes);

module.exports = app.listen(process.env.PORT || 3000);