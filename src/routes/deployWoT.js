//TODO: add authentication
const logger = require("../config/logger");

const deployWoTController = require("../controllers/deployWoT.controller");

module.exports = (router) => {
  //user send the openAPI schema in the body of the request as a JSON
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /deployWoT");
    logger.debug(req.body);

    deployWoTController.deployOas(req, res);
  });
  //user sends the URL (as {"url": "someurl.com" }) that exposes a OpenAPI schema in JSON
  router.route("/url").post(async (req, res) => {
    logger.info("received a POST request at /deployWoT/url");
    logger.debug(req.body);

    deployWoTController.deployOasUrl(req, res);
  });
};
