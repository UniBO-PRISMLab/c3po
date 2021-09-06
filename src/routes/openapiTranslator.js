const tdFactory = require("../factory/tdFactory");

module.exports = (router) => {
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /openapiTranslator");
    logger.debug(req);
    logger.debug(req.body);
    let openapi;
    try {
      //1. check if JSON is valid
      openapi = JSON.parse(req.body);
    } catch (e) {
      res.status(400).send("error parsing JSON");
    }
    try {
      //2. check if OAS specification is valid
      OpenApiValidator.middleware({
        apiSpec: openapi,
        validateRequests: true,
        validateResponses: true,
      });
      if (checkOas(openapi))
        res.status(400).send("Request is an invalid OpenAPI specification ");
      //3. translate oas to WoT TD
      const thingDescription = tdFactory(openapi);
      //4. Reply to user
      res.status(200).json(thingDescription);
    } catch (err) {
      res.status(503).send("Service unavailable");
    }
  });
};

