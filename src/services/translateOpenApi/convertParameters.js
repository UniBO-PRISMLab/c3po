// * Add parameters in the translation:
// * path parameters
// * query parameters
// * header parameters
// * cookie parameters

const addParameter = (operation) => {
  const input = {
    properties: {
      parameters: {
        type: "object",
        properties: {},
      },
    },
    type: "object",
  };
  for (const parameter of operation.parameters) {
    //TODO: consider cases where we have path parameter without schema
    //TODO: support openapi 2.0 -> without schema
    input.properties.parameters.properties = {
      ...input.properties.parameters.properties,
      ...convertParameters(parameter["in"], parameter),
    };
  }
  return input;
};

const convertParameters = (
  parameterType,
  { name, required, schema = false, description = false }
) => {
  const parameter = {
    [name]: {
      in: parameterType,
      required: required,
    },
  };
  if (description) parameter[name].description = description;
  if (schema) parameter[name].schema = schema;
  return parameter;
};

const hasMandatoryParameters = (path, version) => {
  if (!hasParameters(path, version)) return false;

  if (version == 2) path.parameters = removeVersion2Parameters(path.parameters);

  const hasNotMandatory = (parameter) => !parameter.required;
  return !path.parameters.every(hasNotMandatory);
};

const hasParameters = (path, version) => {
  if (!path.parameters) return false;
  if (version == 2) {
    //TODO: in the future, support formData
    path.parameters = removeVersion2Parameters(path.parameters);
  }
  return path.parameters.length > 0;
};

const removeVersion2Parameters = (parameters) =>
  parameters.filter(
    (parameter) => parameter["in"] != "body" && parameter["in"] != "formData"
  );

module.exports = {
  hasParameters,
  hasMandatoryParameters,
  addParameter,
};
