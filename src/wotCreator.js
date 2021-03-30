const axios = require('axios');

const wot = require('./wotServer');
const logger = require('./logger');
const gConfig = require('./config/conf.json')
const resultHandler = require('./handlers/resultHandler');
const headerFactory = require('./factory/headers');


const createThing = async (descriptor) => {
    const td = descriptor.td;
    if (typeof wot.getServer() === 'undefined') await wot.startServer();
    const thing = await wot.getServer().produce(td);
    for (const key in thing.properties) {
        thing.writeProperty(key, thing.properties[key]);
        thing.setPropertyReadHandler(key, async () => {
            const headers = headerFactory.get()
            const propertyRequest = axios.get(descriptor.serviceUrl + '/' + key, { headers });
            logger.info(`setting ${key} property handler of ${td.title} Thing to ${descriptor.serviceUrl + '/' + key}`);
            return propertyRequest.then(response => response.data).catch(resultHandler.errorHandler);
        });
    }
    await thing.expose();

    logger.info(`Web Thing ${thing.getThingDescription().title} exposed at ${gConfig.wot.port}/${thing.getThingDescription().title}`);

}

const addProperties = (thing, path) => {
    for (const key in thing.properties) {
        thing.writeProperty(key, thing.properties[key]);
        thing.setPropertyReadHandler(key, async () => {
            const headers = headerFactory.get()

            const propertyRequest = axios.get(path.url + '/' + key,
                { headers });
            return propertyRequest.then(response => response.data).catch(resultHandler.errorHandler);
        });
    }
}


module.exports = {
    createThing
}