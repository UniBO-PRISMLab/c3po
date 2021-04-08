const axios = require('axios');
const jwt_decode = require('jwt-decode');

const logger = require('../logger')
const gConfig = require("../config/conf.json");
const resultHandler = require('../handlers/resultHandler');

const headerFactory = require('../factory/headers');
const modronQueriesFactory = require('../factory/modronQueries');

const modronAddress = `https://${gConfig.wotRepository.host}`;

const token = {};

const tokenRefresher = async () => {
    token.encodedToken = await getToken();
    token.value = `Bearer ${token.encodedToken}`;
    token.decodedToken = jwt_decode(token.encodedToken);

    logger.info(`refreshed Modron token - valid until ${new Date(token.decodedToken.exp * 1000).toUTCString()}`);
    setTimeout(tokenRefresher, tokenRefreshTime(token.decodedToken))
}

//we request a new token when half of its validation period has passed
const tokenRefreshTime = (token) => (token.exp - token.iat) * 500;

const getToken = async () => {
    const query = modronQueriesFactory.login();
    const headers = headerFactory.post();
    const response = await sendRequest(query, { headers });
    return response.data.login.token;
}

const getWebThings = async () => {
    const query = modronQueriesFactory.getAll();
    const headers = headerFactory.postAuth(token.value);

    const response = await sendRequest(query, { headers });
    logger.debug(response.data.viewer.things[0].tdURL)
    return response.data.viewer.things;
}

const registerNewThing = async (tdURL) => {
    const query = modronQueriesFactory.registerThing(tdURL);
    const headers = headerFactory.postAuth(token.value);
    const response = await sendRequest(query, { headers });
    //maybe response.data.createThing
    return response.data;
}

const sendRequest = async (payload, axiosConfig) => {
    const modronRequest = axios.post(`${modronAddress}/graphql`, payload, axiosConfig);
    return modronRequest.then(response => response.data).catch(resultHandler.errorHandler);
}

module.exports = {
    tokenRefresher,
    getToken,
    getWebThings,
    registerNewThing
}