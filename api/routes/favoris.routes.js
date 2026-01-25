module.exports = app => {
    const favoris = require("../controllers/favoris.controllers.js");
    const { checkJwt } = require('../middlewares/jwt.middleware');
    const { validateRequest } = require("zod-express-middleware");
    const { addFavoriSchema, favoriIdParamSchema } = require("../validators/favoris.validator.js");

    var router = require("express").Router();

    // Toutes les routes favoris nécessitent une authentification
    router.use(checkJwt);

    // GET /api/favoris - Récupérer mes favoris
    router.get("/", favoris.getMesFavoris);

    // POST /api/favoris - Ajouter un favori
    router.post("/",
        validateRequest({ body: addFavoriSchema }),
        favoris.addFavori
    );

    // DELETE /api/favoris/:pollutionId - Retirer un favori
    router.delete("/:pollutionId",
        validateRequest({ params: favoriIdParamSchema }),
        favoris.removeFavori
    );

    // DELETE /api/favoris (sans paramètre) - Supprimer tous les favoris
    // Note: Cette route doit être après la route avec paramètre pour éviter les conflits
    router.delete("/", favoris.clearFavoris);

    app.use('/api/favoris', router);
};
