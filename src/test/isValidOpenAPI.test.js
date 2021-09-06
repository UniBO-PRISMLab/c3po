const validator = require("../utils/validateOAS");

const openApis = [
  require("./mockFiles/wot_arrowhead_oas.json"),
  require("./mockFiles/openapi_gas_sensor.json"),
  require("./mockFiles/swagger_example.json"),
];

for (const openApi of openApis)
  test("validating OpenAPI specification", () => {
    expect(validator.isValidOAS(openApi)).toBeTruthy();
  });

const invalidOAS = {
  name: "invalid",
  version: 1.0,
  routes: {
    firstRoute: "/index",
    secondRoute: "/client",
  },
};

test("validating OpenAPI specification", () => {
  expect(validator.isValidOAS(invalidOAS)).toBeFalsy();
});
