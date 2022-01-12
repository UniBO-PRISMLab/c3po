const gConfig = require("../config/conf.json");

const generateWoTUrl = (response) =>
  `http://${gConfig.wot.http.host}:${gConfig.wot.http.port}/${response.title}`;

  module.exports = generateWoTUrl;