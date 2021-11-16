const healthCheck = () => ({
  uptime: process.uptime(),
  message: "OK",
  timestamp: Date.now(),
});

module.exports = healthCheck;
