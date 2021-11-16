const logger = require("../config/logger");

const translateOpenApiController = require("../controllers/translateOpenApi.controller");

module.exports = (router) => {
  //*user send the openAPI schema in the body of the request as a JSON
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /translateOpenApi");
    logger.debug(req.body);
    translateOpenApiController.plainTranslate(req, res);
  });

  //*user sends the URL (as {"url": "someurl.com" }) that exposes a OpenAPI schema in JSON
  router.route("/url").post(async (req, res) => {
    logger.info("received a POST request at /translateOpenApi/url");
    logger.debug(req.body);
    translateOpenApiController.urlTranslate(req, res);
  });
};
