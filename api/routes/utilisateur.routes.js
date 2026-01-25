module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
    const { checkJwt } = require("../middlewares/jwt.middleware.js");
    const { validateRequest } = require("zod-express-middleware");
    const {
        createUtilisateurSchema,
        loginSchema
    } = require("../validators/utilisateur.validator.js");

    var router = require("express").Router();

    // GET all utilisateurs (protégée)
    router.get("/", checkJwt, utilisateur.getAll);

    // CREATE new utilisateur
    router.post("/",
        validateRequest({ body: createUtilisateurSchema }),
        utilisateur.create
    );

    // LOGIN utilisateur
    router.post("/login",
        validateRequest({ body: loginSchema }),
        utilisateur.login
    );

    app.use('/api/utilisateur', router);
};
