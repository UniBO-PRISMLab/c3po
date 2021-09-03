const axios = require("axios");

const logger = require("../logger");
const headerFactory = require("../factory/headers");
const resultHandler = require("../handlers/resultHandler");
const metrics = require("../metrics/processTimestamp");

//TODO: test if parametrized IP address works

const getOpenApi = (service) => {
  logger.info(
    `querying http://${arrowHeadService.provider.address}:${arrowHeadService.provider.port}/${
      service.metadata.additionalProp1.split("/")[3]
    } to get openAPI definition`
  );
  const headers = headerFactory.get();
  const openApiRequest = axios.get(
    `http://${arrowHeadService.provider.address}:${arrowHeadService.provider.port}/${
      service.metadata.additionalProp1.split("/")[3]
    }`,
    { headers }
  );
  return openApiRequest
    .then(async (response) => {
      await metrics.setOASTimestamp(service.id, new Date().getTime());
      return response.data;
    })
    .catch(resultHandler.errorHandler);
};

module.exports = {
  getOpenApi,
};
