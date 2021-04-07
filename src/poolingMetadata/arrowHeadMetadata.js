const logger = require('../logger');

class ArrowHeadMetadata {
    constructor() {
        this.lastArrowHeadCall = {
            timestamp: "never",
            servicesCreated: 0
        }
        this.services = [];
        this.monitoredServicesNames = ['adapter-tester']; //'adapter-tester'
    }

    setTimestamp(timestamp) {
        logger.info(`new call to ArrowHead at ${timestamp}`);
        logger.debug(`resetting created services`);
        this.lastArrowHeadCall.servicesCreated = 0;
        this.lastArrowHeadCall.timestamp = timestamp;
    }

    setServices(service) {
        this.services = service;
    }

    addService(service) {
        this.lastArrowHeadCall.servicesCreated++;
        this.services.push(service);
    }

    deleteService(service) {
        this.services.pop(service);
    }

    existService(service) {
        return this.services.includes(service);
    }
    getServices() {
        return this.services;
    }

    getMonitoredServicesNames(){
        return this.monitoredServicesNames;
    }

    addMonitoredService(service){
        this.monitoredServicesNames.push(service);
    }

    isMonitoredService(service){
        return this.monitoredServicesNames.includes(service);
    }


    get() {
        return this;
    }
}

module.exports = new ArrowHeadMetadata();