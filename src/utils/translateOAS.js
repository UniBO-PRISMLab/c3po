const logger = require("../logger");

const isValidJSON = require("../utils/validateJson");
const oasValidator = require("../utils/validateOAS");
const tdFactory = require("../factory/tdFactory");

module.exports = (openApi, callback) => {
  //1. check if JSON is valid
  if (!isValidJSON(openApi)) {
    logger.info("Invalid JSON received - unable to translate it");
    callback(400, "error parsing JSON");
  }
  //2. check if OAS specification is valid
  else if (!oasValidator.isValidOAS(openApi)) {
    logger.info("Invalid OpenAPI schema received - unable to translate it");
    const response = {
      message: "Request is an invalid OpenAPI specification",
      report: oasValidator.getReport(openApi),
    };
    callback(400, response);
  } else {
    //3. translate OAS to WoT TD
    const thingDescription = tdFactory(openApi);
    //4. Reply to user
    try {
      logger.info("Replying with translated Thing Description");
      callback(200, thingDescription);
    } catch (err) {
      logger.info("Service unavailable at /translateOpenApi");
      callback(503, "Service unavailable");
    }
  }
};
