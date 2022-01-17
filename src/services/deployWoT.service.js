const axios = require("axios");

const logger = require("../config/logger");
const wot = require("../server/wot.server");
const gConfig = require("../config/conf.json");

const resultHandler = require("../utils/handlers/resultHandler");
const headerFactory = require("../utils/headers");
const replacer = require("../utils/replacer");
const isValidJSON = require("../validations/jsonValidator");

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

const Redis = require("ioredis");
//TODO: add server host and port
const redis = new Redis();
const cache = (id, log) =>
  redis.get(id, (error, result) => {
    if (error) throw error;
    if (result !== null && isValidJSON(result)) {
      return result;
    } else {
      log.cache = false;
      return;
    }
  });

const setAffordance = async (
  method,
  serviceUrl,
  title,
  key,
  options,
  input = false
) => {
  const uri = replacer.formatUri(key);
  const url = `${serviceUrl}/${uri}`;

  const log = {
    thing: title,
    operation: method.toUpperCase(),
    uri: uri,
    user: `${options.data.host}:${options.data.port}`,
  };
  if (input) log.payload = input;

  const cached =
    method === "get" ? await cache(`${title}:${url}:${method}`, log) : false;

  logger.network(log);
  if (log.cache)
    logger.info(
      `retrieving ${method.toUpperCase()} request for ${key} property of ${title} from cache`
    );
  else
    logger.info(
      `performing ${method.toUpperCase()} request for ${key} property of ${title}  at ${url}`
    );


  try {
    const response = cached
      ? JSON.parse(cached)
      : (await request[method](url, input)).data;

    if (!log.cache && method === "get")
      redis.set(url, JSON.stringify(response));

    logger.info({
      msg: `${method.toUpperCase()} response`,
      response: response,
    });
    return response;
  } catch (error) {
    resultHandler.errorHandler(error);
  }
};

const request = {
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

//TODO: refactor cache logic to only the get of request
// TODO: add conf for user to choose to use or no the cache
//TODO: add cache parameter in the TD