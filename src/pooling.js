const logger = require('./logger')
const gConfig = require("./config/conf.json");
const arrowheadToModron = require("./arrowheadToModronAdapter");
const wotAdapter = require("./wotToArrowHeadAdapter");


let interval = gConfig.poolingInterval * 1000;

const wotRepository = () => {
    gConfig.mode.wotRepository === "modron" ? modron() : genericWoTRepository();
}

const genericWoTRepository = () => {
    try {
        wotAdapter.wotToArrowHead();
        setInterval(wotAdapter.wotToArrowHead, interval);
    } catch (err) {
        logger.error(err);
    }
};


const modron = () => {
    try {
        wotAdapter.modronToArrowHead();
        setInterval(wotAdapter.modronToArrowHead, interval);
    } catch (err) {
        logger.error(err);
    }
};

const arrowHead = () => {
    try {
        arrowheadToModron();
        setInterval(arrowheadToModron, interval);
    } catch (err) {
        logger.error(err);
    }
};

module.exports = {
    wotRepository,
    arrowHead
}
