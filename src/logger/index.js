const gConfig = require('../config/conf.json')

const pino = require("pino")({
    level: gConfig.logLevel,
    prettyPrint: {
        levelFirst: true,
        colorize: true,
        translateTime: true
    },
});

module.exports = pino;