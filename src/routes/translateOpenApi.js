const logger = require("../logger");

const isValidJSON = require("../validation/validateJson");
const isValidOAS = require("../validation/validateOAS");
const tdFactory = require("../factory/tdFactory");

module.exports = (router) => {
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /translateOpenApi");
    logger.debug(req.body);

    const openApi = req.body;

    //1. check if JSON is valid
    if (!isValidJSON(openApi)) {
      logger.info("Invalid JSON received at /translateOpenApi");
      res.status(400).send("error parsing JSON");
    }
    //2. check if OAS specification is valid
    else if (!isValidOAS(openApi)) {
      logger.info("Invalid OpenAPI schema received at /translateOpenApi");
      res.status(400).send("Request is an invalid OpenAPI specification ");
    } else {
      //3. translate OAS to WoT TD
      const thingDescription = tdFactory(openApi);
      //4. Reply to user
      try {
        logger.info("Replying to user with translated Thing Description");
        res.status(200).json(thingDescription);
      } catch (err) {
        logger.info("Service unavailable at /translateOpenApi");
        res.status(503).send("Service unavailable");
      }
    }
  });
};
