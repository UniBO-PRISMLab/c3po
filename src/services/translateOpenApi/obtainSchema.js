//TODO: consider OAS versions 2 and 3

const obtainSchema = (openApiPath, method) => {
  //if (method === "get") return obtainGetSchema(openApiPath);
  if (method === "post") return obtainPostSchema(openApiPath);
  if (method === "put") return obtainPutSchema(openApiPath);
  else return;
};

const obtainPutSchema = (openApiPath) => {
  if (openApiPath.parameter == null) return;
  for (const parameter of openApiPath.parameters) {
    if (parameter["in"] === "body" && parameter.schema) {
      return parameter.schema;
    }
  }
};

const obtainPostSchema = (openApiPath) => {
  if (openApiPath.parameter == null) return;
  for (const parameter of openApiPath.parameters) {
    if (parameter["in"] === "body") {
      //* note: this is not elegant, but "in" is a js reserved word,
      //* so we cannot not copy it as we did for the name property
      let { name, ...schema } = parameter;
      delete schema.in;
      return schema;
    }
  }
};

//TODO: this is a ugly function -> improve it in the future
const obtainGetSchema = (openApiPath) => {
  if (openApiPath.responses)
    if (openApiPath.responses["200"])
      if (openApiPath.responses["200"].schema)
        return openApiPath.responses["200"].schema;
      else if (openApiPath.responses["200"].content)
        if (openApiPath.responses["200"].content["application/json"])
          if (openApiPath.responses["200"].content["application/json"].schema)
            return openApiPath.responses["200"].content["application/json"]
              .schema;
  return false;
};

module.exports = obtainSchema;
