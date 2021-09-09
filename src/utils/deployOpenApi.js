const logger = require("../logger");
const gConfig = require("../config/conf.json");
const wotCreator = require("../wot/wotCreator");
const translateOpenApi = require("./translateOAS");
const request = require("../repositories/request");
const getProxyUrl = require("./getProxyUrl");

module.exports = (openApi, callback) => {
  translateOpenApi(openApi, async (status, response) => {
    //means that the OpenAPI was translated to a valid TD
    if (status === 200) {
      const wotHost = `http://${gConfig.wot.host}:${gConfig.wot.port}/${response.title}`;
      //check if the Web Thing has not been already deployed
      if (await isWoTDeployed(wotHost)) {
        const conflictMessage = `Conflict: There is already a Web Thing deployed as ${response.title}`;
        logger.info(conflictMessage);
        callback(409, conflictMessage);
      } else {
        //get URL of REST API specified at the OpenAPI Schema
        const proxyUrl = getProxyUrl(openApi);
        //deploy the web thing
        wotCreator
          .createThing(response, proxyUrl[0])
          .then(() => {
            logger.info(`Instantiating ${response.title} as an Web Thing`);
            callback(201, {
              message: `Web Thing ${response.title} exposed`,
              exposeUrl: wotHost,
            });
            //metrics.setDeployedTimestamp(td.title, new Date().getTime());
          })
          .catch((err) => {
            logger.error(err);
          });
      }
    } else {
      //error when translating openAPI schema
      callback(status, response);
    }
  });
};

const isWoTDeployed = async (url) => {
  try {
    await request.getUrl(url);
    return true;
  } catch (err) {
    return false;
  }
};
