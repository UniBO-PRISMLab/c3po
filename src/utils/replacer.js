const slashSubstitute = require("../config/translator.json").slashSubstitute;

const replaceSlash = (str) => str.replace(/\//g, slashSubstitute);

const includeSlash = (str) => {
  const regex = new RegExp(RegExp.quote(slashSubstitute), "g");
  return str.replace(regex, "/");
};

RegExp.quote = (str) => str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

module.exports = { replaceSlash, includeSlash };
