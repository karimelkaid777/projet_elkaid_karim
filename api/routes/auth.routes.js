module.exports = app => {
    const auth = require("../controllers/auth.controllers.js");
    const { validateRequest } = require("zod-express-middleware");
    const { loginSchema } = require("../validators/utilisateur.validator.js");
    const { z } = require("zod");

    var router = require("express").Router();

    // POST /api/auth/login - Login utilisateur
    router.post("/login",
        validateRequest({ body: loginSchema }),
        auth.login
    );

    // POST /api/auth/refresh - Rafraîchir l'access token
    const refreshSchema = z.object({
        refreshToken: z.string().min(1, "Refresh token requis")
    });

    router.post("/refresh",
        validateRequest({ body: refreshSchema }),
        auth.refresh
    );

    // POST /api/auth/logout - Logout utilisateur
    router.post("/logout", auth.logout);

    app.use('/api/auth', router);
};
