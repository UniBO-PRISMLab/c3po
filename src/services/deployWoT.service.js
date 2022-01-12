const axios = require("axios");

const logger = require("../config/logger");
const wot = require("../server/wot.server");
const gConfig = require("../config/conf.json");

const resultHandler = require("../utils/handlers/resultHandler");
const headerFactory = require("../utils/headers");
const replacer = require("../utils/replacer");

const createThing = async (td, serviceUrl) => {
  if (typeof wot.getServer() === "undefined")
    await wot.startServer();
  const thing = await wot.getServer().produce(td);

  for (const propertyName in thing.properties) {
    logger.info(
      `setting ${propertyName} property handler of ${
        td.title
      } Thing to ${serviceUrl}/${replacer.formatUri(
        propertyName
      )}`
    );

    if (propertyName.includes("put-"))
      thing.setPropertyWriteHandler(
        propertyName,
        async (input, options = false) =>
          setAffordance(
            "put",
            serviceUrl,
            td.title,
            propertyName,
            options,
            input
          )
      );

    if (propertyName.includes("patch-")) {
      thing.setPropertyWriteHandler(
        propertyName,
        async (input, options = false) =>
          setAffordance(
            "patch",
            serviceUrl,
            td.title,
            propertyName,
            options,
            input
          )
      );
    }
    if (propertyName.includes("get-"))
      thing.setPropertyReadHandler(
        propertyName,
        async (options = false) =>
          setAffordance(
            "get",
            serviceUrl,
            td.title,
            propertyName,
            options
          )
      );

    for (const actionName in thing.actions) {
      if (actionName.includes("delete-"))
        thing.setActionHandler(
          actionName,
          async (input = false, options) =>
            setAffordance(
              "delete",
              serviceUrl,
              td.title,
              actionName,
              options,
              input
            )
        );
      if (actionName.includes("post-"))
        thing.setActionHandler(
          actionName,
          async (input, options) =>
            setAffordance(
              "post",
              serviceUrl,
              td.title,
              actionName,
              options,
              input
            )
        );
    }

    await thing.expose();

    logger.info(
      `Web Thing ${
        thing.getThingDescription().title
      } exposed at ${gConfig.wot.http.port}/${
        thing.getThingDescription().title
      }`
    );
  }
};

const setAffordance = (
  method,
  serviceUrl,
  title,
  key,
  options,
  input = false
) => {
  const uri = replacer.formatUri(key);
  const propertyRequest = setRequest[method](
    `${serviceUrl}/${uri}`,
    input
  );

  logger.network({
    thing: title,
    operation: method.toUpperCase(),
    uri: uri,
    user: `${options.data.host}:${options.data.port}`,
  });

  logger.info(
    `performing ${method.toUpperCase()} request for ${key} property of ${title}  at ${`${serviceUrl}/${uri}`}`
  );
  return propertyRequest
    .then((response) => {
      logger.info({
        msg: `${method.toUpperCase()} response`,
        response: response.data,
      });
      return response.data;
    })
    .catch(resultHandler.errorHandler);
};

const setRequest = {
  get: (url) =>
    axios.get(url, { headers: headerFactory.get() }),
  put: (url, input) =>
    axios.put(url, input, { headers: headerFactory.put() }),
  patch: (url, input) =>
    axios.patch(url, input, {
      headers: headerFactory.patch(),
    }),
  post: (url, input) =>
    axios.post(url, input, {
      headers: headerFactory.post(),
    }),
  delete: (url, input) =>
    input
      ? axios.delete(url, {
          headers: headerFactory.delete(),
          data: input,
        })
      : axios.delete(url, {
          headers: headerFactory.delete(),
        }),
};

module.exports = createThing;
