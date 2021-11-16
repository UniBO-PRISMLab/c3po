const gConfig = require("../config/conf.json");

const generateWoTUrl = (response) =>
  `http://${gConfig.wot.host}:${gConfig.wot.port}/${response.title}`;

  module.exports = generateWoTUrl;