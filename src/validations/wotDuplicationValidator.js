const request = require("../utils/request");

const isWoTDeployed = async (url) => {
  try {
    await request.getUrl(url);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = isWoTDeployed;
