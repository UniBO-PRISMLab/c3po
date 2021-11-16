const logger = require("../config/logger");
const OpenAPISchemaValidator = require("openapi-schema-validator").default;

const generateValidator = (version) =>
  new OpenAPISchemaValidator({
    version: version,
  });

const getReport = (potentialOAS) => {
  try {
    const validator = generateValidator(potentialOAS.openapi ? 3 : 2);
    const validationReport = validator.validate(potentialOAS);
    logger.debug(validationReport);
    return validationReport;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const isValidOAS= (potentialOAS) => {
  const report = getReport(potentialOAS);
  return report ? report.errors.length === 0 : false;
};

module.exports = {
  getReport,
  isValidOAS
} 
