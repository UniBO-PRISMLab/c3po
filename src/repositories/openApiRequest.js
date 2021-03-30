const axios = require('axios');

const logger = require('../logger');
const headerFactory = require('../factory/headers')
const resultHandler = require('../handlers/resultHandler')

const getOpenApi = (service) => {
    logger.info(`querying ${service.metadata.additionalProp1} to get openAPI definition`);
    const headers = headerFactory.get();
    const openApiRequest = axios.get(service.metadata.additionalProp1, { headers });
    return openApiRequest.then(response => response.data).catch(resultHandler.errorHandler);
}

module.exports = {
    getOpenApi
}