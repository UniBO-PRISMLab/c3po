const logger = require('./config/logger');
const server = require('./server');
require('dotenv').config()

server.start()
  .then((res) => {
    logger.debug(res);
    logger.info(`Translator up and running`)
  })
  .catch((err) => {
    logger.error(err);
  });

// TODO: 1. user can provide a complete TD with metadata to be translated into;
// TODO: 2. user can provide a link, to fetch the OAS to be later translated into TD;
// TODO: In both cases the user can choose to deploy the WT - and where to deploy it to