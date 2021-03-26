const logger = require('../logger');

class ArrowHeadMetadata {
    constructor() {
        this.lastArrowHeadCall = {
            timestamp: "never",
            servicesCreated: 0,
            servicesUpdated: 0
        }
        this.services = [];
    }

    setTimestamp(timestamp) {
        logger.info(`new call to ArrowHead at ${timestamp}`);
        this.lastArrowHeadCall.timestamp = timestamp;
    }

    setServicesCreated(servicesCreated) {
        this.lastArrowHeadCall.servicesCreated = servicesCreated;

    }

    setServicesUpdated(servicesUpdated) {
        this.lastArrowHeadCall.servicesUpdated = servicesUpdated;
    }

    setServices(services) {
        this.services = services;
    }

    addDevice(device) {
        this.services.push(device);
    }

    deleteDevice(device) {
        this.services.pop(device);
    }


    getServices() {
        return this.services;
    }

    get() {
        return this;
    }
}

module.exports = new ArrowHeadMetadata();