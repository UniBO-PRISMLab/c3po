const logger = require('./logger')
const hasher = require('./hasher');

const wotRequests = require('./repositories/wotRequests');
const modronRequests = require('./repositories/modronRequests');
const arrowHeadRequests = require('./repositories/arrowHeadRequests');
const poolingMetadata = require('./poolingMetadata/modronMetadata');

const compareThings = (wotThing, arrowheadThing) => {
  return hasher(wotThing) === arrowheadThing.serviceQueryData[0].metadata.additionalProp2;
}

const serviceQueryData = (service) => service.provider.systemName === "modron";

const wotToArrowHead = async () => {
  const webThingList = await wotRequests.listWebThings();
  poolingMetadata.setTimestamp(new Date().toUTCString());

  const allWebThings = await Promise.all(webThingList.map(wotRequests.getWebThing));
  const arrowHeadResponse = await Promise.all(allWebThings.map( arrowHeadRequests.queryService(thing)));
  await iterateArrowHeadResponse(arrowHeadResponse, allWebThings);
}

const modronToArrowHead = async () => {
  const allWebThings = await modronRequests.getWebThings();
  poolingMetadata.setTimestamp(new Date().toUTCString());

  //query the modron WebThings in ArrowHead
  const arrowHeadResponse = await Promise.all(allWebThings.map(async thing =>  { 
    let arrowHeadService = await arrowHeadRequests.queryService(thing);
    arrowHeadService.serviceQueryData = arrowHeadService.serviceQueryData.filter(serviceQueryData);
    return arrowHeadService;
  })); 
  //const arrowHeadResponse = await Promise.all(allWebThings.map(arrowHeadRequests.queryService));

  await iterateArrowHeadResponse(arrowHeadResponse, allWebThings);
}


const iterateArrowHeadResponse = (arrowHeadResponse, allWebThings) => {
  let devicesUpdated = 0;
  let devicesCreated = 0;
  arrowHeadResponse.forEach((arrowHeadThing, i) => {
    logger.debug({
      modron: {
        order: i,
        value: allWebThings[i]
      }
    });
    logger.debug({
      arrowHead: {
        order: i,
        value: arrowHeadThing.serviceQueryData
      }
    });

    //if Thing does not exist as an arrowhead service, then register it
    if (arrowHeadThing.serviceQueryData.length === 0) {

      logger.info(`Thing ${allWebThings[i].td.title} does not exist in ArrowHead`)
      arrowHeadRequests.registerService(allWebThings[i])
        .then((res) => {
          poolingMetadata.addDevice(allWebThings[i].td.title);
          devicesCreated++;
          logger.info(res);
        })
        .catch((err) => logger.error(err));
    }
    //if the Thing exists, but the TDs don't match, update the arrowhead TD
    else if (!compareThings(allWebThings[i].td, arrowHeadThing)) {
      logger.info(`Thing ${allWebThings[i].td.title} Thing Description does not match the existing one in ArrowHead`)

      /*       arrowHeadRequests.updateService(allWebThings[i], arrowHeadThing.serviceQueryData[0].id)
              .then((res) => {
                devicesUpdated++;
                logger.info(res);
              })
              .catch((err) => logger.error(err)); */
    } else {
      if (!poolingMetadata.getDevices().includes(allWebThings[i].td.title))
        poolingMetadata.addDevice(allWebThings[i].td.title);
      logger.info(`Thing ${allWebThings[i].td.title} is already register and up-to-date in ArrowHead with id ${arrowHeadThing.serviceQueryData[0].id}`)
    }
    if ((i + 1) === arrowHeadResponse.length) {
      poolingMetadata.setDevicesCreated(devicesCreated);
      poolingMetadata.setDevicesUpdated(devicesUpdated);
    }
  })
}

module.exports = {
  wotToArrowHead,
  modronToArrowHead
};