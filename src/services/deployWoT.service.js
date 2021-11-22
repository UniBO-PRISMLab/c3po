const axios = require("axios");

const logger = require("../config/logger");
const wot = require("../server/wot.server");
const gConfig = require("../config/conf.json");

const resultHandler = require("../utils/handlers/resultHandler");
const headerFactory = require("../utils/headers");
const replacer = require("../utils/replacer");

const createThing = async (td, serviceUrl) => {
  if (typeof wot.getServer() === "undefined") await wot.startServer();
  const thing = await wot.getServer().produce(td);

  for (const key in thing.properties) {
    logger.info(
      `setting ${key} property handler of ${
        td.title
      } Thing to ${serviceUrl}/${replacer.formatUri(key)}`
    );

    if (key.includes("put-")) {
      thing.setPropertyWriteHandler(key, async (input) => {
        const headers = headerFactory.put();
        const propertyRequest =  axios.put(
          `${serviceUrl}/${replacer.formatUri(key)}`,
          input,
          { headers }
        );
        logger.info(
          `performing PUT request for ${key} property of ${
            td.title
          }  at ${`${serviceUrl}/${replacer.formatUri(key)}`}`
        );
        return propertyRequest
          .then((response) => {
            logger.info("PUT response:");
            console.log(response.data);
            response.data
          })
          .catch(resultHandler.errorHandler);
      });
    }
    if (key.includes("get-"))
      thing.setPropertyReadHandler(key, async () => {
        const headers = headerFactory.get();
        const propertyRequest =  axios.get(
          `${serviceUrl}/${replacer.formatUri(key)}`,
          { headers }
        );
        logger.info(
          `performing GET request for ${key} property of ${
            td.title
          } Thing at ${`${serviceUrl}/${replacer.formatUri(key)}`}`
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
  thing.setActionHandler(actionName, async (input=false) => {
    const url = `${serviceUrl}/${replacer.formatUri(actionName)}`;

    const headers = headerFactory.post();
    if (actionName.includes("delete-")) {
      const request = {headers: headers};
      if(input) request.data = input;
      const actionDeleteRequest = axios.delete(url, request);
      logger.info(
        `performing ${actionName} action of ${title} thing to ${url} - input: ${JSON.stringify(
          input
        )}`
      );
      return actionDeleteRequest
        .then((response) => response.data)
        .catch(resultHandler.errorHandler);
    } else if (actionName.includes("post-")) {
      logger.info(url);
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

module.exports = createThing;
