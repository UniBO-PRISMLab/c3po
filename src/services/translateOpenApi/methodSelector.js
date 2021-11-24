const structureAffordance = require("./structureAffordance");

const convertRequest = {
  propertyConversion(operation, name, version, method) {
    const convertedOperation = {
      properties: {},
    };
    const propertyName = `${method}-${name}`;
    convertedOperation.properties[propertyName] = {};
    convertedOperation.properties[propertyName] = structureAffordance(
      operation,
      convertedOperation.properties[propertyName],
      method,
      version
    );
    return convertedOperation;
  },
  actionConversion(operation, name, version, method) {
    const convertedOperation = {
      actions: {},
    };
    const actionName = `${method}-${name}`;
    convertedOperation.actions[actionName] = structureAffordance(
      operation,
      convertedOperation.actions[actionName],
      method,
      version
    );
    return convertedOperation;
  },
};

//TODO: convert all this inputs in an object to improve readability
module.exports = {
  get(operation, name, version) {
    return convertRequest.propertyConversion(operation, name, version, "get");
  },
  put(operation, name, version) {
    return convertRequest.propertyConversion(operation, name, version, "put");
  },
  post(operation, name, version) {
    return convertRequest.actionConversion(operation, name, version, "post");
  },
  delete(operation, name, version) {
    return convertRequest.actionConversion(operation, name, version, "delete");
  },
  patch(operation, name, version) {
    return convertRequest.propertyConversion(operation, name, version, "patch");
  },
};
