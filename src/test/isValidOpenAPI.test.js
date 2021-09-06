const isValidOAS = require("../utils/validateOAS");

test("validating OpenAPI specification", () => {
  const validOAS = require("./mockFiles/swagger_example.json");
  expect(isValidOAS(validOAS)).toBeTruthy();

  const invalidOAS = {
    name: "invalid",
    version: 1.0,
    routes: {
      firstRoute: "/index",
      secondRoute: "/client",
    }
  };
  expect(isValidOAS(invalidOAS)).toBeFalsy();

});
