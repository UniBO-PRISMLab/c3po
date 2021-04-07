const axios = require('axios');

const gConfig = require("../config/conf.json");
const resultHandler = require('../handlers/resultHandler');
const poolingMetadata = require('../poolingMetadata/arrowHeadMetadata')
const logger = require('../logger')

const headerFactory = require('../factory/headers');
const deviceRegisterFactory = require('../factory/deviceRegister');

const arrowHeadHost = `http://${gConfig.arrowhead.host}:${gConfig.arrowhead.port}`;

const queryService = async (thing) => {
    const payload = {
        serviceDefinitionRequirement: thing.td.title
    }

    const headers = headerFactory.post()
    const arrowHeadRequest = axios.post(`${arrowHeadHost}/serviceregistry/query`,
        payload,
        { headers });
    return arrowHeadRequest.then(response => {
        return response.data
    }).catch(resultHandler.errorHandler);
}


const registerService = async (thing) => {
    const payload = deviceRegisterFactory(thing);
    const headers = headerFactory.post();
    const arrowHeadRequest = axios.post(`${arrowHeadHost}/serviceregistry/register`,
        payload,
        { headers });
    return arrowHeadRequest.then(response => response.data).catch(resultHandler.errorHandler);
}


const updateService = async (thing, id) => {
    const payload = deviceRegisterFactory(thing);
    const headers = headerFactory.put()
    const arrowHeadRequest = axios.put(`${arrowHeadHost}/serviceregistry/mgmt/${id}`,
        payload,
        { headers });
    return arrowHeadRequest.then(response => response.data).catch(resultHandler.errorHandler);
}

const getAllServices = () => {
    const headers = headerFactory.get()
    const arrowHeadRequest = axios.get(`${arrowHeadHost}/serviceregistry/mgmt?direction=ASC&sort_field=id`,
        { headers });
    return arrowHeadRequest.then((res) => {
        poolingMetadata.setTimestamp(new Date().toUTCString());
        return successHandler(res);
    }).catch(resultHandler.errorHandler);
}

const successHandler = (response) => {
    logger.info(`arrowhead request was successfully`)
    logger.debug(response);
    return response.data;
}

const deleteService = async (thing) => {
    const headers = headerFactory.delete()
    return arrowHeadRequest = axios.delete(`${arrowHeadHost}/serviceregistry/mgmt/${thing.id}`, { headers })
}

module.exports = {
    queryService,
    registerService,
    updateService,
    getAllServices,
    deleteService
}