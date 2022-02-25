const fs = require("fs");
const logger = require("../config/logger");
const gConfig = require("../config/conf.json");
const path = require("path");

const baseDir = path.join(
  __dirname,
  `/../config/logger/${gConfig.logFile}`
);

const writeLog = (logEntry) => {
  fs.appendFile(
    baseDir,
    JSON.stringify(logEntry) + "\r\n",
    (err) => {
      if (err) {
        logger.error(err);
        return;
      }
    }
  );
};

module.exports = writeLog;
