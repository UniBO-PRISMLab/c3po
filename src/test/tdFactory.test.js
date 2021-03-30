const tdFactory = require('../factory/tdFactory');
const openAPIExample = require('./arrowhead_service_test.json');


test('converts openAPI to WoT TD', () => {
  const td = tdFactory(openAPIExample);
  console.log(td);
  expect(td).toBeDefined();
  expect(td).toBeInstanceOf(Object);
});
