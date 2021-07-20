const fs = require("fs");

const logger = require("../logger");
const gConfig = require("../config/conf.json");
const metricsArray = [];
let lastArrowheadCall;

const setGeneralArrowheadCallTimestamp = (timestamp) => {
  lastArrowheadCall = timestamp;
};

const recordCompleteTimestamp = (metrics, id) => {
  const formattedMetrics = `${id};${metrics.arrowhead};${metrics.oas};${metrics.translated};${metrics.deployed}\n`;

  fs.appendFile(gConfig.metrics.filename, formattedMetrics, (err) => {
    if (err) return console.log(err);
    logger.info(`file wrote - ${formattedMetrics}`);
  });
};

const setArrowheadCallTimestamp = (id) => {
  metricsArray[id] = {};
  metricsArray[id]["arrowhead"] = lastArrowheadCall;
};

const setOASTimestamp = (id, timestamp) => {
  metricsArray[id]["oas"] = timestamp;
};

const setTranslatedTimestamp = (id, timestamp) => {
  metricsArray[id]["translated"] = timestamp;
};

const setDeployedTimestamp = (id, timestamp) => {
  metricsArray[id]["deployed"] = timestamp;
  recordCompleteTimestamp(metricsArray[id], id);
};

module.exports = {
  setGeneralArrowheadCallTimestamp,
  setArrowheadCallTimestamp,
  setOASTimestamp,
  setDeployedTimestamp,
  setTranslatedTimestamp,
};
