const express = require("express");
const routes = require("require-dir")();

var package = require("./../../package.json");

module.exports = (app) => {

  app.get("/", (req, res) =>
    res.json({
      status: "Arrowhead API Its Working",
      message: `Arrowhead version ${package.version} is running`,
      description: package.description
    })
  );

  //iterate through each child route
  for(route in routes){
    const router = express.Router();
    // Initialize the route to add its functionality to router
    require(`./${route}`)(router);
    app.use(`/${route}`, router);
  }
};
