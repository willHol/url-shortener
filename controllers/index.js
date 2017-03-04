const express = require('express');
const urlMatch = require('../helpers/url-match');
const urlData = require('../models/url-data');
const mongo = require('mongodb').MongoClient;

// Initialise the router, mongodb URL and resolve the db connection
const router = express.Router();
const URL = process.env.MONGOLAB_URI;
const dbPromise = urlData.getDBPromise(URL, mongo).catch(console.log);

// Handles GET requests with a particular id (shortened urls)
router.get('/:id', (request, response) => {
	// get the hexadecimal identifier for the route
	const id = request.params.id;
	
	// ID must be an 8 character hexadecimal string
	if (/[0-9a-f]{8}/.test(id)) {
		urlData.getURLById(dbPromise, 'URLs', id)
			.then(function resolved(urlObj) {
				// Handles a resolved promise containing 
				// an redirecting to the original url
				response.redirect(urlObj['original_url']);
			}, function rejected(error) {
				// Handles any errors produced by the 
				// exported async await function getURLById
				console.log(error);
			});
	}
	else {
		response.sendStatus(404);
	}
});

// Handles GET requests to /new which creates a new  URL db entry
router.get('/new/*', (request, response) => {
	const url = require('url').parse(request.url).pathname;
	const hostname = request.headers.host + '/';

	if (urlMatch(url)) {
		// URL passes regex test, confirming it is a valid URL
		urlData.createURL(dbPromise, 'URLs', url, hostname)
			.then(function resolved(json) {
				// Handles a resolved promise containing 
				// an object to send as a JSON response
				response.json(json);	
			}, function rejected(error) {
				// Handles any errors produced by the 
				// exported async await function createURL
				console.log(error);
			});
	}
	else {
		// Invalid url (url does not pass regex test)
		response.json({"original_url": url, "short_url": null, "error": true});
	}
});

// Handles remaining routes
router.get('*', (request, response) => {
	response.send('oopsie');
});

module.exports = router;