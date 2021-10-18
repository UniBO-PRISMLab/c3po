//TODO: add authentication
const logger = require("../config/logger");
const validUrl = require("valid-url");

const deployOpenApi = require("../utils/deployOpenApi");
const openApiRequest = require("../repositories/request");

module.exports = (router) => {
  //user send the openAPI schema in the body of the request as a JSON
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /deployWoT");
    logger.debug(req.body);

    const openApi = req.body;
    deployOpenApi(openApi, (status, response) => {
      res.status(status).send(response);
    });
  });
  //user sends the URL (as {"url": "someurl.com" }) that exposes a OpenAPI schema in JSON
  router.route("/url").post(async (req, res) => {
    logger.info("received a POST request at /deployWoT/url");
    logger.debug(req.body);

    const url = req.body.url;
    if (validUrl.isUri(url)) {
      try {
        const openApi = await openApiRequest.getUrl(url);
        deployOpenApi(openApi, (status, response) => {
          res.status(status).send(response);
        });
      } catch (err) {
        res.status(404).send(`Error fetching OpenAPI request
          \n error message: ${err}`);
      }
    } else {
      logger.info(`Invalid URL (${url}) received at /translateOpenApi/url`);
      res.status(400).send(`Received an invalid URL (${url})`);
    }
  });
};
