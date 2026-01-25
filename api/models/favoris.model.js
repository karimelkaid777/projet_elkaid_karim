module.exports = (sequelize, Sequelize) => {
    const Favoris = sequelize.define("favoris", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        utilisateur_id: {
            type: Sequelize.STRING, // UUID stocké comme string
            allowNull: false,
            references: {
                model: 'utilisateurs',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        pollution_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'pollution',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        // Index unique pour éviter les doublons (un utilisateur ne peut ajouter la même pollution qu'une fois)
        indexes: [
            {
                unique: true,
                fields: ['utilisateur_id', 'pollution_id']
            }
        ]
    });

    return Favoris;
};
