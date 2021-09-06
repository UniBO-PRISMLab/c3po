const isValidJSON = require("../validation/validateJson");

test("validating JSON", () => {
  const validObject = {
    jsonExample: "okay",
  };
  expect(isValidJSON(validObject)).toBeTruthy();

  const validString = `{ "jsonExample": "okay"}`;
  expect(isValidJSON(validString)).toBeTruthy();

  const invalid = [
    `{
    jsonExample: "okay",
    test
  }`,
    `{ "jsonExample": "okay", "error"}`,
  ];

  expect(isValidJSON(invalid[0])).toBeFalsy();
  expect(isValidJSON(invalid[1])).toBeFalsy();

});
