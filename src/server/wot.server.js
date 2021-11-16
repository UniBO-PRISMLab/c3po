const Servient = require("@node-wot/core").Servient;
const HttpServer = require("@node-wot/binding-http").HttpServer

const gConfig = require('../config/conf.json')

const wot = {
    "wotServer": undefined,
    async startServer() {
        const servient = new Servient();
        servient.addServer(new HttpServer({ port: gConfig.wot.port }));
        this.wotServer = await servient.start();
    },
    getServer() {
        return this.wotServer;
    }
}

module.exports = wot;
