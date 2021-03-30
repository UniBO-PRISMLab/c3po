
const logger = require('../logger');
const poolingMetadata = require('../poolingMetadata/arrowHeadMetadata.js');

module.exports = (router) => {
  router.route("/")
    .get((req, res) => {
      try {
        res.json(poolingMetadata.get());
      } catch (err) {
        logger.error('error 503 at /arrow - service unavailable');
        res.status(503).send("wot-arrowhead adapter is currently unavailable");
      }
    })
    .post((req, res) => {
      logger.info("received a POST in /arrowhead");
      logger.debug(req);
      logger.debug(req.body);

      try {
        if (!('systemName' in req.body)) {
          logger.warn("service name send to /arrowhead does not have systemName property");
          res.status(422).send('service name does not have systemName property');
        } else if (typeof req.body.systemName !== "string") {
          logger.warn("service name send to /arrowhead is not a string");
          res.status(422).send('systemName property MUST be a string');
        } else if (poolingMetadata.isMonitoredService(req.body)) {
          logger.warn("service name send to /arrowhead already exist");
          res.status(409).send(`service name ${req.body} is already monitored`);
        } else {
          poolingMetadata.addMonitoredService(req.body.systemName);
          logger.info(`service ${req.body.systemName} successfully added to the monitored arrowhead service list`);
          res.status(200).send(`service ${req.body.systemName} successfully added to the monitored arrowhead service list`);
        }
      } catch (err) {
        logger.error('error 503 at /arrow - service unavailable');
        res.status(503).send("wot-arrowhead adapter is currently unavailable");
      }
    });
}