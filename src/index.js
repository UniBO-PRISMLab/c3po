const logger = require('./logger');
const server = require('./server');
const gConfig = require('./config/conf.json');
require('dotenv').config()

server.start()
  .then((res) => {
    logger.debug(res);
    logger.info(`WoT-ArrowHead Adapter API up and running`)
  })
  .catch((err) => {
    logger.error(err);
  });