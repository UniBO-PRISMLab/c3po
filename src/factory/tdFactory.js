const logger = require('../logger');

const getSchema = (openApiPath) => {
    if (openApiPath.get.responses)
        if (openApiPath.get.responses["200"])
            if (openApiPath.get.responses["200"].content["application/json"])
                if (openApiPath.get.responses["200"].content["application/json"].schema)
                    return openApiPath.get.responses["200"].content["application/json"].schema;
    return false;
}

module.exports = (arrowHeadService, openApi) => {
    //const openApi = arrowHeadService.openApi;
    const td = {
        //
        "@context": [
            "https://www.w3.org/2019/wot/td/v1",
            {
                "@language": "en"
            }
        ],
        //openApi.info.title
        // urn:dev:ops:32473-WoTLamp-1234
        id: `urn:dev:${arrowHeadService.id.toString()}-${openApi.info.title.toLowerCase().replace(" ", "-")}`,
        title: openApi.info.title.toLowerCase().replace(" ", "-"),
        "securityDefinitions": {
            "nosec_sc": {
                "scheme": "nosec"
            }
        },
        "security": "nosec_sc",
        "description": openApi.info.description,
        //GET endpoints are read-only
        //GET and PUT endpoints are writable properties
        properties: {},

        //POST  are actions
        //actions: {}
    };

    const serviceUrl = `${arrowHeadService.provider.address}:${arrowHeadService.provider.port}`;

    for (const pathRaw in openApi.paths) {
        const path = pathRaw.replace('/', '');
        const application = "application/json";
        if ("get" in openApi.paths[pathRaw]) {
            td.properties[path] = {
                readOnly: true
            };
            if ("get" in openApi.paths[pathRaw] && "put" in openApi.paths[pathRaw])
                td.properties[path].readOnly = false;
            if ("description" in openApi.paths[pathRaw]["get"])
                td.properties[path].description = openApi.paths[pathRaw]["get"].description;

            const schema = getSchema(openApi.paths[pathRaw]);
            if (schema && schema.type)
                td.properties[path].type = schema.type;
        }
    }

    //TODO: add actions and improve the openapi translation
    return { td: td, serviceUrl: serviceUrl };
}