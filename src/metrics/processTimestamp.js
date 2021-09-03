const fs = require("fs");

const logger = require("../logger");
const gConfig = require("../config/conf.json");
const metricsArray = [];


const recordCompleteTimestamp = (metrics, id) => {
  const formattedMetrics = `${id};${metrics.oas};${metrics.translated};${metrics.elapsedTime}\n`;
  fs.appendFile(gConfig.metrics.filename, `${id};${metrics}`, (err) => {
    if (err) return console.log(err);
    logger.info(`file wrote - ${formattedMetrics}`);
  });
};

const setOASTimestamp = (id, timestamp) => {
  metricsArray[id]["oas"] = timestamp;
};

const setTranslatedTimestamp = (id, timestamp) => {
  metricsArray[id]["translated"] = timestamp;
  metricsArray[id]["elapsedTime"] = metricsArray[id]["translated"] - metricsArray[id]["oas"];
  recordCompleteTimestamp(metricsArray[id], id);
};



module.exports = {
  setOASTimestamp,
  setTranslatedTimestamp,
};
