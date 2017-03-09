// Function returns true if the url is valid
module.exports = (url) => {
  const reg = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
  return reg.test(url);
};
