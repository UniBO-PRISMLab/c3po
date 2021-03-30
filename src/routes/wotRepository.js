const poolingMetadata = require('../poolingMetadata/modronMetadata');

module.exports = (router) => {
    router.route("/").get((req, res) => {
        try {
            res.json(poolingMetadata.get());
        } catch (err) {
            res.status(503).send();
        }
    });
}