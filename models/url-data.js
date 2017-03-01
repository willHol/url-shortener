exports.getURLById = async function(dbPromise, collectionName, id) {
	let db, collection, entry, entriesArray;

	// Resolve the database, then the collection
	db = await dbPromise;
	collection = await db.collection(collectionName);


	// Attempt to retrieve entry with given id
	try {
		entry = await collection.find({ _id: id });
		entriesArray = await entry.toArray();
	}
	catch (error) {
		console.log(error.toString());
	}


	// If entry exists return the entry promise, else throw an exception
	if (entriesArray.length > 0) {
		return entriesArray[0];
	}
	else {
		throw `${collectionName} does not contain a document with the id of ${id}.`
	}
}

exports.createURL = async function (dbPromise, collectionName, url, hostname) {
	let db, collection, id, urlId;

	id = ObjectId();
	urlId = id.slice(0, 4);

	// Resolve the database, then the collection
	db = await dbPromise;
	collection = await db.collection(collectionName);

	// Create the new URL document
	await collection.insert({
		_id: id,
		urlId: urlId,
		original_url: url,
		short_url: `hostname/${urlId}`
	});
}

exports.getDBPromise = async function(url) {
	return mongo.connect(url);
}

module.exports = exports;