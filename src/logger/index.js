const pino = require("pino")({
    level: "info",
    prettyPrint: {
        levelFirst: true,
        colorize: true,
        translateTime: true
    },
});

module.exports = pino;