const { checkJwt } = require("../middlewares/jwt.middleware.js");

module.exports = app => {
    const catalogue = require("../controllers/catalogue.controllers.js");

    var router = require("express").Router();

    // Exemple pour protéger une route avec le middleware checkJwt
    router.get("/", checkJwt, catalogue.get);

    app.use('/api/catalogue', router);
  };
