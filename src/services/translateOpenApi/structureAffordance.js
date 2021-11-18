const parameters = require("./convertParameters");
const obtainSchema = require("./obtainSchema");

const structureAffordance = (operation, affordance, method, version) => {
  if (typeof affordance == "undefined") affordance = {};

  if ("description" in operation)
    affordance.description = operation.description;

  if ("summary" in operation)
    if (affordance.description !== undefined && affordance.description !== "")
      affordance.description += `| summary:${operation.summary}`;
    else affordance.description = `summary:${operation.summary}`;

  //TODO: fix that. There are problems bc it is not every time input
  //TODO: and bc schema rewrite parameters
  const schema = obtainSchema(operation, method);
  if (schema) affordance.input = schema;

  if (parameters.hasParameters(operation, version))
    affordance.input = {
      ...affordance.input,
      ...parameters.addParameter(operation),
    }; 

  return affordance;
};
module.exports = structureAffordance;
