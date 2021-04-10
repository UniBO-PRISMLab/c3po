const logger = require('../logger');
const gConfig = require('../config/conf.json')

class ModronMetadata {
    constructor() {
        this.lastWoTRepositoryCall = {
            timestamp: "never",
            devicesCreated: 0,
            devicesUpdated: 0
        }
        this.devices = [];
        this.mode = gConfig.mode.wotRepository;
    }

    setTimestamp(timestamp) {
        logger.info(`new call to Modron at ${timestamp}`);
        this.lastWoTRepositoryCall.timestamp = timestamp;
    }

    setDevicesCreated(devicesCreated) {
        this.lastWoTRepositoryCall.devicesCreated = devicesCreated;

    }

    setDevicesUpdated(devicesUpdated) {
        this.lastWoTRepositoryCall.devicesUpdated = devicesUpdated;
    }

    setDevices(devices) {
        this.devices = devices;
    }

    addDevice(device) {
        this.devices.push(device);
    }

    deleteDevice(device) {
        this.devices.pop(device);
    }


    getDevices() {
        return this.devices;
    }

    get() {
        return this;
    }
}

module.exports = new ModronMetadata();