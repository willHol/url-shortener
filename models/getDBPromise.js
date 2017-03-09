module.exports = async function getDBPromise(url, mongo) {
  return mongo.connect(url);
};
