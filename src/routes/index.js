const express = require("express");
const routes = require("require-dir")();

const package = require("./../../package.json");

module.exports = (app) => {
  app.get("/", (_req, res) =>
    res.json({
      status: "OAS to WoT TD API Its Working",
      message: `OAS to WoT TD translator version ${package.version} is running`,
      description: package.description,
    })
  );

  //iterate through each child route
  for (route in routes) {
    const router = express.Router();
    // Initialize the route to add its functionality to router
    require(`./${route}`)(router);
    app.use(`/${route}`, router);
  }
};
