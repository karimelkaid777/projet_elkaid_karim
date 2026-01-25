const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../middlewares/password.helper');
const Utilisateur = db.utilisateurs;

const utilisateursDataRaw = [
    {
        nom: 'Dupont',
        prenom: 'Jean',
        login: 'jean.dupont',
        email: 'jean.dupont@example.com',
        plainPassword: 'password123'
    },
    {
        nom: 'Martin',
        prenom: 'Marie',
        login: 'marie.martin',
        email: 'marie.martin@example.com',
        plainPassword: 'password123'
    },
    {
        nom: 'Bernard',
        prenom: 'Pierre',
        login: 'pierre.bernard',
        email: 'pierre.bernard@example.com',
        plainPassword: 'password123'
    },
    {
        nom: 'Dubois',
        prenom: 'Sophie',
        login: 'sophie.dubois',
        email: 'sophie.dubois@example.com',
        plainPassword: 'password123'
    },
    {
        nom: 'Thomas',
        prenom: 'Luc',
        login: 'luc.thomas',
        email: 'luc.thomas@example.com',
        plainPassword: 'password123'
    }
];

async function seedUtilisateurs() {
    try {
        console.log('👥 Démarrage du seed des utilisateurs...');

        // Vérifier si des utilisateurs existent déjà
        const count = await Utilisateur.count();

        if (count > 0) {
            console.log(`⚠️  La base contient déjà ${count} utilisateur(s).`);
            console.log('💡 Pour réinitialiser, supprimez d\'abord les données existantes.');
            return;
        }

        // Hasher tous les mots de passe
        console.log('🔒 Hashing des mots de passe...');
        const utilisateursData = await Promise.all(
            utilisateursDataRaw.map(async (user) => ({
                id: uuidv4(),
                nom: user.nom,
                prenom: user.prenom,
                login: user.login,
                email: user.email,
                pass: await hashPassword(user.plainPassword)
            }))
        );

        // Insérer les données
        const result = await Utilisateur.bulkCreate(utilisateursData);

        console.log(`✅ ${result.length} utilisateurs ont été créés avec succès !`);
        console.log('📋 Liste des utilisateurs de test :');
        console.log('');

        result.forEach(u => {
            console.log(`   👤 ${u.prenom} ${u.nom}`);
            console.log(`      Login: ${u.login}`);
            console.log(`      Password: password123`);
            console.log('');
        });

        console.log('💡 Tous les mots de passe sont: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
}

// Synchroniser la base de données puis lancer le seed
db.sequelize.sync().then(() => {
    seedUtilisateurs();
});
