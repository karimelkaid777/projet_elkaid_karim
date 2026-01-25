module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const { checkJwt } = require("../middlewares/jwt.middleware.js");
    const { validateRequest } = require("zod-express-middleware");
    const {
        createPollutionSchema,
        updatePollutionSchema,
        queryPollutionSchema,
        pollutionIdSchema
    } = require("../validators/pollution.validator.js");

    var router = require("express").Router();

    // GET all pollutions with optional filters
    router.get("/",
        validateRequest({ query: queryPollutionSchema }),
        pollution.get
    );

    // GET pollution by ID
    router.get("/:id",
        validateRequest({ params: pollutionIdSchema }),
        pollution.getById
    );

    // CREATE new pollution (protégée - nécessite authentification)
    router.post("/",
        checkJwt,
        validateRequest({ body: createPollutionSchema }),
        pollution.create
    );

    // UPDATE pollution by ID (protégée - nécessite authentification)
    router.put("/:id",
        checkJwt,
        validateRequest({
            params: pollutionIdSchema,
            body: updatePollutionSchema
        }),
        pollution.update
    );

    // DELETE pollution by ID (protégée - nécessite authentification)
    router.delete("/:id",
        checkJwt,
        validateRequest({ params: pollutionIdSchema }),
        pollution.delete
    );

    app.use('/api/pollution', router);
};
