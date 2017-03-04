// getURLById returns the document with the given id, or throws an error
exports.getURLById = async function (dbPromise, collectionName, id) {
	let db, collection, entry, entriesArray;

	// Resolve the database, then the collection
	db = await dbPromise;
	collection = await db.collection(collectionName);

	// Attempt to retrieve entry with given id
	entry = await collection.find({ urlId: id });
	entriesArray = await entry.toArray();

	// If entry exists return the entry promise, else throw an exception
	if (entriesArray.length > 0) {
		return entriesArray[0];
	}
	else {
		throw `${collectionName} does not contain a document with the id of ${id}.`
	}
}

// createURL first checks if a shortened url already exists, otherwise it creates one
exports.createURL = async function (dbPromise, collectionName, url, hostname) {
	let db, collection, id, urlId;

	id = new require('mongodb').ObjectID();
	urlId = id.toHexString().slice(0, 8);
	url = url.slice(5);

	// Resolve the database, then the collection
	db = await dbPromise;
	collection = await db.collection(collectionName);

	// Attempt to retrieve entry with given url
	entry = await collection.find({ original_url: url });
	entriesArray = await entry.toArray();

	// Avoid creating a new document if the url is already in the db
	if (entriesArray.length < 1) {
		// Create the new URL document
		await collection.insert({
			_id: id,
			urlId: urlId,
			original_url: url,
			short_url: hostname + urlId
		});
	}
	else {
		// Retrieve the already existent document
		urlId = entriesArray[0].urlId;
	}

	return {original_url: url, short_url: hostname + urlId};
}

// getDBPromise returns a promise which resolves to the db
exports.getDBPromise = async function(url, mongo) {
	return mongo.connect(url);
}

module.exports = exports;