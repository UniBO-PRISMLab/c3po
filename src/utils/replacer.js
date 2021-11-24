const translatorConfig = require("../config/translator.json");

//const replaceSlash = (str) => str.replace(/\//g, translatorConfig.slashSubstitute);
const replaceSlash = (str) => {
  if (str.match(/(\{)(.*?)\}/g)) str = removeParameters(str);
  return str.replace(/\//g, translatorConfig.slashSubstitute);
};

const includeSlash = (str) => {
  const regex = new RegExp(RegExp.quote(translatorConfig.slashSubstitute), "g");
  return str.replace(regex, "/");
};

RegExp.quote = (str) => str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

const formatUri = (unformattedUri) => {
  const removedMethod = unformattedUri.replace(
    /((post)|(get)|(delete)|(put)|(patch))-/g,
    ""
  );
  return includeSlash(removedMethod);
};

const removeParameters = (str) => {
  const replaceParamStart = str.replace(
    /{/g,
    translatorConfig.paramSubstitute.start
  );
  const replaceParamEnd = replaceParamStart.replace(
    /}/g,
    translatorConfig.paramSubstitute.end
  );
  return replaceParamEnd;
};

module.exports = { replaceSlash, formatUri };
