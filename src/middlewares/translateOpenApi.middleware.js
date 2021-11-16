const logger = require("../config/logger");

const jsonValidator = require("../validations/jsonValidator");
const oasValidator = require("../validations/oasValidator");

const translateOpenApi = require("../services/translateOpenApi");

const translate = (openApi, callback) => {
  //*1. check if JSON is valid
  if (!jsonValidator(openApi)) {
    logger.info("Invalid JSON received - unable to translate it");
    callback(400, "Received invalid JSON");
  }
  //*2. check if OAS specification is valid
  else if (!oasValidator.isValidOAS(openApi)) {
    logger.info("Invalid OpenAPI schema received - unable to translate it");
    const response = {
      message: "Request is an invalid OpenAPI specification",
      report: oasValidator.getReport(openApi),
    };
    callback(400, response);
  } else {
    //*3. translate OAS to WoT TD
    const thingDescription = translateOpenApi(openApi);
    //*4. Reply to user
    try {
      logger.info("Replying with translated Thing Description");
      callback(200, thingDescription);
    } catch (err) {
      logger.info("Service unavailable at /translateOpenApi");
      callback(503, "Service unavailable");
    }
  }
};

module.exports = translate;
