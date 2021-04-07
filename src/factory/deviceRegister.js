const hasher = require('../hasher')
const gConfig = require('../config/conf.json')

module.exports = (thing) => {
    //console.log(thing);
    const url = new URL(thing.tdURL);
    const hostname = url.hostname;
    const port = url.port;
    const uri = url.pathname;
    const protocol = url.protocol;
    return {
        //TODO: get current date and add a specific period instead of this hardcoded date
        endOfValidity: "2031-01-01 23:59:59",
        interfaces: [
            "HTTPS-SECURE-JSON"
        ],
        metadata: {
            additionalProp1: JSON.stringify(thing.td),
            additionalProp2: hasher(thing.td)
        },
        providerSystem: {
            address: `${protocol}://${hostname}`,
            port: port,
            systemName: gConfig.mode.wotRepository
        },
        secure: "NOT_SECURE",
        serviceDefinition: thing.td.title,
        serviceUri: uri.replace("/", ""),
        version: 0
    }
}