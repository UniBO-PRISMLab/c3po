const logger = require("../logger");
const validUrl = require("valid-url");

const translateOpenApi = require("../utils/translateOAS");
const openApiRequest = require("../repositories/openApiRequest");

module.exports = (router) => {
  //user send the openAPI schema in the body of the request as a JSON
  router.route("/").post((req, res) => {
    logger.info("received a POST request at /translateOpenApi");
    logger.debug(req.body);

    const openApi = req.body;
    translateOpenApi(openApi, (status, response) => {
      res.status(status).send(response);
    });
  });
  //user sends the URL (as {"url": "someurl.com" }) that exposes a OpenAPI schema in JSON
  router.route("/url").post(async (req, res) => {
    logger.info("received a POST request at /translateOpenApi/url");
    logger.debug(req.body);

    const url = req.body.url;
    if (validUrl.isUri(url)) {
      try {
        const openApi = await openApiRequest.getOpenApi(url);
        translateOpenApi(openApi, (status, response) => {
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
