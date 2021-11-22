const replace = require("../src/utils/replacer");

test("replacing / for .", () => {
  expect(replace.replaceSlash("uri/test/oi")).toBe("uri.test.oi");
});

test("replacing / for . with single param", () => {
  expect(replace.replaceSlash("uri/test/oi/{id}")).toBe(
    "uri.test.oi.param_id"
  );
});

test("replacing / for . with double param", () => {
  expect(replace.replaceSlash("uri/test/oi/{id}/another/{test}/uri")).toBe(
    "uri.test.oi.param_id.another.param_test.uri"
  );
});

test("replacing . for /", () => {
  expect(replace.formatUri("post-uri.test.oi")).toBe("uri/test/oi");
});
