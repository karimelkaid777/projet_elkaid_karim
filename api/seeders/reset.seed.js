const db = require('../models');
const Pollution = db.pollution;
const Utilisateurs = db.utilisateurs;
const Favoris = db.favoris;

async function resetDatabase() {
    try {
        console.log('🔄 Réinitialisation de la base de données...');

        // Compter les enregistrements existants
        const pollutionCount = await Pollution.count();
        const utilisateursCount = await Utilisateurs.count();
        const favorisCount = await Favoris.count();

        console.log(`📊 ${favorisCount} favori(s), ${utilisateursCount} utilisateur(s), ${pollutionCount} pollution(s) trouvé(s)`);

        // Supprimer dans l'ordre des dépendances (favoris d'abord, puis les tables référencées)
        // Utiliser DELETE au lieu de TRUNCATE pour éviter les problèmes de foreign keys
        if (favorisCount > 0) {
            await Favoris.destroy({ where: {} });
            console.log('🗑️  Tous les favoris ont été supprimés');
        }

        if (utilisateursCount > 0) {
            await Utilisateurs.destroy({ where: {} });
            console.log('🗑️  Tous les utilisateurs ont été supprimés');
        }

        if (pollutionCount > 0) {
            await Pollution.destroy({ where: {} });
            console.log('🗑️  Toutes les pollutions ont été supprimées');
        }

        if (favorisCount === 0 && utilisateursCount === 0 && pollutionCount === 0) {
            console.log('ℹ️  Aucune donnée à supprimer');
        }

        console.log('✅ Base de données réinitialisée !');
        console.log('💡 Exécutez maintenant: npm run seed');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);
        process.exit(1);
    }
}

// Synchroniser la base de données puis réinitialiser
db.sequelize.sync().then(() => {
    resetDatabase();
});
