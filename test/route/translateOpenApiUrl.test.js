const axios = require("axios");

const gConfig = require("../../src/config/conf.json");

//I have a bad internet connection
jest.setTimeout(30000);

test("POST /translateOpenApi/url", async () => {
  const host = gConfig.translator.host;
  const port = gConfig.translator.port || 3000;
  const openApisUrls = [
    "https://petstore.swagger.io/v2/swagger.json",
    "https://raw.githubusercontent.com/adafruit/io-api/gh-pages/v2.json",
  ];

  const headers = {
    "Content-Type": "application/json",
  };
  for (const openApisUrl of openApisUrls) {
    const response = await axios.post(
      `http://${host}:${port}/translateOpenApi/url`,
      { url: openApisUrl },
      { headers }
    );

    try {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    } catch (error) {
      error.message = `${error.message}
      \n\nresponse status: ${response.status}`;
      throw error;
    }
  }
});
