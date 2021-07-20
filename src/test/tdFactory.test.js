const tdFactory = require('../factory/tdFactory');
const openAPIExample1= require('./arrowhead_service_test.json');
const openAPIExample2= require('./swagger_example.json');
const openAPIExample3 = require('../api.schema.json')
const service = require('./service.json')

test('converts openAPI to WoT TD', () => {
  const td1 = tdFactory(service, openAPIExample1);
  console.info(td1);
  expect(td1).toBeDefined();
  expect(td1).toBeInstanceOf(Object);
  
  const td2 = tdFactory(service, openAPIExample2);
  console.info(JSON.stringify(td2));
  expect(td2).toBeDefined();
  expect(td2).toBeInstanceOf(Object);

  const td3 = tdFactory(service, openAPIExample3);
  console.info(JSON.stringify(td3));
  expect(td3).toBeDefined();
  expect(td3).toBeInstanceOf(Object);
});
