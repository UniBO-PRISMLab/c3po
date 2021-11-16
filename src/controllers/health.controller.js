const healthCheckService = require("./../services/health.service");

const healthCheck = (_req, res) => {
  try {
    res.status(200).send(healthCheckService());
  } catch (err) {
    res.status(503).send({ error: err });
  }
};

module.exports = healthCheck;
