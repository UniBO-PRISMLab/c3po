const healthCheckController = require("../controllers/health.controller");

module.exports = (router) => {
  router.get("/", async (_req, res, _next) => healthCheckController(_req, res));
};
