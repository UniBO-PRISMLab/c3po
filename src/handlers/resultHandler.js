const util = require('util');
const logger = require('../logger');

const errorHandler = (error) => {
  if (error.response) {
    logger.debug(error.response);
    return Promise.reject(`Request made and server responded
      \ndata: ${util.inspect(error.response.data)}
      \nstatus: ${util.inspect(error.response.status)}
      \nheaders:${util.inspect(error.response.headers)}
      \nURL: ${util.inspect(error.response.config.url)}`);
  } else if (error.request) {
    logger.debug(error.request);
    return Promise.reject(
      new Error(`The request was made but no response was received `
        // \n${util.inspect(error.request)}
      )
    );
  } else {
    logger.debug(error);
    return Promise.reject(
      new Error(
        `Something happened in setting up the request that triggered an Error\n${util.inspect(
          error.message
        )}`
      )
    );
  }
};

module.exports = {
  errorHandler,
};
