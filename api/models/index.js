const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');
const sequelize = new Sequelize(`postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`
,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true,
      native:true
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);
db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.favoris = require("./favoris.model.js")(sequelize, Sequelize);

// Définir les relations
db.favoris.belongsTo(db.utilisateurs, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
db.favoris.belongsTo(db.pollution, { foreignKey: 'pollution_id', as: 'pollution' });

db.utilisateurs.hasMany(db.favoris, { foreignKey: 'utilisateur_id', as: 'favoris' });
db.pollution.hasMany(db.favoris, { foreignKey: 'pollution_id', as: 'favoris' });

module.exports = db;
