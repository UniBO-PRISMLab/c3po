const Servient = require("@node-wot/core").Servient;
const HttpServer =
  require("@node-wot/binding-http").HttpServer;
/* const MqttBrokerServer =
  require("@node-wot/binding-mqtt").MqttBrokerServer; */
const CoapServer =
  require("@node-wot/binding-coap").CoapServer;

// create Servient add MQTT binding
const gConfig = require("../config/conf.json");

const wot = {
  wotServer: undefined,
  async startServer() {
    const servient = new Servient();
    servient.addServer(
      new HttpServer({ port: gConfig.wot.http.port })
    );
    servient.addServer(new CoapServer());
/*     servient.addServer(
      new MqttBrokerServer(
        `mqtt://${gConfig.wot.mqtt.broker}:${gConfig.wot.mqtt.port}`
      )
    ); */
    this.wotServer = await servient.start();
  },
  getServer() {
    return this.wotServer;
  },
};

module.exports = wot;
