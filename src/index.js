const logger = require('./logger');
const server = require('./server');
const modronRequests = require('./repositories/modronRequests');
const wotServer = require('./wotServer');
const pooling = require('./pooling');
const gConfig = require('./config/conf.json');
require('dotenv').config()

const getAuth = async () => {
  if (gConfig.mode.wotRepository === "modron")
    await modronRequests.tokenRefresher()
}

server.start()
  .then((res) => {
    logger.debug(res);
    logger.info(`WoT-ArrowHead Adapter API up and running`)
  })
  .catch((err) => {
    logger.error(err);
  });

if (gConfig.mode.wotAdapter)
  wotServer.startServient()
    .then(() => {
      logger.info(`WoT Servient is up and running`)
    }).catch((err) => {
      logger.error(err);
    });


getAuth()
  .then(() => {
    if (gConfig.mode.wotAdapter)
      pooling.wotRepository();
  }).then(() => {
    if (gConfig.mode.arrowheadAdapter)
      pooling.arrowHead();
  })
  .then(response => {
    logger.info(response);
  }).catch(err => {
    logger.error(err);
  });


