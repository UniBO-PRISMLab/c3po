
module.exports = (router) => {
    router.get('/', async (_req, res, _next) => {

        const healthCheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        
        try {
            res.send(healthCheck);
        } catch (err) {
            healthCheck.message = err;
            res.status(503).send();
        }
    });
}