const express = require('express');
const urlMatch = require('../helpers/url-match');
// const urlData = require('../models/url-data');
const createURL = require('../models/createURL');
const getURLById = require('../models/getURLById');
const mongo = require('mongodb').MongoClient;
const getDBPromise = require('../models/getDBPromise.js');

// Initialise the router, mongodb URL and resolve the db connection
const router = express.Router();
const URL = process.env.MONGOLAB_URI;
const dbPromise = getDBPromise(URL, mongo).catch(console.log);

// Handles GET requests with a particular id (shortened urls)
router.get('/:id', (request, response) => {
  const id = request.params.id;

  // ID must be an 8 character hexadecimal string
  if (/[0-9a-f]{8}/.test(id)) {
    getURLById(dbPromise, 'URLs', id)
      .then((urlObj) => {
        // Succesfully retrieved the URL
        response.redirect(urlObj.original_url);
      })
      .catch((error) => {
        // Unable to retrieve a URL with the given id
        console.error(error);
        response.sendStatus(500);
      });
  } else {
    // ID is invalid
    response.sendStatus(404);
  }
});

// Handles GET requests to /new, which create a new  URL db entry
router.get('/new/*', (request, response) => {
  const url = require('url').parse(request.url).pathname;
  const hostname = `${request.headers.host}/`;

  if (urlMatch(url)) {
    // URL passes regex test, confirming it is a valid URL
    createURL(dbPromise, 'URLs', url, hostname)
      .then((jsonURL) => {
        // URL successfully created
        response.json(jsonURL);
      })
      .catch((error) => {
        // Likely some type of db error
        console.error(error);
        response.sendStatus(500);
      });
  } else {
    // Not a URL
    response.status(404).json({ original_url: url, short_url: null, error: true });
  }
});

// Handles remaining routes
router.get('*', (request, response) => {
  response.send('oopsie');
});

module.exports = router;
