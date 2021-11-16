const tdFactory = require("../../src/services/translateOpenApi");
const openAPIExample1 = require("../mockFiles/arrowhead_service_test.json");
const openAPIExample2 = require("../mockFiles/wot_arrowhead_oas.json");
const openAPIExample3 = require("../mockFiles/swagger_example.json");

test("converts gas sensor openAPI to WoT TD", () => {
  const td1 = tdFactory(openAPIExample1);
  console.info(td1);
  expect(td1).toBeDefined();
  expect(td1).toBeInstanceOf(Object);
});

test("converts wot-arrowhead adapter openAPI to WoT TD", () => {
  const td2 = tdFactory(openAPIExample2);
  //console.info(JSON.stringify(td2));
  expect(td2).toBeDefined();
  expect(td2).toBeInstanceOf(Object);
});

test("converts pet store example openAPI to WoT TD", () => {
  const td3 = tdFactory(openAPIExample3);
  //console.info(JSON.stringify(td3));
  expect(td3).toBeDefined();
  expect(td3).toBeInstanceOf(Object);
});
