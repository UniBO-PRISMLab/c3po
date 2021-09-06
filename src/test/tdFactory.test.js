const tdFactory = require('../factory/tdFactory');
const openAPIExample1= require('./mockFiles/arrowhead_service_test.json');
const openAPIExample2= require('./mockFiles/swagger_example.json');
const openAPIExample3 = require('./mockFiles/wot_arrowhead_oas.json')

test('converts openAPI to WoT TD', () => {
  const td1 = tdFactory(openAPIExample1);
  //console.info(td1);
  expect(td1).toBeDefined();
  expect(td1).toBeInstanceOf(Object);
  
  const td2 = tdFactory(openAPIExample2);
  //console.info(JSON.stringify(td2));
  expect(td2).toBeDefined();
  expect(td2).toBeInstanceOf(Object);

  const td3 = tdFactory(openAPIExample3);
  //console.info(JSON.stringify(td3));
  expect(td3).toBeDefined();
  expect(td3).toBeInstanceOf(Object);
});
