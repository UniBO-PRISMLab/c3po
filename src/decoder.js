const decode = require('js-base64').decode;
const parser = require('fast-xml-parser');
const he = require('he');


const decodeService = (codedService) => {
    const wsdl = decode(codedService.metadata.WSDL);
    const options = {
        attributeNamePrefix: "",
        attrNodeName: false, //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    };

    return parser.parse(wsdl, options);
}

module.exports = { decodeService };