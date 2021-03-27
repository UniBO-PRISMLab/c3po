const express = require('express');

const gConfig = require("../config/conf.json")
const app = express();

const routesPath = "../routes";

const apiSchema = require("../api.schema.json")

const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator')
//import { OpenApiValidator } from 'express-openapi-validator';


const docsSetup = async () => {
    const options = {
        swaggerOptions: {
            url: 'http://localhost:3334/api-docs/swagger.json'
        }
    };
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
    app.use(
        OpenApiValidator.middleware({
            apiSpec: apiSchema,
            validateRequests: true,
            validateResponses: true,
        })
    );
}


module.exports.start = async () => {

    app.use(express.json());
    //Initialize routes
    await require(routesPath)(app);

    await docsSetup();

    //run server
    return await app.listen(gConfig.adapter.port);
};