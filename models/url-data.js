// getURLById returns the document with the given id, or throws an error
exports.getURLById = async function getURLById(dbPromise, collectionName, id) {
  // Resolve the database, then the collection
  const db = await dbPromise;
  const collection = await db.collection(collectionName);

  // Attempt to retrieve entry with given id
  const entry = await collection.find({ urlId: id });
  const entriesArray = await entry.toArray();

  // If entry exists return the entry promise, else throw an exception
  if (entriesArray.length > 0) {
    return entriesArray[0];
  }

  throw new Error(`${collectionName} does not contain a document with the id of ${id}.`);
};

// createURL first checks if a shortened url already exists, if not it creates one
exports.createURL = async function createURL(dbPromise, collectionName, url, hostname) {
  // Take the first 8 digits of a unique hexadecimal objectId to use as an shortened identifier
  const id = new require('mongodb').ObjectID();
  let urlId = id.toHexString().slice(0, 8);
  const dbUrl = url.slice(5);

  // Resolve the database, then the collection
  const db = await dbPromise;
  const collection = await db.collection(collectionName);

  // Attempt to retrieve entry with given unshortened-url
  const entry = await collection.find({ original_url: dbUrl });
  const entriesArray = await entry.toArray();

  // Avoid creating a new document if the shortened-url is already in the db
  if (entriesArray.length < 1) {
    await collection.insert({
      _id: id,
      urlId,
      original_url: dbUrl,
      short_url: hostname + urlId,
    });
  } else {
    urlId = entriesArray[0].urlId;
  }

  return { original_url: dbUrl, short_url: hostname + urlId };
};

// getDBPromise returns a promise which resolves to the db
exports.getDBPromise = async function getDBPromise(url, mongo) {
  return mongo.connect(url);
};

module.exports = exports;
