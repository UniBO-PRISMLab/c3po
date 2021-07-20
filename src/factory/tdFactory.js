const logger = require("../logger");

const obtainSchema = (openApiPath, method) => {
  let schema;
  if (method === "get") schema = obtainGetSchema(openApiPath);
  else if (method === "post") schema = obtainPostSchema(openApiPath);
  else if (method === "put") schema = obtainPutSchema(openApiPath);

  return schema;
};

const obtainPutSchema = (openApiPath) => {
  if (openApiPath.put.parameters) {
    for (const parameter of openApiPath.put.parameters) {
      if (parameter["in"] === "body" && parameter.schema) {
        return parameter.schema;
      }
    }
  }
  return false;
};

const obtainPostSchema = (openApiPath) => {
  if (openApiPath.post.parameters) {
    for (const parameter of openApiPath.post.parameters) {
      if (parameter["in"] === "body") {
        //note: this is not elegant, but "in" is a js reserved word, so we cannot not copy it as we did for the name property
        let { name, ...schema } = parameter;
        delete schema.in;
        return schema;
      }
    }
  }
  return false;
};

//TODO: this is a ugly function :( -> improve it in the future
const obtainGetSchema = (openApiPath) => {
  if (openApiPath.get.responses)
    if (openApiPath.get.responses["200"])
      if (openApiPath.get.responses["200"].schema)
        return openApiPath.get.responses["200"].schema;
      else if (openApiPath.get.responses["200"].content)
        if (openApiPath.get.responses["200"].content["application/json"])
          if (
            openApiPath.get.responses["200"].content["application/json"].schema
          )
            return openApiPath.get.responses["200"].content["application/json"]
              .schema;
  return false;
};

module.exports = (arrowHeadService, openApi) => {
  //const openApi = arrowHeadService.openApi;
  const td = {
    //
    "@context": [
      "https://www.w3.org/2019/wot/td/v1",
      {
        "@language": "en",
      },
    ],
    //openApi.info.title
    id: `urn:dev:ops:${openApi.info.title
      .toLowerCase()
      .replace(" ", "-")}-${arrowHeadService.id.toString()}`,
    title: openApi.info.title.toLowerCase().replace(" ", "-"),
    securityDefinitions: {
      nosec_sc: {
        scheme: "nosec",
      },
    },
    security: ["nosec_sc"],
    description: openApi.info.description,
    //GET endpoints are read-only
    //GET and PUT endpoints are writable properties
    //all PUT -> update + path
    //what to with PATCH?
    properties: {},

    //POST  are actions
    //all POST -> add + path
    //all DELETE -> delete + path
    actions: {},
  };

  const serviceUrl = openApi.basePath
    ? `${arrowHeadService.provider.address}:${arrowHeadService.provider.port}${openApi.basePath}`
    : `${arrowHeadService.provider.address}:${arrowHeadService.provider.port}`;

  if (openApi.definitions) td.definitions = openApi.definitions;

  for (const pathRaw in openApi.paths) {
    if (!pathRaw.includes("/{")) {
      const path = formatEndpoint(pathRaw); //pathRaw.replace('/', '');
      //const application = "application/json";
      if ("get" in openApi.paths[pathRaw]) {
        td.properties[path] = {
          readOnly: true,
        };
        if (
          "get" in openApi.paths[pathRaw] &&
          "put" in openApi.paths[pathRaw]
        ) {
          td.properties[path].readOnly = false;
          td.properties[path].writeOnly = false;
        }

        if ("description" in openApi.paths[pathRaw]["get"])
          td.properties[path].description =
            openApi.paths[pathRaw]["get"].description;
        if ("summary" in openApi.paths[pathRaw]["get"])
          if (td.properties[path].description !== undefined)
            td.properties[
              path
            ].description += ` summary:${openApi.paths[pathRaw]["get"].summary}`;
          else
            td.properties[
              path
            ].description = `summary:${openApi.paths[pathRaw]["get"].summary}`;

        const schema = obtainSchema(openApi.paths[pathRaw], "get");
        if (schema) td.properties[path] = { ...td.properties[path], ...schema };
      } else if ("put" in openApi.paths[pathRaw]) {
        td.properties[path] = {
          writeOnly: true,
        };
        if ("description" in openApi.paths[pathRaw]["put"])
          td.properties[path].description =
            openApi.paths[pathRaw]["put"].description;

        if ("summary" in openApi.paths[pathRaw]["put"])
          if (td.properties[path].description !== undefined)
            td.properties[
              path
            ].description += ` summary:${openApi.paths[pathRaw]["put"].summary}`;
          else
            td.properties[
              path
            ].description = `summary:${openApi.paths[pathRaw]["put"].summary}`;
        const schema = obtainSchema(openApi.paths[pathRaw], "put");

        if (schema) td.properties[path].schema = schema;
      }

      if ("post" in openApi.paths[pathRaw]) {
        td.actions[path] = {};
        if ("description" in openApi.paths[pathRaw]["post"])
          td.actions[path].description =
            openApi.paths[pathRaw]["post"].description;

        if ("summary" in openApi.paths[pathRaw]["post"])
          if (td.actions[path].description !== undefined)
            td.actions[
              path
            ].description += ` summary:${openApi.paths[pathRaw]["post"].summary}`;
          else
            td.actions[
              path
            ].description = `summary:${openApi.paths[pathRaw]["post"].summary}`;

        const schema = obtainSchema(openApi.paths[pathRaw], "post");
        if (schema) td.actions[path].input = schema;
      }

      if ("delete" in openApi.paths[pathRaw]) {
        const actionName = "delete" + capitalize(path);
        td.actions[actionName] = {};
        if ("description" in openApi.paths[pathRaw]["delete"])
          td.actions[actionName].description =
            openApi.paths[pathRaw]["delete"].description;
        if ("summary" in openApi.paths[pathRaw]["delete"])
          if (td.actions[path].description !== undefined)
            td.actions[
              path
            ].description += ` summary:${openApi.paths[pathRaw]["delete"].summary}`;
          else
            td.actions[
              path
            ].description = `summary:${openApi.paths[pathRaw]["delete"].summary}`;
      }
    }
  }
  return { td: td, serviceUrl: serviceUrl, id: arrowHeadService.id };
};

const formatEndpoint = (pathRaw) => pathRaw.substring(1).replace(/\//g, "--");

//This function formats endpoints to td affordances names, as:
// /example -> example
// /another/example -> anotherExample
//const formatEndpoint = (pathRaw) => pathRaw.replace('/', '').split('/').reduce((acc, curr) => acc + capitalize(curr));
//const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1);
