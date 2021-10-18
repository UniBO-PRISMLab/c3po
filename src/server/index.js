const express = require('express');

const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator')

const gConfig = require("../config/conf.json")
const apiSchema = require("../config/swagger/api.schema.json")

const routesPath = "../routes";

const host = gConfig.translator.host;
const port = gConfig.translator.port || 3000;

const app = express();

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