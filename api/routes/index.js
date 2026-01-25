module.exports = app => {
  require("./auth.routes")(app);
  require("./catalogue.routes")(app);
  require("./utilisateur.routes")(app);
  require("./pollution.routes")(app);
  require("./favoris.routes")(app);
}
