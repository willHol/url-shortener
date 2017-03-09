module.exports = async function getURLById(dbPromise, collectionName, id) {
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
