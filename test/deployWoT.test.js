const axios = require("axios");

const gConfig = require("../src/config/conf.json");

const host = gConfig.translator.host;
const port = gConfig.translator.port || 3000;
const openApis = [
  require("./mockFiles/wot_arrowhead_oas.json"),
  require("./mockFiles/openapi_gas_sensor.json"),
  require("./mockFiles/swagger_example.json"),
];

test("POST /deployWoT", async () => {
  for (const openApi of openApis) {
    const response = await axios.post(
      `http://${host}:${port}/deployWoT`,
      openApi
    );

    try {
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
    } catch (error) {
      error.message = `${error.message}\n\n response status: ${response.status}`;
      throw error;
    }
  }
});
