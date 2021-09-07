const axios = require("axios");

const logger = require("../logger");
const headerFactory = require("../factory/headers");
const resultHandler = require("../handlers/resultHandler");

const getOpenApi = (url) => {
  logger.info(`querying ${url} to get openAPI definition`);
  const headers = headerFactory.get();
  const openApiRequest = axios.get(url, { headers });
  return openApiRequest
    .then(async (response) => response.data)
    .catch(resultHandler.errorHandler);
};

module.exports = {
  getOpenApi,
};
