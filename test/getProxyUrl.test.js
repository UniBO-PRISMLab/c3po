const getProxyUrl = require("../src/utils/getProxyUrl");

const oasExampleV2 = require("./mockFiles/swagger_example.json");
const oasExampleV3 = require("./mockFiles/swagger_example_v3.json");

test("test getting url from OpenAPI Specification version 2", async () => {
  expect(getProxyUrl(oasExampleV2)).toStrictEqual([
    "https://petstore.swagger.io/v2",
    "http://petstore.swagger.io/v2",
  ]);
});

test("test getting url from OpenAPI Specification version 3", async () => {
  expect(getProxyUrl(oasExampleV3)).toStrictEqual([
    "https://petstore3.swagger.io/api/v3",
  ]);
});
