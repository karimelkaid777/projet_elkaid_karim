const db = require('../models');
const Pollution = db.pollution;

const pollutionsData = [
    {
        titre: 'Déversement de produits chimiques dans la Seine',
        type_pollution: 'Chimique',
        description: 'Des produits chimiques industriels ont été déversés dans la Seine, causant une pollution importante de l\'eau. Une nappe de pollution s\'étend sur plusieurs kilomètres.',
        date_observation: new Date('2025-10-15'),
        lieu: 'Quai de la Seine, Paris 15ème',
        latitude: 48.8566,
        longitude: 2.3522,
        photo_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
    },
    {
        titre: 'Émissions toxiques usine pétrochimique',
        type_pollution: 'Air',
        description: 'L\'usine pétrochimique rejette des fumées toxiques depuis plusieurs jours, affectant gravement la qualité de l\'air du quartier résidentiel voisin.',
        date_observation: new Date('2025-11-18'),
        lieu: 'Zone industrielle de Feyzin, Lyon',
        latitude: 45.6722,
        longitude: 4.8579,
        photo_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
    },
    {
        titre: 'Dépôt sauvage de déchets toxiques',
        type_pollution: 'Dépôt sauvage',
        description: 'Découverte d\'un important dépôt de déchets toxiques (batteries, peintures, solvants) abandonné illégalement sur un terrain vague. Risque de contamination des sols.',
        date_observation: new Date('2025-11-20'),
        lieu: 'Terrain vague, Boulevard de la Liberation, Marseille',
        latitude: 43.2965,
        longitude: 5.3698,
        photo_url: null
    },
    {
        titre: 'Pollution de l\'eau par hydrocarbures',
        type_pollution: 'Eau',
        description: 'Une importante nappe d\'hydrocarbures a été détectée dans le canal, menaçant gravement la faune aquatique et l\'écosystème local.',
        date_observation: new Date('2025-11-19'),
        lieu: 'Canal de l\'Ourcq, Paris 19ème',
        latitude: 48.8838,
        longitude: 2.3883,
        photo_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
    },
    {
        titre: 'Accumulation massive de déchets plastiques',
        type_pollution: 'Plastique',
        description: 'Suite à une tempête, une accumulation massive de déchets plastiques (bouteilles, sacs, emballages) s\'est échouée sur plusieurs kilomètres de côte.',
        date_observation: new Date('2025-10-12'),
        lieu: 'Plage de la Promenade des Anglais, Nice',
        latitude: 43.6951,
        longitude: 7.2654,
        photo_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
    },
    {
        titre: 'Pic de pollution atmosphérique urbaine',
        type_pollution: 'Air',
        description: 'Pic de pollution aux particules fines (PM2.5) dû à la circulation automobile intense et aux conditions météorologiques. Niveau d\'alerte dépassé.',
        date_observation: new Date('2025-11-21'),
        lieu: 'Centre-ville, Place du Capitole, Toulouse',
        latitude: 43.6047,
        longitude: 1.4442,
        photo_url: null
    },
    {
        titre: 'Contamination des sols par pesticides',
        type_pollution: 'Chimique',
        description: 'Des analyses ont révélé une contamination importante des sols agricoles par des pesticides interdits depuis plusieurs années. Impact sur les cultures et nappes phréatiques.',
        date_observation: new Date('2025-10-17'),
        lieu: 'Plaine agricole de la Médoc, Bordeaux',
        latitude: 45.1885,
        longitude: -0.7141,
        photo_url: null
    },
    {
        titre: 'Déchets plastiques après festival',
        type_pollution: 'Plastique',
        description: 'Importante accumulation de déchets plastiques (gobelets, bouteilles, emballages alimentaires) abandonnés sur le site après le festival. Plusieurs tonnes à traiter.',
        date_observation: new Date('2025-11-22'),
        lieu: 'Parc des expositions, Strasbourg',
        latitude: 48.5734,
        longitude: 7.7521,
        photo_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
    },
    {
        titre: 'Fuite de substances toxiques dans rivière',
        type_pollution: 'Eau',
        description: 'Une fuite provenant d\'une installation industrielle a entraîné le déversement de substances toxiques dans la rivière. Mortalité importante de poissons observée.',
        date_observation: new Date('2025-11-05'),
        lieu: 'Rivière Garonne, Agen',
        latitude: 44.2028,
        longitude: 0.6161,
        photo_url: null
    },
    {
        titre: 'Dépôt illégal de gravats et amiante',
        type_pollution: 'Dépôt sauvage',
        description: 'Dépôt illégal massif de gravats de chantier contenant de l\'amiante, représentant un danger sanitaire majeur pour les riverains et l\'environnement.',
        date_observation: new Date('2025-10-28'),
        lieu: 'Forêt de Rambouillet, Yvelines',
        latitude: 48.6431,
        longitude: 1.8283,
        photo_url: null
    },
    {
        titre: 'Pollution sonore industrielle nocturne',
        type_pollution: 'Autre',
        description: 'Nuisances sonores importantes générées par l\'activité industrielle nocturne, dépassant largement les seuils réglementaires et perturbant le voisinage.',
        date_observation: new Date('2025-11-15'),
        lieu: 'Zone industrielle, Roubaix',
        latitude: 50.6942,
        longitude: 3.1746,
        photo_url: null
    },
    {
        titre: 'Pollution lumineuse excessive',
        type_pollution: 'Autre',
        description: 'Éclairage nocturne excessif d\'installations commerciales perturbant l\'écosystème local, la faune nocturne et le ciel étoilé. Non-respect de la réglementation.',
        date_observation: new Date('2025-11-10'),
        lieu: 'Zone commerciale, Montpellier',
        latitude: 43.6108,
        longitude: 3.8767,
        photo_url: null
    }
];

async function seedPollutions() {
    try {
        console.log('🌱 Démarrage du seed des pollutions...');

        // Vérifier si des pollutions existent déjà
        const count = await Pollution.count();

        if (count > 0) {
            console.log(`⚠️  La base contient déjà ${count} pollution(s).`);
            console.log('💡 Pour réinitialiser, supprimez d\'abord les données existantes.');
            return;
        }

        // Insérer les données
        const result = await Pollution.bulkCreate(pollutionsData);

        console.log(`✅ ${result.length} pollutions ont été créées avec succès !`);
        console.log('📊 Résumé des types :');

        const typeCount = {};
        result.forEach(p => {
            typeCount[p.type_pollution] = (typeCount[p.type_pollution] || 0) + 1;
        });

        Object.entries(typeCount).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
}

// Synchroniser la base de données puis lancer le seed
db.sequelize.sync().then(() => {
    seedPollutions();
});
