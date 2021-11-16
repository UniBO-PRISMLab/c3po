const logger = require("../config/logger");

const urlValidator = require("../validations/urlValidator");
const isWoTDeployed = require("../validations/wotDuplicationValidator");

const translate = require("../middlewares/translateOpenApi.middleware");

const generateWoTUrl = require("../utils/generateWoTUrl");
const getProxyUrl = require("../utils/getProxyUrl");
const openApiRequest = require("../utils/request");

const wotDeployService = require("../services/deployWoT.service");

const deployOas = (req, res) => {
  const openApi = req.body;
  translateAndDeploy(openApi, (status, response) => {
    res.status(status).send(response);
  });
};

const deployOasUrl = async (req, res) => {
  const url = req.body.url;
  if (urlValidator(url)) {
    try {
      const openApi = await openApiRequest.getUrl(url);
      translateAndDeploy(openApi, (status, response) => {
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

const translateAndDeploy = (openApi, callback) => {
  translate(openApi, async (status, response) => {
    //* means that the OpenAPI was translated to an invalid TD
    if (status != 200) return callback(status, response);

    const wotHost = generateWoTUrl(response);
    //*check if the Web Thing has not been already deployed
    if (await isWoTDeployed(wotHost)) {
      const conflictMessage = `Conflict: There is already a Web Thing deployed as ${response.title}`;
      logger.info(conflictMessage);
      return callback(409, conflictMessage);
    }
    //*get URL of REST API specified at the OpenAPI Schema
    const proxyUrl = getProxyUrl(openApi);
    //*deploy the web thing
    wotDeployService(response, proxyUrl[0])
      .then(() => {
        logger.info(`Instantiating ${response.title} as an Web Thing`);
        callback(201, {
          message: `Web Thing ${response.title} exposed`,
          exposeUrl: wotHost,
        });
      })
      .catch((err) => {
        logger.error(err);
        callback(500, "Internal error when deploying the proxy WoT");
      });
  });
};

module.exports = {
  deployOas,
  deployOasUrl,
};
