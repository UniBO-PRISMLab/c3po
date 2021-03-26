const arrowHeadMetadata = require('../poolingMetadata/arrowHeadMetadata.js');
const modronMetadata = require('../poolingMetadata/modronMetadata.js');

module.exports = (router) => {
    router.route("/").get((req, res) => {
        try {
            res.json({
                modron: modronMetadata.get(),
                arrowHead: arrowHeadMetadata.get()
            });
        } catch (err) {
            res.status(503).send();

        }

    });
}