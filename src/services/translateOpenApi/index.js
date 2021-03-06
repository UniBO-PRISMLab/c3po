const methodSelector = require("./methodSelector");
const replacer = require("../../utils/replacer");

const translateOpenApi = (openApi) => {
  const version = openApi.openapi ? 3 : 2;
  const td = {
    "@context": [
      "https://www.w3.org/2019/wot/td/v1",
      {
        "@language": "en",
      },
    ],
    //*the id isn't a mandatory attribute and should be a unique identifier
    //id: openApi.info.title.toLowerCase().replace(" ", "-"),
    //TODO: create pattern for titles
    title: openApi.info.title.toLowerCase().replace(" " ,"-"),
    //TODO: add real securityDefinitions
    securityDefinitions: {
      nosec_sc: {
        scheme: "nosec",
      },
    },
    security: ["nosec_sc"],
    description: openApi.info.description || "",
    properties: {},
    actions: {},
  };

  if (openApi.definitions) td.definitions = openApi.definitions;

  for (const pathRaw in openApi.paths) {
    for (const operation in openApi.paths[pathRaw]) {
      const path = openApi.paths[pathRaw][operation];
      const convertedOperation = methodSelector[operation](
        path,
        formatEndpoint(pathRaw),
        version
      );
      for (const affordance in convertedOperation)
        td[affordance] = {
          ...td[affordance],
          ...convertedOperation[affordance],
        };
    }
  }
  return td;
};

const formatEndpoint = (pathRaw) => replacer.replaceSlash(pathRaw.substring(1));

module.exports = translateOpenApi;
