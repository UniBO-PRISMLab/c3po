const logger = require("../config/logger");

const urlValidator = require("../validations/urlValidator");
const openApiRequest = require("../utils/request");
const translate = require("../middlewares/translateOpenApi.middleware");

const plainTranslate = (req, res) => {
  const openApi = req.body;
  translate(openApi, (status, response) => {
    res.status(status).send(response);
  });
};

const urlTranslate = async (req, res) => {
  const url = req.body.url;
  if (urlValidator(url)) {
    try {
      const openApi = await openApiRequest.getUrl(url);
      translate(openApi, (status, response) => {
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
};

module.exports = {
  plainTranslate,
  urlTranslate,
};
