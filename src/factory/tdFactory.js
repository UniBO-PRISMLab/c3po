const logger = require('../logger');

module.exports = (wsdl) => {
    //console.info(wsdl);
    const td = {
        //
        "@context": [
            "https://www.w3.org/2019/wot/td/v1",
            {
                "@language": "en"
            }
        ],
        title: wsdl.service.name,
        "securityDefinitions": {
            "nosec_sc": {
                "scheme": "nosec"
            }
        },
        "security": "nosec_sc",
        //GET endpoints are read-only
        //GET and PUT endpoints are writable properties
        properties: {},
        //POST  are actions
        actions: {}
    };
    //only one property per wsdl??
    if (wsdl.types['element'] !== undefined) {
        td.properties[wsdl.types.element.name] = {
            readOnly: true,
            //TODO: parse type
            type: wsdl.types.element.type
        }
    }

    //TODO: that binding does not make sense! 
    wsdl.interface.operation.forEach(operation => {
        if (operation["name"] !== undefined) {

            td.actions[operation["name"]] = {
                description: "",
                uriVariables: {},
            }
            //TODO: check correct way to determine uriVariables
            //td.actions[operation["name"]].uriVariables[operation.input.element] = {
            //"type": td["properties"][operation.output.element]["type"]
            // }
        } else {
            logger.error(`ArrowHead WSDL ${wsdl.service.name} operation property does not have the correct format`);
        }
    });

    return td;
}