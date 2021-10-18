const axios = require("axios");

const wot = require("./wotServer");
const logger = require("../config/logger");
const gConfig = require("../config/conf.json");
const resultHandler = require("../handlers/resultHandler");
const headerFactory = require("../factory/headers");

const createThing = async (td, serviceUrl) => {
  if (typeof wot.getServer() === "undefined") await wot.startServer();
  const thing = await wot.getServer().produce(td);

  for (const key in thing.properties) {
    logger.info(
      `setting ${key} property handler of ${
        td.title
      } Thing to ${serviceUrl}"/"${key.replace(/--/g, "/")}`
    );

    if (!thing.properties[key].readOnly) {
      thing.setPropertyWriteHandler(key, async (input) => {
        const headers = headerFactory.put();
        const propertyRequest = axios.put(
          `${serviceUrl}"/"${key.replace(/--/g, "/")}`,
          input,
          { headers }
        );
        logger.info(
          `performing PUT request for ${key} property of ${
            td.title
          }  at ${`${serviceUrl}"/"${key.replace(/--/g, "/")}`}`
        );
        return propertyRequest
          .then((response) => response.data)
          .catch(resultHandler.errorHandler);
      });
    }
    if (!thing.properties[key].writeOnly)
      thing.setPropertyReadHandler(key, async () => {
        const headers = headerFactory.get();
        const propertyRequest = axios.get(
          `${serviceUrl}"/"${key.replace(/--/g, "/")}`,
          { headers }
        );
        logger.info(
          `performing GET request for ${key} property of ${
            td.title
          } Thing at ${`${serviceUrl}"/"${key.replace(/--/g, "/")}`}`
        );
        return propertyRequest
          .then((response) => response.data)
          .catch(resultHandler.errorHandler);
      });
  }

  for (const key in thing.actions) setAction(thing, key, serviceUrl, td.title);

  await thing.expose();

  logger.info(
    `Web Thing ${thing.getThingDescription().title} exposed at ${
      gConfig.wot.port
    }/${thing.getThingDescription().title}`
  );
};

const setAction = (thing, actionName, serviceUrl, title) => {
  thing.setActionHandler(actionName, async (input) => {
    const url = serviceUrl + "/" + actionName.replace(/--/g, "/");

    const headers = headerFactory.post();
    if (actionName.includes("delete")) {
      const actionDeleteRequest = axios.delete(url, { headers });
      logger.info(
        `setting ${actionName} action handler of ${title} thing to ${url}`
      );
      return actionDeleteRequest
        .then((response) => response.data)
        .catch(resultHandler.errorHandler);
    } else {
      const actionPostRequest = axios.post(url, input, { headers });
      logger.info(
        `performing ${actionName} action of ${title} thing to ${url} - input: ${JSON.stringify(
          input
        )}`
      );
      return actionPostRequest
        .then((response) => {
          logger.info(response.data);
          return response.data;
        })
        .catch(resultHandler.errorHandler);
    }
  });
};

module.exports = {
  createThing,
};
