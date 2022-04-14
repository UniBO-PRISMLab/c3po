const axios = require("axios");
const Redis = require("ioredis");

const logger = require("../config/logger");
const wot = require("../server/wot.server");
const gConfig = require("../config/conf.json");

const resultHandler = require("../utils/handlers/resultHandler");
const headerFactory = require("../utils/headers");
const replacer = require("../utils/replacer");
const isValidJSON = require("../validations/jsonValidator");
const appendFile = require("../utils/appendFile");

//TODO move redis connection in a different file
let redis;
if (gConfig.cache.enable) {
  redis = new Redis(gConfig.cache);
}

const createThing = async (td, serviceUrl) => {
  if (typeof wot.getServer() === "undefined")
    await wot.startServer();
  const thing = await wot.getServer().produce(td);

  const affordanceParams = {
    serviceUrl: serviceUrl,
    title: td.title,
  };

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
            affordanceParams,
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
            affordanceParams,
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
            affordanceParams,
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
              affordanceParams,
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
              affordanceParams,
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

const cache = (id, log) =>
  redis.get(id, (error, result) => {
    if (error) throw error;
    if (Math.random() <= process.env.CACHE_HIT_RATE) {
      //if (result !== null && isValidJSON(result)) {
      log.cache = true;
      return result;
    } else {
      log.cache = false;
      return;
    }
  });

const setAffordance = async (
  method,
  { serviceUrl, title },
  key,
  options,
  input = false
) => {
  const uri = replacer.formatUri(key);
  const url = `${serviceUrl}/${uri}`;

  const log = {
    thing: title,
    operation: method.toUpperCase(),
    url: url,
    user: `${options.data.host}:${options.data.port}`,
    time: Date.now(),
  };
  if (input) log.payload = input;

  try {
    logger.info(
      `performing ${method.toUpperCase()} request for ${key} property of ${title} at ${url}`
    );
    const response = await request[method](url, log); //.data;
    logger.debug({ log: log });
    appendFile(log);
    logger.debug({
      msg: `${method.toUpperCase()} response`,
      response: response,
    });
    return response;
  } catch (error) {
    resultHandler.errorHandler(error);
  }
};

const request = {
  get: async (url, log) => {
    if (gConfig.cache.enable) {
      const cacheID = `${log.thing}:${url}`;
      // logger.debug(`CacheID: ${cacheID}`);
      const cached = await cache(cacheID, log);
      if (log.cache) {
        logger.info(
          `retrieved ${url} of ${log.thing} from CACHE`
        );
        log.source = "cache";
        log.data = JSON.parse(cached);
        return log.data;
      }
    }
    const response = await axios.get(url, {
      headers: headerFactory.get(),
    });

    log.data = response.data;
    log.source = "server";

    return response.data;
  },
  put: (url, { payload }) =>
    axios.put(url, payload, {
      headers: headerFactory.put(),
    }),
  patch: (url, { payload }) =>
    axios.patch(url, payload, {
      headers: headerFactory.patch(),
    }),
  post: (url, { payload }) =>
    axios.post(url, payload, {
      headers: headerFactory.post(),
    }),
  delete: (url, { payload }) =>
    payload
      ? axios.delete(url, {
          headers: headerFactory.delete(),
          data: payload,
        })
      : axios.delete(url, {
          headers: headerFactory.delete(),
        }),
};

module.exports = createThing;
