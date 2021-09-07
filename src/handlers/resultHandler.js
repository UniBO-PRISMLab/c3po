const util = require("util");
const logger = require("../logger");

//TODO: improve the result handlers!
const errorHandler = (error) => {
  if (error.response) {
    logger.debug(error.response);
    return Promise.reject(`Request made and server responded
      \ndata: ${util.inspect(error.response.data)}
      \nstatus: ${util.inspect(error.response.status)}
      \nURL: ${util.inspect(error.response.config.url)}`);
  } else if (error.request) {
    logger.debug(error);
    return Promise.reject(
      new Error(`The request was made but no response was received 
      \nstatus: ${util.inspect(error.response.status)}`)
    );
  } else {
    logger.debug(error);
    return Promise.reject(
      new Error(
        `Something happened in setting up the request that triggered an Error
        \nerror message: ${util.inspect(error.message)}
        \nstatus: ${util.inspect(error.response.status)}`
      )
    );
  }
};

module.exports = {
  errorHandler,
};
