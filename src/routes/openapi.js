const swagger = require('../api.schema.json')

module.exports = (router) => {
    router.route("/").get((req, res) => {
      try {
        res.json(swagger);
      } catch (err) {
        res.status(503).send();
      }
    });
  }