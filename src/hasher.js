const hash = require('object-hash');

module.exports = (thing) =>
    hash(JSON.stringify(thing), { algorithm: 'md5', encoding: 'base64' });