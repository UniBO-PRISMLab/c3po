const replace = require("../src/utils/replacer");

test("replacing / for .", () => {
  expect(replace.replaceSlash("uri/test/oi")).toBe("uri.test.oi");
});

test("replacing . for /", () => {
  expect(replace.includeSlash("uri.test.oi")).toBe("uri/test/oi");
});
