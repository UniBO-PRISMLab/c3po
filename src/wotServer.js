const Servient = require("@node-wot/core").Servient;
const HttpClientFactory = require("@node-wot/binding-http").HttpClientFactory;
const Helpers = require("@node-wot/core").Helpers;
const HttpServer = require("@node-wot/binding-http").HttpServer

const gConfig  = require('./config/conf.json')
const logger = require('./logger');

let wotServer;

const startServient = async () => {
    const servient = new Servient();
    servient.addServer(new HttpServer({ port: gConfig.wot.port }));
    wotServer = await servient.start();
    // servient.addClientFactory(new HttpClientFactory(null)); //maybe {host:"localhost", port:"8080"} ?
    //const HttpServerInstance = new HttpServer({ port: 3000 });
    //servient.addServer(HttpServerInstance);
}

const getServer = async() => wotServer;

module.exports = {
    startServient,
    getServer
};
