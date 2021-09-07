const express = require('express');

const gConfig = require("../config/conf.json")
const app = express();

const routesPath = "../routes";

const apiSchema = require("../api.schema.json")

const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator')

const host = gConfig.translator.host;
const port = gConfig.translator.port || 3000;

const docsSetup = async () => {
    const options = {
        swaggerOptions: {
            url: `http://${host}:${port}/openapi`
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
    //setup swagger UI
    await docsSetup();
    //run server
    return await app.listen(port);
};