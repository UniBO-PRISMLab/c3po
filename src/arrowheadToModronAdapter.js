
const logger = require('./logger')

const arrowHeadRequests = require('./repositories/arrowHeadRequests');
const wotCreator = require('./wotCreator')
const tdFactory = require('./factory/tdFactory');
const openApiRequest = require('./repositories/openApiRequest');
const arrowHeadMetadata = require('./poolingMetadata/arrowHeadMetadata')

const arrowheadToModron = async () => {
    logger.info("ArrowHead WoT Adapter running...")
    const allServices = (await arrowHeadRequests.getAllServices()).data;

    const filteredServices = allServices.filter((service) => "systemName" in service.provider ?
        arrowHeadMetadata.isMonitoredService(service.provider.systemName) && !(arrowHeadMetadata.existService(service.id)) : false);
    const openApi = await Promise.all(filteredServices.map(openApiRequest.getOpenApi));

    const tds = filteredServices.map((service, i) => tdFactory(service, openApi[i]));
    tds.map((td, index) => {
        wotCreator.createThing(td).then(() => {
            logger.info(`adding ${td.title} id < ${filteredServices[index].id} > as an already instantiated Web Thing`);
            arrowHeadMetadata.addService(filteredServices[index].id);
        }).catch((err) => {
            logger.error(err)
        });
    })
}

module.exports = arrowheadToModron;