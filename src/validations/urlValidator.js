const validUrl = require("valid-url");

module.exports = (potentialUrl) => validUrl.isUri(potentialUrl);
