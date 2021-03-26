const axios = require('axios');
const jwt_decode = require('jwt-decode');

const logger = require('../logger')
const gConfig = require("../config/conf.json");
const resultHandler = require('../handlers/resultHandler');

const headerFactory = require('../factory/headers');

const wotRepositoryAddress = `http://${gConfig.wotRepository.host}:${gConfig.wotRepository.port}`;

const listWebThings = async () => {
    const headers = headerFactory.get();
    const wotRequest = axios.get(wotRepositoryAddress, { headers });
    return wotRequest.then(response => response.data).catch(resultHandler.errorHandler);
}

const getWebThing = async (url) => {
    const headers = headerFactory.get();
    const wotRequest = axios.get(url, { headers });
    return wotRequest.then(response => ({ tdURL: url ,td: response.data })).catch(resultHandler.errorHandler);
}

module.exports = {
    listWebThings,
    getWebThing
}