const express = require('express');
const urlMatch = require('../helpers/url-match');
const urlData = require('../models/url-data');
const mongo = require('mongodb').MongoClient;

// Initialise
const router = express.Router();
const URL = process.env.MONGOLAB_URI;
const dbPromise = urlData.getDBPromise(URL, mongo).catch(console.log);

// Handles the shortened urls
router.get('/:id', (request, response) => {
	let id = request.params.id;
	
	if (/[0-9a-f]{8}/.test(id)) {
		// Valid id
		urlData.getURLById(dbPromise, 'URLs', id).then((urlObj) => {
			response.redirect(urlObj['original_url']);
		}).catch(console.log);
	}
	else {
		// Invalid id
		response.sendStatus(404);
	}
});

// Handles the urls which are to be shortened
router.get('/new/*', (request, response) => {
	const details = require('url').parse(request.url);
	let url = details.pathname;
	let hostname = request.headers.host + '/';

	if (urlMatch(url)) {
		// Valid url
		urlData.createURL(dbPromise, 'URLs', url, hostname)
		.then(function resolved(json) {
			response.json(json);	
		}, function rejected(error) {
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