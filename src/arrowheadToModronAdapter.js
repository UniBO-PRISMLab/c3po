
const logger = require('./logger')
const decoder = require('./decoder')
const arrowHeadRequests = require('./repositories/arrowHeadRequests');

const tdFactory = require('./factory/tdFactory')


const arrowheadToModron = async () => {
    logger.info("ArrowHead WoT Adapter running...")
    const allServices = (await arrowHeadRequests.getAllServices()).data;
    const filteredServices = allServices.filter((service) => "metadata" in service ? "WSDL" in service['metadata'] : false);
    const decodedServices = filteredServices.map(decoder.decodeService);
    const tds = decodedServices.map(tdFactory);
    logger.debug(tds);
}

module.exports = arrowheadToModron;