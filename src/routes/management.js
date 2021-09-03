

module.exports = (router) => {
    router.route("/").get((req, res) => {
        try {
            res.json({
               todo:"add meaningful metadata",
            });
        } catch (err) {
            res.status(503).send();

        }

    });
}