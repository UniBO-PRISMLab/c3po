const OpenAPISchemaValidator = require("openapi-schema-validator").default;

//TODO: added a way to choose OAS version - current we expect all to be v2
const validator = new OpenAPISchemaValidator({
  version: 2,
});

module.exports = (potentialOAS) => {
  try {
    const validationReport = validator.validate(potentialOAS);
    return validationReport.errors.length === 0;
  } catch (err) {
    return false;
  }
};
