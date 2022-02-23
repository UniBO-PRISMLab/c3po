const gConfig = require("../config/conf.json");

const generateWoTUrl = (response) => {
  //console.log(response);
  return `http://${gConfig.wot.http.host}:${
    gConfig.wot.http.port
  }/${response.title.replace(/ /g, "-")}`;
};

module.exports = generateWoTUrl;
