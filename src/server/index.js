const express = require('express');

const gConfig = require("../config/conf.json")
const app = express();

const routesPath = "../routes";

module.exports.start = async () => {

    app.use(express.json());

    //Initialize routes
    require(routesPath)(app);

    //run server
    return await app.listen(gConfig.adapter.port);    
};