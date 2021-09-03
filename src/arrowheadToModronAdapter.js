const logger = require("./logger");

const arrowHeadRequests = require("./repositories/arrowHeadRequests");
const wotCreator = require("./wotCreator");
const tdFactory = require("./factory/tdFactory");
const gConfig = require("./config/conf.json");
const openApiRequest = require("./repositories/openApiRequest");
const modronRequests = require("./repositories/modronRequests");
const arrowHeadMetadata = require("./poolingMetadata/arrowHeadMetadata");
const metrics = require("./metrics/processTimestamp");

const arrowheadToModron = async () => {
  logger.info("Arrowhead WoT Adapter running...");
  const allServices = (await arrowHeadRequests.getAllServices()).data;

  const filteredServices = allServices.filter((service) => {
    metrics.setArrowheadCallTimestamp(service.id);
    return "systemName" in service.provider
      ? arrowHeadMetadata.isMonitoredService(service.provider.serviceDefinition) &&
          !arrowHeadMetadata.existService(service.id)
      : false;
  });
  
  const openApi = await Promise.all(
    filteredServices.map(openApiRequest.getOpenApi)
  );

  const tds = filteredServices.map(async (service, i) => {
    const td = tdFactory(service, openApi[i]);
    const ts = new Date().getTime();
    await metrics.setTranslatedTimestamp(service.id, ts);
    return td;
  });

  tds.map((completeTd, index) => {
    wotCreator
      .createThing(completeTd)
      .then(() => {
        logger.info(
          `adding ${completeTd.td.title} as an already instantiated Web Thing`
        );
        metrics.setDeployedTimestamp(completeTd.id, new Date().getTime());
        arrowHeadMetadata.addService(filteredServices[index].id);
        if (gConfig.mode.wotRepository === "modron")
          modronRequests
            .registerNewThing(
              `http://${gConfig.wot.host}:${
                gConfig.wot.port
              }/${completeTd.td.title.toLowerCase().replace(" ", "-")}`
            )
            .then((response) => {
              logger.info(response);
            })
            .catch((error) => {
              logger.error(error);
            });
      })
      .catch((err) => {
        logger.error(err);
      });
  });
};

module.exports = arrowheadToModron;
