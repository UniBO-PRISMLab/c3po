const tdFactory = require('./factory/tdFactory')
const wotServer = require('./wotServer').getServer();
const wotServerCreation = require('./wotServer');

const createThing = (td) => {
    if (typeof wotServer === 'undefined') wotServerCreation.startServient();
    const thing = await wotServer.produce(td);
    logger.info(`Web Thing ${thing.getThingDescription().title} running in`);

}

const addProperties = (thing) => {
    for (const key in thing.properties) {
        this.thing.writeProperty(key, thing.properties[key]);
        this.thing.setPropertyReadHandler(key, async () => thing.properties[key]);
    }
}

// if (current[0].hasOwnProperty('output')) {
const addActions = (thing) => {
    thing.setActionHandler(key, async (params, options) => {

    })
};

module.exports = {
    createThing
}