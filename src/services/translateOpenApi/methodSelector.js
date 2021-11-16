const structureAffordance = require("./structureAffordance");

const convertRequest = {
  propertyConversion(operation, name, method) {
    const convertedOperation = {
      properties: {},
    };
    const propertyName = `${method}-${name}`;
    convertedOperation.properties[propertyName] = {};
    convertedOperation.properties[propertyName] = structureAffordance(
      operation,
      convertedOperation.properties[propertyName],
      method
    );
    return convertedOperation;
  },
  actionConversion(operation, name, method) {
    const convertedOperation = {
      actions: {},
    };
    const actionName = `${method}-${name}`;
    convertedOperation.actions[actionName] = structureAffordance(
      operation,
      convertedOperation.actions[actionName],
      method
    );
    return convertedOperation;
  },
};

module.exports = {
  get(operation, name) {
    return convertRequest.propertyConversion(operation, name, "get");
  },
  put(operation, name) {
    return convertRequest.propertyConversion(operation, name, "put");
  },
  post(operation, name) {
    return convertRequest.actionConversion(operation, name, "post");
  },
  delete(operation, name) {
    return convertRequest.actionConversion(operation, name, "delete");
  },
  patch(operation, name) {
    // ? To be implemented
    return convertRequest.actionConversion(operation, name, "patch");
  },
};
