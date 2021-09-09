const axios = require("axios");

const logger = require("../logger");
const headerFactory = require("../factory/headers");
const resultHandler = require("../handlers/resultHandler");

const getUrl = (url) => {
  logger.info(`Querying ${url}`);
  const headers = headerFactory.get();
  const response = axios.get(url, { headers });
  return response
    .then(async (response) => response.data)
    .catch(resultHandler.errorHandler);
};

module.exports = {
  getUrl,
};
